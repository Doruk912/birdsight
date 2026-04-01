package com.birdsight.ml.dto;

import lombok.*;

import java.util.List;

/**
 * Response DTO wrapping the list of ML species predictions.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MLPredictionResponse {

    private List<MLPredictionItem> predictions;
}
