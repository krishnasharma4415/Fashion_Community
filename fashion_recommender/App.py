from flask import Flask, jsonify
from bson.objectid import ObjectId
from recommendation_service import RecommendationService
import asyncio

app = Flask(__name__)
service = RecommendationService()

@app.route('/')
def home():
    return 'Recommendation API is running!'

@app.route('/api/recommendations/<user_id>')
def get_recommendations(user_id):
    try:
        user_object_id = ObjectId(user_id)
        
        recs = asyncio.run(service.generate_recommendations(user_object_id))
        
        return jsonify(recs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
