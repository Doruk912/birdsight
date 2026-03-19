package com.birdsight.taxonomy.dto;

import com.birdsight.taxonomy.Taxon;
import org.springframework.stereotype.Component;

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
}
