"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ObservationImageResponse } from "@/app/types/explore";

interface PhotoGalleryProps {
  images: ObservationImageResponse[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length]
  );

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-stone-100 rounded-2xl flex items-center justify-center">
        <span className="text-stone-400 text-sm">No photos</span>
      </div>
    );
  }

  return (
    <div className="photo-gallery">
      {/* Main image */}
      <div className="relative w-full aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden group">
        <img
          src={images[activeIndex].imageUrl}
          alt={`Observation photo ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                w-10 h-10 rounded-full
                bg-black/40 backdrop-blur-sm
                text-white/90 hover:text-white hover:bg-black/60
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition-all duration-200 cursor-pointer
              "
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-10 h-10 rounded-full
                bg-black/40 backdrop-blur-sm
                text-white/90 hover:text-white hover:bg-black/60
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition-all duration-200 cursor-pointer
              "
              aria-label="Next photo"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </>
        )}

        {/* Photo counter badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 justify-center">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => goTo(i)}
              className={`
                w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer
                transition-all duration-200
                ${
                  i === activeIndex
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100 hover:border-stone-300"
                }
              `}
            >
              <img
                src={img.imageUrl}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
