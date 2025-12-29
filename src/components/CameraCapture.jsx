import React from "react";
import { Camera, RefreshCw, Check, X, FlipHorizontal } from "lucide-react";

export const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [stream, setStream] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [facingMode, setFacingMode] = React.useState("environment"); // Default to back camera as requested

  React.useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Separate effect for attaching stream to video element
  React.useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(console.error);
        setLoading(false);
      };
    }
  }, [stream]);

  const startCamera = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cleanup previous stream tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Primary camera error:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(fallbackStream);
      } catch (fallbackErr) {
        console.error("Final camera error:", fallbackErr);
        setError(
          "Camera access failed. Ensure permissions are granted and you are on a secure (HTTPS) site."
        );
        setLoading(false);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Handle mirroring in the capture
      if (facingMode === "user") {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }

      // Draw frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const imageData = canvas.toDataURL("image/jpeg", 0.8);

      // If front camera, we might want to manually flip the resulting image data
      // but usually the user wants the "stable" view they see.
      // If the user says "opposite direction", they mean the mirror effect.
      // We will handle the mirror effect via CSS on the video element.

      setPreview(imageData);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setPreview(null);
    startCamera();
  };

  const handleUsePhoto = () => {
    onCapture(preview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera size={20} />
            Capture Student Photo
          </h3>
          <div className="flex items-center gap-2">
            {!preview && !error && (
              <button
                onClick={() =>
                  setFacingMode((prev) =>
                    prev === "user" ? "environment" : "user"
                  )
                }
                className="p-2 text-slate-400 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
                title="Switch Camera"
              >
                <FlipHorizontal size={20} />
                <span className="hidden sm:inline">
                  {facingMode === "user" ? "Back" : "Front"}
                </span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Camera/Preview Area */}
        <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-white text-center p-6 bg-danger/20 rounded-xl m-4">
              <p>{error}</p>
            </div>
          ) : preview ? (
            <img
              src={preview}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <RefreshCw className="text-primary animate-spin" size={32} />
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => videoRef.current?.play()}
                className={clsx(
                  "w-full h-full object-cover",
                  facingMode === "user" && "scale-x-[-1]" // Only mirror front camera
                )}
              />
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Actions */}
        <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5">
          {preview ? (
            <div className="flex gap-4">
              <button
                onClick={handleRetake}
                className="flex-1 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/20 transition-all"
              >
                <RefreshCw size={18} />
                Retake
              </button>
              <button
                onClick={handleUsePhoto}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <Check size={18} />
                Use Photo
              </button>
            </div>
          ) : (
            <button
              onClick={capturePhoto}
              disabled={!!error}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
              Capture Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
