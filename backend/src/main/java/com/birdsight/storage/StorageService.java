package com.birdsight.storage;

import com.birdsight.common.exception.BadRequestException;
import com.birdsight.config.MinioProperties;
import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageService {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );
    private static final long AVATAR_MAX_SIZE = 5 * 1024 * 1024;       // 5 MB
    private static final long OBSERVATION_MAX_SIZE = 10 * 1024 * 1024;  // 10 MB

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    public String uploadAvatar(UUID userId, MultipartFile file) {
        validateImage(file, AVATAR_MAX_SIZE, "Avatar");
        String objectKey = "avatars/" + userId + "/" + UUID.randomUUID() + "." + getExtension(file.getOriginalFilename());
        return upload(objectKey, file);
    }

    public void deleteAvatar(String avatarUrl) {
        deleteByUrl(avatarUrl);
    }

    public String uploadObservationImage(UUID observationId, MultipartFile file) {
        validateImage(file, OBSERVATION_MAX_SIZE, "Observation image");
        String objectKey = "observations/" + observationId + "/" + UUID.randomUUID() + "." + getExtension(file.getOriginalFilename());
        return upload(objectKey, file);
    }

    private String upload(String objectKey, MultipartFile file) {
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioProperties.getBucketName())
                            .object(objectKey)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to upload '{}': {}", objectKey, e.getMessage(), e);
            throw new RuntimeException("Failed to upload file. Please try again.", e);
        }

        return minioProperties.getEndpoint() + "/" + minioProperties.getBucketName() + "/" + objectKey;
    }

    private void deleteByUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;

        String prefix = minioProperties.getEndpoint() + "/" + minioProperties.getBucketName() + "/";
        if (!fileUrl.startsWith(prefix)) return;

        String objectKey = fileUrl.substring(prefix.length());

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(minioProperties.getBucketName())
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            log.warn("Failed to delete object '{}': {}", objectKey, e.getMessage());
        }
    }

    private void validateImage(MultipartFile file, long maxSize, String label) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException(label + " file must not be empty.");
        }
        if (file.getSize() > maxSize) {
            throw new BadRequestException(label + " file size must not exceed " + (maxSize / (1024 * 1024)) + " MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new BadRequestException(label + " must be a JPEG, PNG, or WebP image.");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
