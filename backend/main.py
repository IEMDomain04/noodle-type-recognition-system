from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.model import predict_image

app = FastAPI(title="Noodle Recognition API")

# Allow CORS so the React frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Noodle Recognition API!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    contents = await file.read()
    
    # Run the image through the PyTorch model
    prediction_result = predict_image(contents)
    
    if "error" in prediction_result:
        raise HTTPException(status_code=500, detail=prediction_result["error"])
        
    return prediction_result
