package com.birdsight.storage;

import com.birdsight.user.UserService;
import com.birdsight.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class AvatarController {

    private final StorageService storageService;
    private final UserService userService;

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> uploadAvatar(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam("file") MultipartFile file) {

        // Look up the user by email (which is the UserDetails username)
        UserResponse currentUser = userService.getUserByEmail(principal.getUsername());

        // Delete old avatar if present
        if (currentUser.getAvatarUrl() != null) {
            storageService.deleteAvatar(currentUser.getAvatarUrl());
        }

        String avatarUrl = storageService.uploadAvatar(currentUser.getId(), file);
        UserResponse updated = userService.updateAvatarUrl(currentUser.getId(), avatarUrl);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<UserResponse> deleteAvatar(
            @AuthenticationPrincipal UserDetails principal) {

        UserResponse currentUser = userService.getUserByEmail(principal.getUsername());

        if (currentUser.getAvatarUrl() != null) {
            storageService.deleteAvatar(currentUser.getAvatarUrl());
            UserResponse updated = userService.updateAvatarUrl(currentUser.getId(), null);
            return ResponseEntity.ok(updated);
        }

        return ResponseEntity.ok(currentUser);
    }
}

