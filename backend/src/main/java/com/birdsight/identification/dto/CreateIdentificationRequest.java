package com.birdsight.identification.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateIdentificationRequest {

    @NotNull(message = "Taxon ID is required")
    private UUID taxonId;

    private String comment;
}
