package com.birdsight.observation.dto;

import com.birdsight.observation.QualityGrade;
import com.birdsight.taxonomy.dto.TaxonResponse;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObservationResponse {

    private UUID id;
    private UUID userId;
    private String username;
    private String userAvatarUrl;
    private String description;
    private Instant observedAt;
    private Double latitude;
    private Double longitude;
    private String locationName;
    private TaxonResponse communityTaxon;
    private QualityGrade qualityGrade;
    private List<ObservationImageResponse> images;
    private int identificationCount;
    private int commentCount;
    private Instant createdAt;
    private Instant updatedAt;
}
