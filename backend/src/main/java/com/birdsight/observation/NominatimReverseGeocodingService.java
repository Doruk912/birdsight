package com.birdsight.observation;

import com.birdsight.config.NominatimProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NominatimReverseGeocodingService implements ReverseGeocodingService {

    private final NominatimProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Override
    public Optional<String> reverseGeocode(double latitude, double longitude) {
        if (!properties.isEnabled()) {
            return Optional.empty();
        }

        try {
            URI uri = URI.create(buildReverseUrl(latitude, longitude));
            HttpRequest request = HttpRequest.newBuilder(uri)
                    .timeout(Duration.ofMillis(properties.getTimeoutMillis()))
                    .header("User-Agent", properties.getUserAgent())
                    .header("Accept", "application/json")
                    .header("Accept-Language", properties.getLanguage())
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.debug("Nominatim reverse geocoding failed with status {}", response.statusCode());
                return Optional.empty();
            }

            return extractLocationName(response.body());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return Optional.empty();
        } catch (Exception e) {
            log.debug("Nominatim reverse geocoding failed", e);
            return Optional.empty();
        }
    }

    private String buildReverseUrl(double latitude, double longitude) {
        String baseUrl = trimTrailingSlash(properties.getBaseUrl());
        String language = URLEncoder.encode(properties.getLanguage(), StandardCharsets.UTF_8);
        return String.format(Locale.US,
                "%s/reverse?lat=%.6f&lon=%.6f&format=json&addressdetails=1&accept-language=%s",
                baseUrl, latitude, longitude, language);
    }

    private Optional<String> extractLocationName(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);
        String conciseAddress = buildConciseAddress(root.path("address"));
        if (StringUtils.hasText(conciseAddress)) {
            return Optional.of(conciseAddress);
        }

        String name = root.path("name").asText();
        if (StringUtils.hasText(name)) {
            return Optional.of(name);
        }

        String displayName = root.path("display_name").asText();
        if (StringUtils.hasText(displayName)) {
            return Optional.of(displayName);
        }

        return Optional.empty();
    }

    private String buildConciseAddress(JsonNode address) {
        if (address == null || !address.isObject()) {
            return null;
        }

        String locality = firstNonBlank(address,
                "suburb", "borough", "city_district", "district", "town", "village", "municipality", "city", "county");
        String region = firstNonBlank(address,
                "city", "state_district", "province", "state", "county");
        String country = firstNonBlank(address, "country");

        List<String> parts = new ArrayList<>(3);
        addUniquePart(parts, locality);
        addUniquePart(parts, region);
        addUniquePart(parts, country);

        return parts.isEmpty() ? null : String.join(", ", parts);
    }

    private String firstNonBlank(JsonNode source, String... keys) {
        for (String key : keys) {
            String value = source.path(key).asText();
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }
        return null;
    }

    private void addUniquePart(List<String> parts, String value) {
        if (!StringUtils.hasText(value)) {
            return;
        }
        boolean exists = parts.stream().anyMatch(part -> part.equalsIgnoreCase(value));
        if (!exists) {
            parts.add(value);
        }
    }

    private String trimTrailingSlash(String url) {
        if (url == null) {
            return "";
        }
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}

