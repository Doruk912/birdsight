"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, ImagePlus, X, Sparkles } from "lucide-react";
import LocationPicker from "./LocationPicker";
import TaxonSearch from "./TaxonSearch";
import DateTimePicker from "./DateTimePicker";
import MLSuggestions from "./MLSuggestions";
import ImageCropperModal from "./ImageCropperModal";
import {
  createObservation,
  addIdentification,
} from "@/app/lib/observationService";

interface PendingImage {
  file: File;
  url: string;
}

export default function AddObservationForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [observedAtDate, setObservedAtDate] = useState<Date | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [description, setDescription] = useState("");
  const [taxonId, setTaxonId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cropping state flow
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  // ML suggestion state
  const [activeMlIndex, setActiveMlIndex] = useState<number>(0);
  const [taxonSearchKey, setTaxonSearchKey] = useState(0);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      pendingImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [previewUrls, pendingImages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      if (selected.length === 0) return;

      const newPending = selected.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setPendingImages((prev) => [...prev, ...newPending]);
    }
  };

  const removeImage = (index: number) => {
    const urlToRemove = previewUrls[index];
    if (urlToRemove) URL.revokeObjectURL(urlToRemove);

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);

    // Adjust activeMlIndex
    if (activeMlIndex === index) {
      setActiveMlIndex(0);
    } else if (activeMlIndex > index) {
      setActiveMlIndex(activeMlIndex - 1);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const currentPending = pendingImages[0];
    const croppedFile = new File([croppedBlob], currentPending.file.name, {
      type: "image/jpeg",
    });
    const newImageUrl = URL.createObjectURL(croppedBlob);

    if (images.length < 5) {
      setImages((prev) => [...prev, croppedFile]);
      setPreviewUrls((prev) => [...prev, newImageUrl]);
    } else {
      URL.revokeObjectURL(newImageUrl); // max 5
    }

    // Remove from pending
    URL.revokeObjectURL(currentPending.url);
    setPendingImages((prev) => prev.slice(1));
  };

  const handleCropCancel = () => {
    const currentPending = pendingImages[0];
    URL.revokeObjectURL(currentPending.url);
    setPendingImages((prev) => prev.slice(1));
  };

  const handleCropSkip = () => {
    const currentPending = pendingImages[0];
    if (images.length < 5) {
      setImages((prev) => [...prev, currentPending.file]);
      setPreviewUrls((prev) => [...prev, currentPending.url]);
    } else {
      URL.revokeObjectURL(currentPending.url);
    }
    setPendingImages((prev) => prev.slice(1));
  };

  const handleMLSelect = useCallback((selectedTaxonId: string) => {
    setTaxonId(selectedTaxonId);
    // Force TaxonSearch to re-render with the selected suggestion
    setTaxonSearchKey((k) => k + 1);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError("At least 1 photo is required.");
      return;
    }
    if (!taxonId) {
      setError(
        "Identification is required. Please select a species from the suggestions or search for one.",
      );
      return;
    }
    if (!observedAtDate) {
      setError("Observation date & time is required.");
      return;
    }
    if (!location) {
      setError(
        "Location is required. Please click on the map to set an exact location.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const reqObj = {
        description,
        observedAt: observedAtDate.toISOString(),
        latitude: location.lat,
        longitude: location.lng,
      };

      formData.append(
        "observation",
        new Blob([JSON.stringify(reqObj)], { type: "application/json" }),
      );
      images.forEach((file) => {
        formData.append("images", file);
      });

      const obsResponse = await createObservation(formData);

      // If a taxon was selected, we add the identification right after
      if (taxonId) {
        await addIdentification(obsResponse.id, taxonId);
      }

      router.push(`/observations/${obsResponse.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(
        message || "An error occurred while uploading. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] p-6 md:p-8 mb-16 max-w-4xl mx-auto overflow-hidden relative">
      {/* Cropper Modal triggers automatically if pendingImages has items and under max 5 boundary */}
      {pendingImages.length > 0 && images.length < 5 && (
        <ImageCropperModal
          imageUrl={pendingImages[0].url}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          onSkip={handleCropSkip}
          title={`Crop Photo (${images.length + 1} of 5)`}
        />
      )}

      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-400 to-emerald-600"></div>

      <div className="mb-8 mt-2">
        <h1 className="text-[2.2rem] leading-tight font-extrabold tracking-tight text-stone-800">
          Add Observation
        </h1>
        <p className="text-stone-500 mt-2 text-base font-medium">
          Contribute to the BirdSight community by sharing what you saw.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-10">
          {/* Photos Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-bold tracking-tight text-stone-800 flex items-center gap-2.5">
                <span className="flex items-center justify-center p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                  <Camera size={20} strokeWidth={2.5} />
                </span>
                Photos <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-1 rounded-md">
                {images.length} / 5
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {previewUrls.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setActiveMlIndex(i)}
                  className={`relative aspect-square rounded-2xl overflow-hidden shadow-sm group cursor-pointer transition-all duration-200 border-2 ${activeMlIndex === i ? "border-violet-500 ring-2 ring-violet-500/20" : "border-stone-200 hover:border-violet-300"}`}
                >
                  <img
                    src={url}
                    alt={`Preview ${i}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="absolute top-2 right-2 bg-stone-900/60 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 hover:border-emerald-400 hover:text-emerald-600 transition-all cursor-pointer text-stone-500 shadow-sm group">
                  <div className="p-3 bg-white rounded-full shadow-sm group-hover:bg-emerald-100 transition-colors">
                    <ImagePlus size={22} strokeWidth={2} />
                  </div>
                  <span className="text-[13px] font-semibold tracking-wide">
                    Add Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onClick={(e) => ((e.target as HTMLInputElement).value = "")}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Middle Section: AI Suggestions + Form Fields */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Left Column: AI Suggestions */}
            <div className="space-y-6">
              {images.length > 0 && images[activeMlIndex] ? (
                <MLSuggestions
                  imageFile={images[activeMlIndex]}
                  onSelect={handleMLSelect}
                />
              ) : (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50 p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Sparkles className="text-stone-300" size={24} />
                  </div>
                  <p className="text-sm font-semibold text-stone-500">
                    AI Suggestions
                  </p>
                  <p className="text-xs text-stone-400 mt-1 max-w-[200px]">
                    Add a photo to see automatic species identification
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-[15px] font-bold tracking-tight text-stone-800 mb-2">
                  Identification <span className="text-red-500">*</span>
                </label>
                <TaxonSearch
                  key={taxonSearchKey}
                  onSelect={setTaxonId}
                  initialTaxonId={taxonId}
                  label=""
                  required={true}
                />
              </div>

              <div>
                <label className="block text-[15px] font-bold tracking-tight text-stone-800 mb-2">
                  When did you see it? <span className="text-red-500">*</span>
                </label>
                <DateTimePicker
                  value={observedAtDate}
                  onChange={setObservedAtDate}
                  maxDate={new Date()}
                />
              </div>

              <div>
                <label className="block text-[15px] font-bold tracking-tight text-stone-800 mb-2">
                  Description{" "}
                  <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was it doing? How was the weather? etc."
                  rows={4}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none placeholder:text-stone-400 font-medium text-stone-900"
                />
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Bottom Section: Location */}
          <section>
            <LocationPicker
              onLocationChange={(lat, lng) => setLocation({ lat, lng })}
            />
          </section>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 font-semibold flex items-center">
            <div className="min-w-1 h-full min-h-6 bg-red-500 rounded-full mr-3"></div>
            {error}
          </div>
        )}

        <div className="flex justify-end pt-6 mt-2 border-t border-stone-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 px-8 rounded-full transition-all flex items-center justify-center min-w-55 shadow-[0_8px_16px_-6px_rgba(5,150,105,0.4)] hover:shadow-[0_12px_20px_-8px_rgba(5,150,105,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2
                  className="animate-spin text-emerald-100"
                  size={20}
                  strokeWidth={2.5}
                />
                Uploading...
              </span>
            ) : (
              "Post Observation"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
