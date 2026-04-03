package com.birdsight.taxonomy;

import java.util.UUID;

public interface TaxonObservationCountProjection {
    UUID getId();
    long getCount();
}
