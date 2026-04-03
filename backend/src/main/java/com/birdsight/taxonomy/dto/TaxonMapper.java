package com.birdsight.taxonomy.dto;

import com.birdsight.taxonomy.Taxon;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TaxonMapper {

    public TaxonResponse toResponse(Taxon taxon) {
        return TaxonResponse.builder()
                .id(taxon.getId())
                .rank(taxon.getRank())
                .scientificName(taxon.getScientificName())
                .commonName(taxon.getCommonName())
                .parentId(taxon.getParent() != null ? taxon.getParent().getId() : null)
                .build();
    }

    public TaxonDetailResponse toDetailResponse(Taxon taxon,
                                                  long observationCount,
                                                  List<TaxonResponse> ancestors,
                                                  List<TaxonResponse> children,
                                                  String coverImageUrl,
                                                  List<RecentObservationDto> recentObservations,
                                                  TopObserverDto topObserver,
                                                  TopIdentifierDto topIdentifier) {
        return TaxonDetailResponse.builder()
                .id(taxon.getId())
                .rank(taxon.getRank())
                .scientificName(taxon.getScientificName())
                .commonName(taxon.getCommonName())
                .parentId(taxon.getParent() != null ? taxon.getParent().getId() : null)
                .observationCount(observationCount)
                .ancestors(ancestors)
                .children(children)
                .coverImageUrl(coverImageUrl)
                .recentObservations(recentObservations)
                .topObserver(topObserver)
                .topIdentifier(topIdentifier)
                .build();
    }
}
