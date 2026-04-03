package com.birdsight.taxonomy.dto;

import com.birdsight.taxonomy.TaxonRank;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxonDetailResponse {

    private UUID id;
    private TaxonRank rank;
    private String scientificName;
    private String commonName;
    private UUID parentId;

    private long observationCount;
    private List<TaxonResponse> ancestors;
    private List<TaxonResponse> children;

    private String coverImageUrl;
    private List<RecentObservationDto> recentObservations;
    private TopObserverDto topObserver;
    private TopIdentifierDto topIdentifier;
}
