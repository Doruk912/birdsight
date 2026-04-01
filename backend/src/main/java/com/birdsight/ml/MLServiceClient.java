package com.birdsight.ml;

import com.birdsight.ml.config.MLServiceProperties;
import com.birdsight.ml.dto.MLPredictionItem;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

/**
 * HTTP client that forwards image data to the FastAPI ML service
 * and parses the prediction response.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MLServiceClient {

    private final MLServiceProperties properties;
    private final ObjectMapper objectMapper;

    /**
     * Send an image to the ML service and return raw predictions
     * (species name + confidence — no taxon resolution yet).
     */
    public List<MLPredictionItem> predict(MultipartFile file) {
        String boundary = UUID.randomUUID().toString();

        try {
            byte[] body = buildMultipartBody(boundary, file);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(properties.getUrl() + "/predict"))
                    .timeout(Duration.ofMillis(properties.getTimeout()))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofMillis(properties.getTimeout()))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("ML service returned status {}: {}", response.statusCode(), response.body());
                return Collections.emptyList();
            }

            MLServiceResponse parsed = objectMapper.readValue(response.body(), MLServiceResponse.class);
            if (parsed.predictions == null) return Collections.emptyList();

            List<MLPredictionItem> items = new ArrayList<>();
            for (RawPrediction p : parsed.predictions) {
                items.add(MLPredictionItem.builder()
                        .species(p.species)
                        .confidence(p.confidence)
                        .build());
            }
            return items;

        } catch (IOException | InterruptedException ex) {
            log.error("Failed to call ML service: {}", ex.getMessage(), ex);
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return Collections.emptyList();
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Multipart body builder (manual — avoids pulling in extra libs)
    // ──────────────────────────────────────────────────────────────

    private byte[] buildMultipartBody(String boundary, MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        StringBuilder sb = new StringBuilder();
        sb.append("--").append(boundary).append("\r\n");
        sb.append("Content-Disposition: form-data; name=\"file\"; filename=\"").append(fileName).append("\"\r\n");
        sb.append("Content-Type: ").append(contentType).append("\r\n");
        sb.append("\r\n");

        byte[] header = sb.toString().getBytes();
        byte[] fileBytes = file.getBytes();
        byte[] footer = ("\r\n--" + boundary + "--\r\n").getBytes();

        byte[] body = new byte[header.length + fileBytes.length + footer.length];
        System.arraycopy(header, 0, body, 0, header.length);
        System.arraycopy(fileBytes, 0, body, header.length, fileBytes.length);
        System.arraycopy(footer, 0, body, header.length + fileBytes.length, footer.length);

        return body;
    }

    // ──────────────────────────────────────────────────────────────
    // Internal DTOs for parsing the ML service JSON response
    // ──────────────────────────────────────────────────────────────

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class MLServiceResponse {
        private List<RawPrediction> predictions;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class RawPrediction {
        private String species;
        private double confidence;
    }
}
