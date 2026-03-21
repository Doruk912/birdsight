"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, ImagePlus, X } from "lucide-react";
import LocationPicker from "./LocationPicker";
import TaxonSearch from "./TaxonSearch";
import { createObservation, addIdentification } from "@/app/lib/observationService";

export default function AddObservationForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [observedAt, setObservedAt] = useState<string>("");
  const [location, setLocation] = useState<{lat: number; lng: number; name: string} | null>(null);
  const [description, setDescription] = useState("");
  const [taxonId, setTaxonId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const newImages = [...images, ...selected].slice(0, 5); // Max 5
      setImages(newImages);
      
      const urls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError("At least 1 photo is required.");
      return;
    }
    if (!observedAt) {
      setError("Observation date & time is required.");
      return;
    }
    if (!location) {
      setError("Location is required. Please click on the map to set an exact location.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      const reqObj = {
        description,
        observedAt: new Date(observedAt).toISOString(),
        latitude: location.lat,
        longitude: location.lng,
        locationName: location.name
      };
      
      formData.append("observation", new Blob([JSON.stringify(reqObj)], { type: "application/json" }));
      images.forEach(file => {
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
      setError(message || "An error occurred while uploading. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05),0_10px_20px_-2px_rgba(0,0,0,0.02)] p-6 md:p-10 mb-20 max-w-4xl mx-auto overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
      
      <div className="mb-10 mt-2">
        <h1 className="text-[2.2rem] leading-tight font-extrabold tracking-tight text-stone-800">Add Observation</h1>
        <p className="text-stone-500 mt-2 text-base font-medium">Contribute to the BirdSight community by sharing what you saw.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 font-semibold flex items-center">
          <div className="w-1.5 h-full min-h-[1.5rem] bg-red-500 rounded-full mr-3"></div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Images section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <label className="text-lg font-bold tracking-tight text-stone-800 flex items-center gap-2.5">
              <span className="flex items-center justify-center p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                <Camera size={20} strokeWidth={2.5} />
              </span>
              Photos <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-1 rounded-md">{images.length} / 5</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-stone-200 shadow-sm group">
                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-stone-900/60 backdrop-blur-sm text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="aspect-square flex flex-col items-center justify-center gap-2.5 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 hover:border-emerald-400 hover:text-emerald-600 transition-all cursor-pointer text-stone-500 shadow-sm group">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:bg-emerald-100 transition-colors">
                  <ImagePlus size={22} strokeWidth={2} />
                </div>
                <span className="text-[13px] font-semibold tracking-wide">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </section>

        <hr className="border-stone-100" />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <section className="space-y-8">
            <div>
              <label className="block text-[15px] font-bold tracking-tight text-stone-800 mb-2.5">When did you see it? <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={observedAt}
                onChange={(e) => setObservedAt(e.target.value)}
                max={new Date().toISOString().slice(0, 16)}
                required
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-stone-800 font-medium"
              />
            </div>
            
            <div>
              <label className="block text-[15px] font-bold tracking-tight text-stone-800 mb-2.5">Description <span className="text-stone-400 font-normal">(Optional)</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was it doing? How was the weather? etc."
                rows={4}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none placeholder:text-stone-400 font-medium"
              />
            </div>

            <div className="pt-2">
              <TaxonSearch onSelect={setTaxonId} />
            </div>
          </section>

          <section>
            <LocationPicker onLocationChange={(lat, lng, name) => setLocation({lat, lng, name})} />
          </section>
        </div>

        <div className="flex justify-end pt-8 mt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 px-8 rounded-full transition-all flex items-center justify-center min-w-[220px] shadow-[0_8px_16px_-6px_rgba(5,150,105,0.4)] hover:shadow-[0_12px_20px_-8px_rgba(5,150,105,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin text-emerald-100" size={20} strokeWidth={2.5} />
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
