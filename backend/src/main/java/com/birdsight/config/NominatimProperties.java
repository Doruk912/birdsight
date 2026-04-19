package com.birdsight.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.nominatim")
public class NominatimProperties {

    private boolean enabled;
    private String baseUrl;
    private int timeoutMillis;
    private String userAgent;
    private String language;
}

