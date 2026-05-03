import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from './components/Header';
import UploadOptions from './components/UploadOptions';
import CameraCapture from './components/CameraCapture';
import ImageActionState from './components/ImageActionState';
import PredictionResult from './components/PredictionResult';

export default function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      setPrediction(null);
      setError(null);
      setCameraActive(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (file, dataUrl) => {
    setImageFile(file);
    setImageSrc(dataUrl);
    setCameraActive(false);
    setPrediction(null);
    setError(null);
  };

  const predictImage = async () => {
    if (!imageFile) return;
    
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to get prediction. Ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setImageSrc(null);
    setImageFile(null);
    setPrediction(null);
    setError(null);
    setCameraActive(false);
  };

  const openCamera = () => {
    setImageSrc(null);
    setImageFile(null);
    setPrediction(null);
    setCameraActive(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-6 sm:p-12 font-sans">
      <div className="w-full max-w-3xl glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden z-10">
        
        <Header />

        {error && (
          <div className="bg-destructive/20 border border-destructive/50 text-destructive-foreground p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-8">
          <div className="flex flex-col items-center w-full">
            {cameraActive ? (
              <CameraCapture 
                onCapture={handleCameraCapture} 
                onCancel={() => setCameraActive(false)} 
                onError={setError} 
              />
            ) : imageSrc ? (
              <>
                <ImageActionState 
                  imageSrc={imageSrc} 
                  loading={loading}
                  onClassify={predictImage}
                  onSelectAnother={handleFileUpload}
                  onTakeAnother={openCamera}
                  hideActions={!!prediction && !loading}
                />
                
                {prediction && !loading && (
                  <PredictionResult 
                    prediction={prediction}
                    onSelectAgain={handleFileUpload}
                    onTakeAgain={openCamera}
                  />
                )}
              </>
            ) : (
              <UploadOptions 
                onFileUpload={handleFileUpload} 
                onCameraSelect={openCamera} 
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
    </div>
  );
}
