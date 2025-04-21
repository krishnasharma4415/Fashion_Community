from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json
import redis.asyncio as aioredis
import os

class RecommendationService:
    def __init__(self):
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.client = AsyncIOMotorClient(mongo_uri)
        self.db = self.client["fashion_platform"]
        self.posts = self.db.posts
        self.users = self.db.users
        self.user_logs = self.db.user_activities_log
        self.redis = None
        self.tfidf = TfidfVectorizer(stop_words="english")

    async def init_redis(self):
        self.redis = aioredis.Redis(host='localhost', port=6379, db=0)

    def calculate_similarity(self, tags1, tags2):
        tags_text = [' '.join(tags1), ' '.join(tags2)]
        tfidf_matrix = self.tfidf.fit_transform(tags_text)
        return cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0]

    async def find_similar_users(self, user_id):
        current_logs = await self.user_logs.find({"user_id": user_id}).to_list(None)
        all_users = await self.user_logs.distinct("user_id")

        similarities = []
        for other_id in all_users:
            if other_id == user_id:
                continue
            other_logs = await self.user_logs.find({"user_id": other_id}).to_list(None)
            common = len(set(l["post_id"] for l in current_logs) & set(l["post_id"] for l in other_logs))
            denom = np.sqrt(len(current_logs) * len(other_logs))
            if denom == 0:
                continue
            similarities.append((other_id, common / denom))

        return sorted(similarities, key=lambda x: x[1], reverse=True)[:5]

    async def generate_recommendations(self, user_id):
        cache_key = f"recs:{str(user_id)}"
        cached = await self.redis.get(cache_key)
        if cached:
            return json.loads(cached)

        user_logs = await self.user_logs.find({"user_id": user_id}).sort("timestamp", -1).to_list(50)
        content_weights = {}

        for log in user_logs:
            post = await self.posts.find_one({"_id": log.get("post_id")})
            if post:
                for tag in post.get("tags", []):
                    content_weights[tag] = content_weights.get(tag, 0) + 1

        similar_users = await self.find_similar_users(user_id)
        sim_user_ids = [u[0] for u in similar_users]

        collaborative_logs = await self.user_logs.find({"user_id": {"$in": sim_user_ids}}).to_list(None)
        all_posts = await self.posts.find().to_list(None)

        max_likes = max((p.get("likes", 0) for p in all_posts), default=1)
        max_saves = max((p.get("saves", 0) for p in all_posts), default=1)
        max_views = max((p.get("views", 0) for p in all_posts), default=1)

        recommendations = []
        for post in all_posts:
            content_score = sum(content_weights.get(tag, 0) for tag in post.get("tags", []))
            collab_score = sum(1 for l in collaborative_logs if l.get("post_id") == post["_id"])

            eng_score = 0.4 * post.get("likes", 0) / max_likes + \
                        0.3 * post.get("saves", 0) / max_saves + \
                        0.3 * post.get("views", 0) / max_views

            user_profile = await self.users.find_one({"_id": post["user_id"]})
            if user_profile:
                eng_score += 0.1 * user_profile.get("followers_count", 0)
                eng_score += 0.1 * user_profile.get("profile_views", 0)

            post["score"] = 0.5 * content_score + 0.3 * collab_score + 0.2 * eng_score
            recommendations.append(post)

        top_recs = sorted(recommendations, key=lambda x: x["score"], reverse=True)[:100]
        await self.redis.set(cache_key, json.dumps(top_recs, default=str), ex=3600)
        return top_recs
