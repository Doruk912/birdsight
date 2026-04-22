"use client";

import { useEffect, useState } from "react";
import { Camera, Loader2, ImagePlus, X, MoveLeft, MoveRight } from "lucide-react";
import LocationPicker from "./LocationPicker";
import DateTimePicker from "./DateTimePicker";
import ImageCropperModal from "./ImageCropperModal";
import { updateObservation } from "@/app/lib/observationService";
import { ObservationDetailResponse } from "@/app/types/explore";

interface PendingImage {
  file: File;
  url: string;
}

export interface ImageItem {
  id: string; // Unique string for React key
  type: 'existing' | 'new';
  url: string;
  file?: File;
}

interface EditObservationModalProps {
  observation: ObservationDetailResponse;
  onClose: () => void;
  onSuccess: (updated: ObservationDetailResponse) => void;
}

export default function EditObservationModal({ observation, onClose, onSuccess }: EditObservationModalProps) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [observedAtDate, setObservedAtDate] = useState<Date | null>(new Date(observation.observedAt));
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>({
    lat: observation.latitude,
    lng: observation.longitude,
  });
  const [description, setDescription] = useState(observation.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cropping state flow
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  useEffect(() => {
    const initialItems: ImageItem[] = observation.images.map((img) => ({
      id: img.id,
      type: 'existing',
      url: img.imageUrl,
    }));
    setItems(initialItems);
  }, [observation]);

  useEffect(() => {
    return () => {
      // Clean up object URLs for new images
      items.forEach((item) => {
        if (item.type === 'new') {
          URL.revokeObjectURL(item.url);
        }
      });
      pendingImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [items, pendingImages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (selected.length === 0) return;

      const newPending = selected.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      
      setPendingImages(prev => [...prev, ...newPending]);
    }
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    const removed = newItems.splice(index, 1)[0];
    if (removed.type === 'new') {
      URL.revokeObjectURL(removed.url);
    }
    setItems(newItems);
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const moveRight = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const currentPending = pendingImages[0];
    const croppedFile = new File([croppedBlob], currentPending.file.name, { type: "image/jpeg" });
    const newImageUrl = URL.createObjectURL(croppedBlob);
    
    if (items.length < 5) {
      setItems(prev => [...prev, { id: `new_${Date.now()}_${Math.random()}`, type: 'new', url: newImageUrl, file: croppedFile }]);
    } else {
      URL.revokeObjectURL(newImageUrl);
    }
    
    URL.revokeObjectURL(currentPending.url);
    setPendingImages(prev => prev.slice(1));
  };

  const handleCropCancel = () => {
    const currentPending = pendingImages[0];
    URL.revokeObjectURL(currentPending.url);
    setPendingImages(prev => prev.slice(1));
  };

  const handleCropSkip = () => {
    const currentPending = pendingImages[0];
    if (items.length < 5) {
      setItems(prev => [...prev, { id: `new_${Date.now()}_${Math.random()}`, type: 'new', url: currentPending.url, file: currentPending.file }]);
    } else {
      URL.revokeObjectURL(currentPending.url);
    }
    setPendingImages(prev => prev.slice(1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("At least 1 photo is required.");
      return;
    }
    if (!observedAtDate) {
      setError("Observation date & time is required.");
      return;
    }
    if (!location) {
      setError("Location is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      const imageOrder: string[] = [];
      const filesToUpload: File[] = [];

      items.forEach((item) => {
        if (item.type === 'existing') {
          imageOrder.push(item.url);
        } else if (item.type === 'new' && item.file) {
          imageOrder.push(`new_${filesToUpload.length}`);
          filesToUpload.push(item.file);
        }
      });
      
      const reqObj = {
        description,
        observedAt: observedAtDate.toISOString(),
        latitude: location.lat,
        longitude: location.lng,
        imageOrder,
      };
      
      formData.append("observation", new Blob([JSON.stringify(reqObj)], { type: "application/json" }));
      filesToUpload.forEach(file => {
        formData.append("newImages", file);
      });

      const updated = await updateObservation(observation.id, formData);
      onSuccess(updated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "An error occurred while updating. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
        {pendingImages.length > 0 && items.length < 5 && (
          <ImageCropperModal
            imageUrl={pendingImages[0].url}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            onSkip={handleCropSkip}
            title={`Crop Photo (${items.length + 1} of 5)`}
          />
        )}

        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="text-2xl font-bold text-stone-800">Edit Observation</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-lg font-bold tracking-tight text-stone-800 flex items-center gap-2.5">
                <span className="flex items-center justify-center p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                  <Camera size={20} strokeWidth={2.5} />
                </span>
                Photos <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-1 rounded-md">{items.length} / 5</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {items.map((item, i) => (
                <div 
                  key={item.id} 
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group border-2 border-stone-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={`Preview ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-stone-900/60 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => moveLeft(i)} disabled={i === 0} className="text-white p-1 hover:bg-white/20 rounded-full disabled:opacity-30">
                      <MoveLeft size={14} />
                    </button>
                    <button type="button" onClick={() => moveRight(i)} disabled={i === items.length - 1} className="text-white p-1 hover:bg-white/20 rounded-full disabled:opacity-30">
                      <MoveRight size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="absolute top-2 right-2 bg-stone-900/60 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
              
              {items.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 hover:border-emerald-400 hover:text-emerald-600 transition-all cursor-pointer text-stone-500 shadow-sm group">
                  <div className="p-3 bg-white rounded-full shadow-sm group-hover:bg-emerald-100 transition-colors">
                    <ImagePlus size={22} strokeWidth={2} />
                  </div>
                  <span className="text-[13px] font-semibold tracking-wide">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onClick={(e) => (e.target as HTMLInputElement).value = ''}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <hr className="border-stone-100" />

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            <section className="space-y-6">
              <div>
                <label className="block text-[15px] font-bold tracking-tight text-stone-800 mb-2">When did you see it? <span className="text-red-500">*</span></label>
                <DateTimePicker
                  value={observedAtDate}
                  onChange={setObservedAtDate}
                  maxDate={new Date()}
                />
              </div>
              
              <div>
                <label className="block text-[15px] font-bold tracking-tight text-stone-800 mb-2">Description <span className="text-stone-400 font-normal">(Optional)</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was it doing? How was the weather? etc."
                  rows={4}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none placeholder:text-stone-400 font-medium text-stone-900"
                />
              </div>
            </section>

            <section>
              <LocationPicker 
                onLocationChange={(lat, lng) => setLocation({lat, lng})} 
                initialLocation={location ? { lat: location.lat, lng: location.lng, name: observation.locationName || "" } : undefined} 
              />
            </section>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 font-semibold flex items-center">
              <div className="min-w-1 h-full min-h-6 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-stone-100 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-6 rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 px-8 rounded-full transition-all flex items-center justify-center min-w-[140px] shadow-[0_8px_16px_-6px_rgba(5,150,105,0.4)]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin text-emerald-100" size={20} strokeWidth={2.5} />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
