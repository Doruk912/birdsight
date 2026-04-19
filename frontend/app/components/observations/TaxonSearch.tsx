"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Loader2, Leaf, X, ExternalLink } from "lucide-react";
import { searchTaxa } from "@/app/lib/observationService";
import { TaxonResponse } from "@/app/types/explore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface TaxonSearchProps {
  onSelect: (taxonId: string | undefined) => void;
  /** Optional initial taxon ID to pre-populate (e.g. from ML suggestion). */
  initialTaxonId?: string;
  label?: string;
  hideOptional?: boolean;
}

export default function TaxonSearch({ onSelect, initialTaxonId, label = "Identification", hideOptional = false }: TaxonSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TaxonResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<TaxonResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const formatTaxonRank = (rank: string) => Math.max(0, rank.length) > 0 ? rank.charAt(0) + rank.slice(1).toLowerCase() : "";

  // Load initial taxon from ID (e.g. ML suggestion pre-fill)
  useEffect(() => {
    if (!initialTaxonId || selected) return;

    let cancelled = false;
    setInitialLoading(true);

    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/taxa/${initialTaxonId}`, {
          cache: "no-store",
        });
        if (response.ok && !cancelled) {
          const taxon: TaxonResponse = await response.json();
          setSelected(taxon);
          setQuery("");
          onSelect(taxon.id);
        }
      } catch (err) {
        console.error("Failed to load initial taxon:", err);
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTaxonId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() && !selected) {
        setLoading(true);
        searchTaxa(query).then(res => {
          setResults(res);
          setLoading(false);
          setIsOpen(true);
        });
      } else {
        setResults([]);
        setIsOpen(false);
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selected]);

  const handleSelect = (taxon: TaxonResponse) => {
    setSelected(taxon);
    setQuery("");
    setIsOpen(false);
    onSelect(taxon.id);
  };

  const clearSelection = () => {
    setSelected(null);
    setQuery("");
    onSelect(undefined);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {label} {!hideOptional && <span className="text-stone-400 font-normal">(Optional)</span>}
        </label>
      )}
      
      {selected ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Taxon thumbnail */}
            {selected.coverImageUrl ? (
              <img
                src={selected.coverImageUrl}
                alt={selected.commonName || selected.scientificName}
                className="w-10 h-10 rounded-lg object-cover border border-emerald-200 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Leaf size={16} className="text-emerald-600" />
              </div>
            )}
            <div>
              {selected.commonName && (
                <p className="text-sm font-semibold text-emerald-900">
                  {selected.commonName}
                </p>
              )}
              <p className={`text-xs text-emerald-700 ${selected.scientificName ? "italic" : ""}`}>
                {selected.rank && selected.rank !== "SPECIES" && (
                  <span className="not-italic mr-1">
                    {formatTaxonRank(selected.rank)}
                  </span>
                )}
                {selected.scientificName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/taxonomy/${selected.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
              title="View taxon page"
            >
              <ExternalLink size={14} />
            </Link>
            <button
              type="button"
              onClick={clearSelection}
              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            placeholder="Search for a species (e.g. Mallard) ..."
            className="w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-stone-400 text-stone-900"
            disabled={initialLoading}
          />
          {(loading || initialLoading) && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 animate-spin" size={18} />}
          
          {isOpen && results.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto custom-scrollbar overflow-x-hidden">
              {results.map((taxon) => (
                <li
                  key={taxon.id}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0"
                >
                  {/* Taxon image */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(taxon);
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    {taxon.coverImageUrl ? (
                      <img
                        src={taxon.coverImageUrl}
                        alt={taxon.commonName || taxon.scientificName}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                        <Leaf size={14} className="text-stone-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      {taxon.commonName && (
                        <p className="text-sm font-medium text-stone-800 truncate hover:text-emerald-700">
                          {taxon.commonName}
                        </p>
                      )}
                      <p className="text-xs text-stone-500 italic truncate">
                        {taxon.rank !== "SPECIES" 
                          ? `${formatTaxonRank(taxon.rank)} ${taxon.scientificName}`
                          : taxon.scientificName}
                      </p>
                    </div>
                  </button>

                  {/* View taxon page */}
                  <Link
                    href={`/taxonomy/${taxon.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-emerald-600 border border-stone-200 hover:border-emerald-300 rounded-lg px-2 py-1 transition-colors"
                    title="View species page"
                  >
                    <ExternalLink size={10} />
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.length >= 2 && results.length === 0 && !loading && !initialLoading && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-stone-200 rounded-xl shadow-lg p-4 text-center text-sm text-stone-500">
              No species found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
