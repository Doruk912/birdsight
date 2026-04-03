package com.birdsight.taxonomy;

import java.util.UUID;

public interface TopIdentifierProjection {
    UUID getUserId();
    String getUsername();
    String getDisplayName();
    String getAvatarUrl();
    long getIdentificationCount();
}
