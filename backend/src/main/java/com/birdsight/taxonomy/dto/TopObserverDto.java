package com.birdsight.taxonomy.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopObserverDto {
    private UUID userId;
    private String username;
    private String displayName;
    private String avatarUrl;
    private long observationCount;
}
