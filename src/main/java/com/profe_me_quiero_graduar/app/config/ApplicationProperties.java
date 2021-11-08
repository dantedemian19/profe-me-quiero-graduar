package com.profe_me_quiero_graduar.app.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Profe Me Quiero Graduar.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {}
