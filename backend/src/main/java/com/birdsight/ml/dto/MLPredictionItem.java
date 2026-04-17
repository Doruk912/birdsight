package com.birdsight.ml.dto;

import lombok.*;

import java.util.UUID;

/**
 * A single species prediction returned to the frontend.
 * Includes the resolved taxon ID from the database (if found).
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MLPredictionItem {

    /** Scientific name of the predicted species. */
    private String species;

    /** Common name of the predicted species (from the taxa table). */
    private String commonName;

    /** Confidence score (0 – 1). */
    private double confidence;

    /** Taxon UUID resolved from the database. Null if not found. */
    private UUID taxonId;
    /** Cover image URL resolved from the database. Null if not found. */
    private String coverImageUrl;
}
