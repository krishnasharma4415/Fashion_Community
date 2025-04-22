import os
import json
import torch
import faiss
import numpy as np
from PIL import Image
import pandas as pd
from pathlib import Path
import torchvision.transforms as transforms
from torchvision import models
from sklearn.preprocessing import normalize

# Initialize ResNet50 model in PyTorch
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
model.eval()

# Define image preprocessing transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def check_dataset_paths(data_path, csv_path, image_dir):
    """Check if required dataset paths exist."""
    if not csv_path.exists() or not image_dir.exists():
        raise FileNotFoundError("Missing CSV or image directory at {}".format(data_path))

def load_metadata(csv_path):
    """Load metadata from the CSV file."""
    return pd.read_csv(csv_path)

def process_item(row, image_dir, annos_dir, count, limit):
    """Process a single row to create metadata if conditions are met."""
    image_id = Path(row['path']).stem if 'path' in row else str(count)
    img_path = image_dir / f"{image_id}.jpg"
    anno_path = annos_dir / f"{image_id}.json"

    if img_path.exists() and anno_path.exists():
        try:
            with open(anno_path, 'r') as f:
                ann = json.load(f)
            item = ann.get('item1', {})
            category = item.get('category_name', row.get('category_i_category_r_scale', 'unknown').split('_')[0] if '_' in row.get('category_i_category_r_scale', '') else 'unknown')
            return {
                'image_path': str(img_path),
                'image_id': image_id,
                'category': category,
                'style': item.get('style', 'unknown'),
                'segmentat_landmarks_b_box': row.get('segmentat_landmarks_b_box', 'unknown'),
                'viewpoint_occlusion_zoom_in': row.get('viewpoint_occlusion_zoom_in', 'unknown'),
                'img_height_img_width': row.get('img_height_img_width', 'unknown')
            }
        except Exception as e:
            print("Error reading annotation {}: {}".format(anno_path, e))
    return None

def load_dataset(data_path, split='train', limit=400):
    """
    Load dataset using CSV and JSON files.
    Args:
        data_path (str): Path to dataset folder.
        split (str): Dataset split ('train', 'validation', or 'test').
        limit (int): Number of images to process.
    Returns:
        list: List of dictionaries with image metadata.
    """
    data_path = Path(data_path)
    csv_path = data_path / "train.csv"
    image_dir = data_path / "image"
    annos_dir = data_path / "annos"

    check_dataset_paths(data_path, csv_path, image_dir)

    df = load_metadata(csv_path)
    dataset = []
    count = 0

    for _, row in df.iterrows():
        if count >= limit:
            break
        metadata = process_item(row, image_dir, annos_dir, count, limit)
        if metadata:
            dataset.append(metadata)
            count += 1

    print("Loaded {} items from {} split.".format(len(dataset), split))
    return dataset

def extract_features(image_paths, cache_file="features.npy"):
    if os.path.exists(cache_file):
        print("Loading cached features...")
        return np.load(cache_file)
    print("Extracting features...")
    features = []
    for path in image_paths:
        try:
            img = Image.open(path).convert('RGB')
            img = transform(img)
            img = img.unsqueeze(0)
            with torch.no_grad():
                feat = model(img)
            features.append(feat.flatten().numpy())
        except Exception as e:
            print("Error processing {}: {}".format(path, e))
            features.append(np.zeros((2048,)))
    features = np.array(features)
    np.save(cache_file, features)
    print("Saved features to {}".format(cache_file))
    return features

def build_faiss_index(features):
    features = normalize(features)
    dim = features.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(features)
    return index

def get_recommendations_faiss(post_id, dataset, features, index, top_n=5, filter_category=True):
    id_to_index = {item['image_id']: i for i, item in enumerate(dataset)}
    idx = id_to_index.get(post_id)
    if idx is None:
        print("Post ID {} not found.".format(post_id))
        return []
    query_vector = normalize(features[idx].reshape(1, -1))
    _, indices = index.search(query_vector, top_n + 1)
    recommendations = []
    for i in indices[0]:
        if i == idx:
            continue
        if filter_category and dataset[i]['category'] != dataset[idx]['category']:
            continue
        rec = dataset[i].copy()
        rec['similarity'] = float(np.dot(normalize(features[idx].reshape(1, -1)), normalize(features[i].reshape(1, -1)).T))
        recommendations.append(rec)
        if len(recommendations) >= top_n:
            break
    return recommendations

def main():
    data_path = "D:/Fashion_Community/fashion_recommender/path_to_image_folder"
    splits = ['train']
    all_datasets = {}
    for split in splits:
        print("Processing {} split...".format(split))
        all_datasets[split] = load_dataset(data_path, split, limit=400)
    
    dataset = all_datasets['train']
    if not dataset:
        print("Train dataset is empty. Exiting.")
        return
    
    image_paths = [item['image_path'] for item in dataset]
    features = extract_features(image_paths, cache_file="cached_features_train.npy")
    index = build_faiss_index(features)
    
    sample_post_id = dataset[398]['image_id']
    print("\nRecommendations for post {} (train split):".format(sample_post_id))
    recommendations = get_recommendations_faiss(sample_post_id, dataset, features, index, top_n=5)
    
    for rec in recommendations:
        print("Post ID: {}, Category: {}, Style: {}, Similarity: {:.4f}".format(
            rec['image_id'], rec['category'], rec['style'], rec['similarity']))

if __name__ == "__main__":
    main()
