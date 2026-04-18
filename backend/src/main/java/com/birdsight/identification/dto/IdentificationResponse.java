package com.birdsight.identification.dto;

import com.birdsight.taxonomy.TaxonRank;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdentificationResponse {

    private UUID id;
    private UUID observationId;
    private UUID userId;
    private String username;
    private String userAvatarUrl;
    private UUID taxonId;
    private String taxonScientificName;
    private String taxonCommonName;
    private TaxonRank taxonRank;
    private String taxonCoverImageUrl;
    private String comment;
    private boolean current;
    private boolean withdrawn;
    private boolean disagreeing;
    private Instant createdAt;
}
