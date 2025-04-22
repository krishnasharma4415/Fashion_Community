import os
import torch
import numpy as np
from PIL import Image
import torchvision.transforms as transforms
from torchvision import models
from pathlib import Path

# Initialize ResNet50 model
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)  # Updated to use 'weights' instead of 'pretrained'
model.eval()

# Define image preprocessing transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def preprocess_dataset(data_path, split='train', limit=400):
    image_dir = Path(data_path) / "image"  # Directly point to the 'image' folder
    if not image_dir.exists():
        raise FileNotFoundError("Image directory not found: {}".format(image_dir))

    image_paths = [str(img_path) for img_path in image_dir.glob('*.jpg')]
    features = []
    for count, path in enumerate(image_paths):
        if count >= limit:
            break
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
    np.save("cached_features_{}.npy".format(split), features)
    print("Saved {} features to cached_features_{}.npy".format(len(features), split))

if __name__ == "__main__":
    data_path = "D:/Fashion_Community/fashion_recommender/path_to_image_folder"
    for split in ['train']:
        print("Preprocessing {} split...".format(split))
        preprocess_dataset(data_path, split)