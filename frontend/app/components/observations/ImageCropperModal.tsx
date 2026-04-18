"use client";

import { useState, useCallback, useEffect, useRef, type SyntheticEvent } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Check } from "lucide-react";

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropperModalProps {
  imageUrl: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  onSkip?: () => void;
  title?: string;
}

export async function getCroppedImg(
  image: HTMLImageElement,
  pixelCrop: Area
): Promise<Blob | null> {
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Set the size of the cropped canvas
  croppedCanvas.width = Math.max(1, Math.floor(pixelCrop.width * scaleX));
  croppedCanvas.height = Math.max(1, Math.floor(pixelCrop.height * scaleY));

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((file) => {
      resolve(file);
    }, "image/jpeg", 0.95);
  });
}

export default function ImageCropperModal({
  imageUrl,
  onCropComplete,
  onCancel,
  onSkip,
  title = "Crop Image",
}: ImageCropperModalProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createInitialCrop = useCallback((): Crop => {
    return {
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
  }, []);

  const handleImageLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      imageRef.current = image;
      setCrop(createInitialCrop());
      setCompletedCrop({ x: 0, y: 0, width: image.width, height: image.height, unit: "px" });
    },
    [createInitialCrop]
  );

  useEffect(() => {
    const image = imageRef.current;
    if (!image) {
      return;
    }

    setCrop(createInitialCrop());
    setCompletedCrop({ x: 0, y: 0, width: image.width, height: image.height, unit: "px" });
  }, [createInitialCrop, imageUrl]);

  const handleSave = async () => {
    if (!completedCrop || !imageRef.current) return;
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageRef.current, completedCrop);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 animate-fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-full max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-white z-10 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-stone-900">{title}</h3>
            <p className="text-xs text-stone-500 font-medium">Center the bird to help others and the AI identify it.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-stone-900 min-h-75 p-4 flex items-center justify-center overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
            minWidth={64}
            minHeight={64}
            keepSelection
          >
            <img
              src={imageUrl}
              alt="Image to crop"
              onLoad={handleImageLoad}
              className="max-h-[60vh] w-auto object-contain"
            />
          </ReactCrop>
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col gap-4 px-6 py-5 bg-white border-t border-stone-100 z-10 shrink-0">

          <p className="text-xs text-stone-500">
            Drag the selection and resize from edges/corners to crop width and height independently.
          </p>

          <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Skip Cropping
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing}
              className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {isProcessing ? "Processing..." : <><Check size={18} strokeWidth={2.5} /> Crop & Save</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
