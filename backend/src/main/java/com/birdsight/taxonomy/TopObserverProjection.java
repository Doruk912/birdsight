package com.birdsight.taxonomy;

import java.util.UUID;

public interface TopObserverProjection {
    UUID getUserId();
    String getUsername();
    String getDisplayName();
    String getAvatarUrl();
    long getObservationCount();
}
