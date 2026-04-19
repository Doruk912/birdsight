package com.birdsight.observation;

import java.util.Optional;

public interface ReverseGeocodingService {

    Optional<String> reverseGeocode(double latitude, double longitude);
}

