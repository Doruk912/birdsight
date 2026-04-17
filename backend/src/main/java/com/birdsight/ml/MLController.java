package com.birdsight.ml;

import com.birdsight.ml.dto.MLPredictionItem;
import com.birdsight.ml.dto.MLPredictionResponse;
import com.birdsight.taxonomy.Taxon;
import com.birdsight.taxonomy.TaxonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST controller that proxies image classification requests to the
 * ML service and enriches the predictions with taxon data from the database.
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/ml")
@RequiredArgsConstructor
public class MLController {

    private final MLServiceClient mlServiceClient;
    private final TaxonRepository taxonRepository;

    @PostMapping(value = "/predict", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MLPredictionResponse> predict(
            @RequestPart("file") MultipartFile file) {

        // 1. Forward image to the ML service
        List<MLPredictionItem> rawPredictions = mlServiceClient.predict(file);

        if (rawPredictions.isEmpty()) {
            return ResponseEntity.ok(MLPredictionResponse.builder()
                    .predictions(List.of())
                    .build());
        }

        // 2. Collect all predicted scientific names
        List<String> scientificNames = rawPredictions.stream()
                .map(MLPredictionItem::getSpecies)
                .toList();

        // 3. Batch-resolve taxon IDs from the database
        Map<String, Taxon> taxonMap = taxonRepository
                .findByScientificNameIn(scientificNames)
                .stream()
                .collect(Collectors.toMap(Taxon::getScientificName, t -> t));

        // 4. Enrich predictions with taxon data
        for (MLPredictionItem item : rawPredictions) {
            Taxon taxon = taxonMap.get(item.getSpecies());
            if (taxon != null) {
                item.setTaxonId(taxon.getId());
                item.setCommonName(taxon.getCommonName());
                item.setCoverImageUrl(taxon.getCoverImageUrl());
            }
        }

        return ResponseEntity.ok(MLPredictionResponse.builder()
                .predictions(rawPredictions)
                .build());
    }
}
