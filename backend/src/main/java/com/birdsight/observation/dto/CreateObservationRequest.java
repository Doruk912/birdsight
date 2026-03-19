package com.birdsight.observation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateObservationRequest {

    private String description;

    @NotBlank(message = "Observation date is required")
    private String observedAt;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String locationName;

    /** Optional initial identification taxon */
    private UUID taxonId;

}
