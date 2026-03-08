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

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    public String uploadAvatar(UUID userId, MultipartFile file) {
        validateFile(file);

        String extension = getExtension(file.getOriginalFilename());
        String objectKey = "avatars/" + userId + "/" + UUID.randomUUID() + "." + extension;

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
            log.error("Failed to upload avatar for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to upload avatar. Please try again.", e);
        }

        return minioProperties.getEndpoint() + "/" + minioProperties.getBucketName() + "/" + objectKey;
    }

    public void deleteAvatar(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isBlank()) return;

        String prefix = minioProperties.getEndpoint() + "/" + minioProperties.getBucketName() + "/";
        if (!avatarUrl.startsWith(prefix)) return;

        String objectKey = avatarUrl.substring(prefix.length());

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(minioProperties.getBucketName())
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            log.warn("Failed to delete avatar object '{}': {}", objectKey, e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Avatar file must not be empty.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Avatar file size must not exceed 5 MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException("Avatar must be a JPEG, PNG, or, WebP image.");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}

