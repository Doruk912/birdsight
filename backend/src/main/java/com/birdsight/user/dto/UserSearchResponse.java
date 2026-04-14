package com.birdsight.user.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchResponse {

    private UUID id;
    private String username;
    private String displayName;
    private String avatarUrl;
}
