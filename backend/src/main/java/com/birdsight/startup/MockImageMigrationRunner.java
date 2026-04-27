package com.birdsight.startup;

import com.birdsight.config.MinioProperties;
import com.birdsight.observation.ObservationImage;
import com.birdsight.observation.ObservationImageRepository;
import com.birdsight.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

/**
 * Runs once after the application context (and Flyway migrations) are fully
 * initialised.  For every observation image whose URL does NOT already point at
 * the local MinIO bucket the runner will:
 * <ol>
 *   <li>Download the image from the external source.</li>
 *   <li>Upload it into MinIO via {@link StorageService}.</li>
 *   <li>Update the {@code image_url} column in the database.</li>
 * </ol>
 * The check is idempotent – already-migrated images are detected by their URL
 * prefix and skipped, so re-running on subsequent starts is a no-op.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MockImageMigrationRunner implements ApplicationRunner {

    private static final Duration HTTP_TIMEOUT = Duration.ofSeconds(30);

    private final ObservationImageRepository observationImageRepository;
    private final StorageService storageService;
    private final MinioProperties minioProperties;

    @Override
    public void run(ApplicationArguments args) {
        String localPrefix = minioProperties.getEndpoint() + "/" + minioProperties.getBucketName() + "/";

        List<ObservationImage> images = observationImageRepository.findAllWithObservation();
        log.info("[MockImageMigration] Checking {} observation image(s) for external URLs …", images.size());

        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(HTTP_TIMEOUT)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();

        int migrated = 0;
        int skipped  = 0;
        int errors   = 0;

        for (ObservationImage image : images) {
            String url = image.getImageUrl();

            if (url == null || url.isBlank() || url.startsWith(localPrefix)) {
                skipped++;
                continue;
            }

            try {
                String newUrl = downloadAndUpload(httpClient, image, url);
                image.setImageUrl(newUrl);
                observationImageRepository.save(image);
                log.debug("[MockImageMigration] Migrated image {} → {}", image.getId(), newUrl);
                migrated++;
            } catch (Exception ex) {
                log.warn("[MockImageMigration] Failed to migrate image {} ({}): {}",
                        image.getId(), url, ex.getMessage());
                errors++;
            }
        }

        log.info("[MockImageMigration] Done — {} migrated, {} already local (skipped), {} error(s).",
                migrated, skipped, errors);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private String downloadAndUpload(HttpClient httpClient,
                                     ObservationImage image,
                                     String externalUrl) throws Exception {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(externalUrl))
                .timeout(HTTP_TIMEOUT)
                .GET()
                .build();

        HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException("HTTP " + response.statusCode() + " from " + externalUrl);
        }

        byte[]      body        = response.body();
        String      contentType = detectContentType(response, externalUrl);
        String      filename    = extractFilename(externalUrl);

        return storageService.uploadObservationImage(
                image.getObservation().getId(),
                new ByteArrayInputStream(body),
                body.length,
                contentType,
                filename
        );
    }

    /**
     * Determines the content-type from the HTTP response {@code Content-Type}
     * header, falling back to a heuristic based on the URL file extension.
     */
    private String detectContentType(HttpResponse<byte[]> response, String url) {
        return response.headers()
                .firstValue("Content-Type")
                .map(ct -> ct.contains(";") ? ct.substring(0, ct.indexOf(';')).trim() : ct.trim())
                .filter(ct -> ct.startsWith("image/"))
                .orElseGet(() -> guessContentTypeFromUrl(url));
    }

    private String guessContentTypeFromUrl(String url) {
        String lower = url.toLowerCase();
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".webp")) return "image/webp";
        return "image/jpeg"; // default – covers .jpg / .jpeg / unknown
    }

    private String extractFilename(String url) {
        int slash = url.lastIndexOf('/');
        int query = url.indexOf('?', slash);
        String raw = slash >= 0 ? url.substring(slash + 1) : url;
        return (query > 0) ? raw.substring(0, query - slash - 1) : raw;
    }
}
