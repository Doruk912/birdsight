package com.birdsight.observation.dto;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObservationImageResponse {

    private UUID id;
    private String imageUrl;
    private int position;
    private Instant createdAt;
}
