import React, { useRef } from 'react';
import { CheckCircle, AlertCircle, Upload, Camera } from 'lucide-react';

export default function PredictionResult({ 
  prediction, 
  onSelectAgain, 
  onTakeAgain 
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSelectAgain(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fallback threshold
  const confidenceThreshold = 0.60;
  const isConfident = prediction.confidence >= confidenceThreshold;

  return (
    <div className="w-full max-w-md mx-auto mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {isConfident ? (
        <div className="p-6 glass rounded-2xl mb-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold">Analysis Complete</h3>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-muted-foreground">Detected Type</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-500 drop-shadow-sm">
                {prediction.class}
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-mono font-medium">{(prediction.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary via-orange-400 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${prediction.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-destructive/20 border border-destructive/50 rounded-2xl mb-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-destructive-foreground" />
            <h3 className="text-xl font-bold text-destructive-foreground">Not a Noodle!</h3>
          </div>
          <p className="text-destructive-foreground/90">
            This doesn't look like any of the noodles I know (Spaghetti, Ramen, or Udon). 
            Are you sure this is a noodle?
          </p>
          <div className="mt-4 pt-4 border-t border-destructive/20">
            <div className="flex justify-between text-sm text-destructive-foreground/70">
              <span>Best guess: {prediction.class}</span>
              <span>Confidence: {(prediction.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-xl font-medium transition-colors shadow-md"
        >
          <Upload className="w-4 h-4" />
          Select Again
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        <button 
          onClick={onTakeAgain}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-xl font-medium transition-colors shadow-md"
        >
          <Camera className="w-4 h-4" />
          Take Again
        </button>
      </div>
    </div>
  );
}
