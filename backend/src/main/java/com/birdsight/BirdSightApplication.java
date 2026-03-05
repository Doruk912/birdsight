package com.birdsight;

import com.birdsight.security.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class BirdSightApplication {

	public static void main(String[] args) {
		SpringApplication.run(BirdSightApplication.class, args);
	}

}
