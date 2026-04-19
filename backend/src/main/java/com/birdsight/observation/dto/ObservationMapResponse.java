package com.birdsight.observation.dto;

import com.birdsight.observation.QualityGrade;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Lightweight response for map markers — only essential fields.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObservationMapResponse {

    private UUID id;
    private Double latitude;
    private Double longitude;
    private String speciesCommonName;
    private String speciesScientificName;
    private QualityGrade qualityGrade;
    private String thumbnailUrl;
    private Instant observedAt;
    private int identificationCount;
    private String username;
    private String locationName;
}
