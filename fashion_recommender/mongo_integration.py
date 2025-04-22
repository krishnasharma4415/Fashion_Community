import os
import torch
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import torchvision.transforms as transforms
from torchvision import models
from pymongo import MongoClient
import faiss
from sklearn.preprocessing import normalize

# Initialize MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['fashiondb']
posts_collection = db['posts']

# Initialize ResNet50 model
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
model.eval()

# Image preprocessing transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def load_image_from_url(url):
    """Load image from URL and preprocess it"""
    try:
        response = requests.get(f"http://localhost:3000{url}")  # Adjust base URL as needed
        img = Image.open(BytesIO(response.content)).convert('RGB')
        return transform(img).unsqueeze(0)
    except Exception as e:
        print(f"Error loading image from URL {url}: {e}")
        return None

def extract_features_from_url(image_url):
    """Extract features from an image URL"""
    img_tensor = load_image_from_url(image_url)
    if img_tensor is not None:
        with torch.no_grad():
            return model(img_tensor).flatten().numpy()
    return np.zeros((2048,))

def get_all_posts_features():
    """Fetch all posts and extract their image features"""
    posts = list(posts_collection.find({"media.type": "image"}))
    features = []
    valid_posts = []
    
    for post in posts:
        if post['media'] and post['media'][0]['type'] == 'image':
            image_url = post['media'][0]['url']
            feature = extract_features_from_url(image_url)
            features.append(feature)
            valid_posts.append(post)
    
    return np.array(features), valid_posts

def build_faiss_index(features):
    """Build FAISS index from features"""
    features = normalize(features)
    dim = features.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(features)
    return index

def get_similar_posts(post_id, top_n=5):
    """Get similar posts for a given post ID"""
    # Get all posts and features
    features, posts = get_all_posts_features()
    
    # Find the index of the query post
    query_idx = None
    for idx, post in enumerate(posts):
        if str(post['_id']) == post_id or str(post['postId']) == post_id:
            query_idx = idx
            break
    
    if query_idx is None:
        return []
    
    # Build index and search
    index = build_faiss_index(features)
    query_vector = normalize(features[query_idx].reshape(1, -1))
    _, indices = index.search(query_vector, top_n + 1)
    
    # Prepare results
    results = []
    for i in indices[0]:
        if i == query_idx:
            continue
        similar_post = posts[i]
        similar_post['similarity_score'] = float(np.dot(
            normalize(features[query_idx].reshape(1, -1)),
            normalize(features[i].reshape(1, -1)).T
        ))
        results.append(similar_post)
        if len(results) >= top_n:
            break
    
    return results