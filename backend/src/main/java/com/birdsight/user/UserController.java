package com.birdsight.user;

import com.birdsight.user.dto.ChangePasswordRequest;
import com.birdsight.user.dto.CreateUserRequest;
import com.birdsight.user.dto.UpdateUserRequest;
import com.birdsight.user.dto.UserResponse;
import com.birdsight.user.dto.UserSearchResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.birdsight.security.CustomUserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponse>> searchUsers(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "10") int size) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.ok(List.of());
        }
        List<UserSearchResponse> results = userRepository
                .searchByNameOrUsername(query.trim(), PageRequest.of(0, size))
                .map(u -> UserSearchResponse.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .displayName(u.getDisplayName())
                        .avatarUrl(u.getAvatarUrl())
                        .build())
                .getContent();
        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse created = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal CustomUserDetails principal,
                                                @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getUsername(), request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateUser(@AuthenticationPrincipal CustomUserDetails principal,
                                                        @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(principal.getActualUsername(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/suspend")
    public ResponseEntity<UserResponse> suspendUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.suspendUser(id));
    }

    @PatchMapping("/{id}/unsuspend")
    public ResponseEntity<UserResponse> unsuspendUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.unsuspendUser(id));
    }
}

