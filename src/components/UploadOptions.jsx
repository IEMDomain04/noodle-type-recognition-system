import React, { useRef } from 'react';
import { Upload, Camera } from 'lucide-react';

export default function UploadOptions({ onFileUpload, onCameraSelect }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset the input value so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full grid sm:grid-cols-2 gap-6 max-w-2xl">
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-4 p-8 h-48 border-2 border-dashed border-muted hover:border-primary/50 rounded-3xl bg-black/20 hover:bg-black/40 transition-all group"
      >
        <div className="p-4 bg-muted/50 group-hover:bg-primary/20 rounded-full transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="text-center">
          <p className="font-semibold">Upload Image</p>
          <p className="text-sm text-muted-foreground mt-1">Browse your files</p>
        </div>
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <button 
        onClick={onCameraSelect}
        className="flex flex-col items-center justify-center gap-4 p-8 h-48 border-2 border-transparent bg-secondary/50 hover:bg-secondary border-muted/20 hover:border-muted/50 rounded-3xl transition-all group shadow-lg hover:shadow-xl"
      >
        <div className="p-4 bg-background/50 group-hover:bg-background rounded-full transition-colors">
          <Camera className="w-8 h-8 text-secondary-foreground" />
        </div>
        <div className="text-center">
          <p className="font-semibold">Take Photo</p>
          <p className="text-sm text-muted-foreground mt-1">Use your camera</p>
        </div>
      </button>
    </div>
  );
}
