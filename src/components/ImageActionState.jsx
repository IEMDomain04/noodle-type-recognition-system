import React, { useRef } from 'react';
import { ChefHat, RefreshCw, Upload, Camera } from 'lucide-react';

export default function ImageActionState({ 
  imageSrc, 
  onClassify, 
  loading, 
  onSelectAnother, 
  onTakeAnother,
  hideActions
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSelectAnother(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-black/40 mb-6 shadow-xl border border-white/10 group">
        <img src={imageSrc} alt="Preview" className="w-full h-auto object-cover max-h-[60vh]" />
      </div>
      
      {!hideActions && (
        <div className="w-full max-w-md flex flex-col gap-4">
          <button 
            onClick={onClassify}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing Noodles...
              </>
            ) : (
              <>
                <ChefHat className="w-5 h-5" />
                Classify Image
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              Select Another
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <button 
              onClick={onTakeAnother}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Camera className="w-4 h-4" />
              Take Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
