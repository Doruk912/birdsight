package com.birdsight.taxonomy.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopIdentifierDto {
    private UUID userId;
    private String username;
    private String displayName;
    private String avatarUrl;
    private long identificationCount;
}
