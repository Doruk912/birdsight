import React from 'react';
import { ObservationDetailResponse, IdentificationResponse } from '@/app/types/explore';
import { Check, X, Info } from 'lucide-react';

interface DataQualityAssessmentProps {
  observation: ObservationDetailResponse;
  identifications: IdentificationResponse[];
}

export default function DataQualityAssessment({ observation, identifications }: DataQualityAssessmentProps) {
  const isResearchGrade = observation.qualityGrade === "RESEARCH_GRADE";
  const currentIdentifications = identifications.filter(i => i.current && !i.withdrawn);
  const uniqueUsers = new Set(currentIdentifications.map(i => i.userId));
  const hasMultipleIds = uniqueUsers.size >= 2;
  const hasSpeciesLevelId = observation.communityTaxon?.rank === "SPECIES";
  
  const checks = [
    { label: "Community ID at species level", criteria: hasSpeciesLevelId },
    { label: "ID supported by two or more", criteria: hasMultipleIds },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 animate-fade-in-up-delay-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-stone-800">Data Quality Assessment</h3>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
            isResearchGrade ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
          }`}
        >
          {isResearchGrade ? "Research Grade" : "Needs ID"}
        </span>
      </div>
      
      <div className="space-y-2">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            {check.criteria ? (
              <Check size={16} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
            ) : (
              <X size={16} className="text-stone-300 shrink-0" strokeWidth={2.5} />
            )}
            <span className={check.criteria ? "text-stone-700" : "text-stone-400"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
      
      {!isResearchGrade && (
        <div className="mt-4 pt-4 border-t border-stone-100 bg-amber-50 rounded-lg p-3 flex items-start gap-2">
          <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            This observation needs more identifications to reach <strong>Research Grade</strong>. Suggest an identification to help!
          </p>
        </div>
      )}
    </div>
  );
}
