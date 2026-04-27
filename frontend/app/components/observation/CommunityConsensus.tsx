import React from "react";
import {
  ObservationDetailResponse,
  IdentificationResponse,
} from "@/app/types/explore";

interface CommunityConsensusProps {
  observation: ObservationDetailResponse;
  identifications: IdentificationResponse[];
}

export default function CommunityConsensus({
  identifications,
}: CommunityConsensusProps) {
  const activeIdentifications = identifications.filter(
    (i) => i.current && !i.withdrawn,
  );
  const totalVotes = activeIdentifications.length;

  if (totalVotes === 0) {
    return null;
  }

  const formatScientificName = (
    rank: IdentificationResponse["taxonRank"],
    scientificName: string,
  ) => {
    const rankPrefix =
      rank !== "SPECIES"
        ? `${rank.charAt(0).toUpperCase()}${rank.slice(1).toLowerCase()} `
        : "";

    return `${rankPrefix}${scientificName}`;
  };

  // Group by Taxon
  const taxonGroups = activeIdentifications.reduce(
    (acc, curr) => {
      if (!acc[curr.taxonId]) {
        acc[curr.taxonId] = {
          taxonId: curr.taxonId,
          taxonScientificName: curr.taxonScientificName,
          taxonCommonName: curr.taxonCommonName,
          taxonRank: curr.taxonRank,
          count: 0,
        };
      }
      acc[curr.taxonId].count += 1;
      return acc;
    },
    {} as Record<
      string,
      {
        taxonId: string;
        taxonScientificName: string;
        taxonCommonName: string | null;
        taxonRank: IdentificationResponse["taxonRank"];
        count: number;
      }
    >,
  );

  // Sort descending by count
  const sortedTaxa = Object.values(taxonGroups).sort(
    (a, b) => b.count - a.count,
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 animate-fade-in-up-delay-3">
      <h3 className="text-sm font-semibold text-stone-800 mb-4">
        Community Taxon
      </h3>

      <div className="space-y-4">
        {sortedTaxa.map((taxon) => {
          const percentage = Math.round((taxon.count / totalVotes) * 100);
          const formattedScientificName = formatScientificName(
            taxon.taxonRank,
            taxon.taxonScientificName,
          );

          return (
            <div key={taxon.taxonId} className="space-y-1">
              <div className="flex items-start justify-between text-sm">
                <div>
                  <div className="font-semibold text-stone-800">
                    {taxon.taxonCommonName || formattedScientificName}
                  </div>
                  {taxon.taxonCommonName && (
                    <div className="text-xs italic text-stone-400">
                      {formattedScientificName}
                    </div>
                  )}
                </div>
                <div className="text-stone-500 font-medium">{taxon.count}</div>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span>Total Identifications</span>
        <span className="font-semibold text-stone-700">{totalVotes}</span>
      </div>
    </div>
  );
}
