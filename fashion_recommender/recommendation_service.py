import redis
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from bson.objectid import ObjectId
import os
import json

# Initialize Redis and MongoDB
redis_client = redis.Redis(host='localhost', port=6379, db=0)
mongo_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongo_client['fashion_platform']

class RecommendationService:
    def __init__(self):
        self.posts = db.posts
        self.users = db.users
        self.user_activities_log = db.user_activities_log
        self.tfidf = TfidfVectorizer(stop_words='english')

    def calculate_content_similarity(self, tags1, tags2):
        tags_text = [' '.join(tags1), ' '.join(tags2)]
        tfidf_matrix = self.tfidf.fit_transform(tags_text)
        return cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]

    async def find_similar_users(self, user_id):
        user_activities_log = list(self.user_activities_log.find({"user_id": user_id}))
        all_users = self.user_activities_log.distinct("user_id")

        similarities = []
        for other_user_id in all_users:
            if other_user_id == user_id:
                continue
            other_activities = list(self.user_activities_log.find({"user_id": other_user_id}))
            common = len(set(a["post_id"] for a in user_activities_log) & 
                         set(a["post_id"] for a in other_activities))
            if len(user_activities_log) * len(other_activities) == 0:
                continue
            similarity = common / np.sqrt(len(user_activities_log) * len(other_activities))
            similarities.append((other_user_id, similarity))

        return sorted(similarities, key=lambda x: x[1], reverse=True)[:5]

    async def generate_recommendations(self, user_id):
        cache_key = f"recs:{str(user_id)}"
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached.decode())

        try:
            user_activities_log = list(self.user_activities_log.find({"user_id": user_id})
                                   .sort("created_at", -1).limit(50))

            content_weights = {}
            for activity in user_activities_log:
                post = self.posts.find_one({"_id": activity["post_id"]})
                if not post:
                    continue
                for tag in post.get("tags", []):
                    content_weights[tag] = content_weights.get(tag, 0) + 1

            similar_users = await self.find_similar_users(user_id)
            similar_user_ids = [u[0] for u in similar_users]

            collaborative_posts = list(self.user_activities_log.find({
                "user_id": {"$in": similar_user_ids}
            }))

            all_posts = list(self.posts.find())
            max_likes = max((p.get("likes", 0) for p in all_posts), default=1)
            max_saves = max((p.get("saves", 0) for p in all_posts), default=1)
            max_views = max((p.get("views", 0) for p in all_posts), default=1)

            scored_posts = []
            for post in all_posts:
                content_score = sum(content_weights.get(tag, 0) for tag in post.get("tags", []))
                collab_score = sum(1 for p in collaborative_posts if p["post_id"] == post["_id"])

                engagement_score = 0.4 * post.get("likes", 0) / max_likes + \
                                   0.3 * post.get("saves", 0) / max_saves + \
                                   0.3 * post.get("views", 0) / max_views

                # Add followers and profile views
                user_profile = self.users.find_one({"_id": post["user_id"]})
                if user_profile:
                    followers = user_profile.get("followers_count", 0)
                    profile_views = user_profile.get("profile_views", 0)
                    engagement_score += 0.1 * followers + 0.1 * profile_views

                scored_posts.append({
                    **post,
                    "score": 0.5 * content_score + 0.3 * collab_score + 0.2 * engagement_score
                })

            recommendations = sorted(scored_posts, key=lambda x: x["score"], reverse=True)[:100]

            # Cache the results safely
            redis_client.setex(cache_key, 3600, json.dumps(recommendations, default=str))
            return recommendations

        except Exception as e:
            print(f"Recommendation error: {str(e)}")
            return []
