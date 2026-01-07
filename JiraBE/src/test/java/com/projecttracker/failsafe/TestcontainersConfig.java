package com.projecttracker.failsafe;

import org.springframework.boot.test.context.TestConfiguration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;

@TestConfiguration
public class TestcontainersConfig {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("projecttracker")
                    .withUsername("admin")
                    .withPassword("admin123");

    static {
        postgres.start();
        System.setProperty(
                "spring.datasource.url",
                postgres.getJdbcUrl()
        );
        System.setProperty(
                "spring.datasource.username",
                postgres.getUsername()
        );
        System.setProperty(
                "spring.datasource.password",
                postgres.getPassword()
        );
    }
}
