import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import os

CLASS_NAMES = ['0_spaghetti', '1_ramen', '2_udon']

def create_resnet18(num_classes=3):
    # Create the ResNet18 model without pre-trained weights
    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    # Modify the final layer to output the number of classes we have (3)
    model.fc = nn.Linear(num_ftrs, num_classes)
    return model

# Initialize device and model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = create_resnet18(num_classes=3)

# Load the trained weights
model_path = os.path.join(os.path.dirname(__file__), 'best_resnet18_noodles.pth')
if os.path.exists(model_path):
    checkpoint = torch.load(model_path, map_location=device, weights_only=False)
    # The saved checkpoint might be nested in 'model_state_dict' as per train.py
    if 'model_state_dict' in checkpoint:
        model.load_state_dict(checkpoint['model_state_dict'])
    else:
        model.load_state_dict(checkpoint)
else:
    print(f"Warning: Model weights not found at {model_path}. Model will use random weights.")

model.to(device)
model.eval()

# Preprocessing transforms (identical to train.py validation transforms)
val_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                       std=[0.229, 0.224, 0.225])
])

def predict_image(image_bytes):
    try:
        # Load and preprocess image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        input_tensor = val_transform(image).unsqueeze(0).to(device)
        
        # Inference
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, preds = torch.max(probabilities, 1)
            
        class_idx = preds.item()
        
        # Format the class name (e.g., '0_spaghetti' -> 'Spaghetti')
        class_name = CLASS_NAMES[class_idx].split('_')[1].capitalize()
        
        return {
            "class": class_name,
            "confidence": float(confidence.item())
        }
    except Exception as e:
        return {"error": str(e)}
