package com.birdsight.observation.dto;

import com.birdsight.observation.QualityGrade;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObservationFilterRequest {

    private String search;
    private QualityGrade grade;
    private UUID taxonId;
    private UUID userId;
    private Instant dateFrom;
    private Instant dateTo;

    // Geographic bounding box (PostGIS coordinates)
    private Double swLat;
    private Double swLng;
    private Double neLat;
    private Double neLng;

    public boolean hasBoundingBox() {
        return swLat != null && swLng != null && neLat != null && neLng != null;
    }

    public boolean hasAnyFilter() {
        return (search != null && !search.isBlank())
                || grade != null
                || taxonId != null
                || userId != null
                || dateFrom != null
                || dateTo != null
                || hasBoundingBox();
    }
}
