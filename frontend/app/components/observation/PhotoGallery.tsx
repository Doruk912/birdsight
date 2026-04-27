"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { ObservationImageResponse } from "@/app/types/explore";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23a8a29e'%3ENo image available%3C/text%3E%3C/svg%3E";

interface PhotoGalleryProps {
  images: ObservationImageResponse[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const goToLightbox = useCallback(
    (index: number) => {
      setLightboxIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToLightbox(lightboxIndex - 1);
      if (e.key === "ArrowRight") goToLightbox(lightboxIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, lightboxIndex, goToLightbox]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="w-full h-105 bg-stone-100 rounded-2xl flex items-center justify-center">
        <span className="text-stone-400 text-sm">No photos</span>
      </div>
    );
  }

  return (
    <>
      <div className="photo-gallery">
        {/* Main image — fixed height, contain (no crop) */}
        <div
          className="relative w-full h-105 bg-stone-100 rounded-2xl overflow-hidden group cursor-zoom-in"
          onClick={() => openLightbox(activeIndex)}
        >
          <img
            src={images[activeIndex].imageUrl}
            alt={`Observation photo ${activeIndex + 1}`}
            className="w-full h-full object-contain transition-opacity duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />

          {/* Zoom hint */}
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white/90 text-xs font-medium px-2.5 py-1.5 rounded-full">
              <ZoomIn size={12} strokeWidth={2.5} />
              Click to enlarge
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex - 1);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex + 1);
                }}
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
                  w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].imageUrl}
              alt={`Observation photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>

          {/* Lightbox navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToLightbox(lightboxIndex - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToLightbox(lightboxIndex + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Lightbox thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToLightbox(i);
                  }}
                  className={`w-12 h-9 rounded-md overflow-hidden border-2 transition-all ${
                    i === lightboxIndex
                      ? "border-white scale-110"
                      : "border-white/20 opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
