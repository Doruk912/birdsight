package com.birdsight.ml.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for the external ML prediction service.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.ml-service")
public class MLServiceProperties {

    /** Base URL of the ML service */
    private String url;

    /** HTTP timeout in milliseconds for calls to the ML service. */
    private int timeout;
}
