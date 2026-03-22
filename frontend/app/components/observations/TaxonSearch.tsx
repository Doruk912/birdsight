"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { searchTaxa } from "@/app/lib/observationService";
import { TaxonResponse } from "@/app/types/explore";

interface TaxonSearchProps {
  onSelect: (taxonId: string | undefined) => void;
}

export default function TaxonSearch({ onSelect }: TaxonSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TaxonResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<TaxonResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selected]);

  const handleSelect = (taxon: TaxonResponse) => {
    setSelected(taxon);
    setQuery(taxon.commonName || taxon.scientificName);
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
      <label className="block text-sm font-medium text-stone-700 mb-2">Identification <span className="text-stone-400 font-normal">(Optional)</span></label>
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-stone-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selected) clearSelection();
          }}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Search for a species (e.g. Mallard) ..."
          className="w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-stone-400 text-stone-900"
        />
        {loading && <Loader2 className="absolute right-4 text-stone-400 animate-spin" size={18} />}
      </div>
      
      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {results.map((taxon) => (
            <li
              key={taxon.id}
              onClick={() => handleSelect(taxon)}
              className="px-5 py-3.5 cursor-pointer hover:bg-stone-50 flex flex-col border-b border-stone-100 last:border-0 transition-colors"
            >
              <span className="font-medium text-stone-800 tracking-tight">{taxon.commonName}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[13px] text-stone-500 italic">{taxon.scientificName}</span>
                <span className="text-[11px] font-semibold text-stone-400 tracking-wider uppercase bg-stone-100 px-1.5 py-0.5 rounded-md">
                  {taxon.rank.toLowerCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="mt-3 inline-flex items-center gap-3 px-4 py-2 bg-emerald-50/80 text-emerald-800 rounded-xl text-sm border border-emerald-100 shadow-sm">
          <span className="font-medium tracking-tight">{selected.commonName}</span>
          <button type="button" onClick={clearSelection} className="hover:text-emerald-600 border-l border-emerald-200/60 pl-3 transition-colors text-emerald-600/70 font-medium">
            Change
          </button>
        </div>
      )}
    </div>
  );
}
