package com.birdsight.user.dto;

import com.birdsight.user.Role;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private UUID id;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private Role role;
    private boolean suspended;
    private Instant emailVerifiedAt;
    private Instant createdAt;
    private Instant updatedAt;
}

