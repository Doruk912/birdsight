package com.birdsight.taxonomy.dto;

import com.birdsight.taxonomy.TaxonRank;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxonResponse {

    private UUID id;
    private TaxonRank rank;
    private String scientificName;
    private String commonName;
    private UUID parentId;
}
