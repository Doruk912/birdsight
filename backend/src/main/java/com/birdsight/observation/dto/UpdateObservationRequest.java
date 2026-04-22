package com.birdsight.observation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateObservationRequest {

    private String description;

    @NotBlank(message = "Observation date is required")
    private String observedAt;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotEmpty(message = "At least 1 image is required")
    private List<String> imageOrder;

}
