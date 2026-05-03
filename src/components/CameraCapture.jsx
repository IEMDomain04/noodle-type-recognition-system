import React, { useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel, onError }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let activeStream = null;
    
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
          if (onError) onError("Failed to access camera. Please ensure permissions are granted.");
          onCancel();
        });
    }
    
    return () => {
      // Cleanup camera stream
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      } else if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [onCancel, onError]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Check if video is ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(file, dataUrl);
      }, 'image/jpeg');
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
      <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-6 shadow-xl border border-white/10">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-colors"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <button 
        onClick={handleCapture}
        className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
      >
        <Camera className="w-5 h-5" />
        Capture Photo
      </button>
    </div>
  );
}
