package com.zentro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Zentro API — Spring Boot modular monolith.
 *
 * <p>Feature modules live under {@code com.zentro.*} (identity, provider, matching,
 * booking, payment, …). Boundaries are enforced via Spring Modulith.
 */
@SpringBootApplication
public class ZentroApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZentroApplication.class, args);
    }
}
