from flask import Flask, jsonify
from bson.objectid import ObjectId
from recommendation_service import RecommendationService
import asyncio

app = Flask(__name__)
service = RecommendationService()

# Health check route to verify the server is running
@app.route('/')
def home():
    return 'Recommendation API is running!'

# Route to get recommendations by user_id
@app.route('/api/recommendations/<user_id>')
def get_recommendations(user_id):
    try:
        # Validate ObjectId format
        user_object_id = ObjectId(user_id)
        
        # Create a new event loop for async call
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        recs = loop.run_until_complete(service.generate_recommendations(user_object_id))
        return jsonify(recs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
