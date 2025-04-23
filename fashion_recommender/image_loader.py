from pathlib import Path

def load_images_from_folder(image_folder_path, limit=400):
    
    image_folder = Path(image_folder_path)
    print(f"Checking path: {image_folder}")
    if not image_folder.exists():
        raise FileNotFoundError(f"Image folder not found: {image_folder}")
    print("Path exists, listing files...")

    image_paths = [img_path for img_path in image_folder.glob('*.jpg')]
    print(f"Found {len(image_paths)} .jpg files")
    dataset = []
    for count, img_path in enumerate(image_paths):
        if count >= limit:
            break
        image_id = img_path.stem
        dataset.append({
            'image_path': str(img_path),
            'image_id': image_id,
            'category': 'unknown',
            'style': 'unknown',
            'segmentat_landmarks_b_box': 'unknown',
            'viewpoint_occlusion_zoom_in': 'unknown',
            'img_height_img_width': 'unknown'
        })
    print(f"Loaded {len(dataset)} images from {image_folder}")
    return dataset

if __name__ == "__main__":
    data_path = "D:/Fashion_Community/fashion_recommender/path_to_image_folder/image"
    dataset = load_images_from_folder(data_path)
    print(f"Final dataset size: {len(dataset)}")