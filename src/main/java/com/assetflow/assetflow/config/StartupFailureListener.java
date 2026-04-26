package com.assetflow.assetflow.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.sql.SQLException;

@Component
public class StartupFailureListener implements ApplicationListener<ApplicationFailedEvent> {
    private static final Logger log = LoggerFactory.getLogger(StartupFailureListener.class);
    private static final String POSTGRES_INVALID_PASSWORD_SQL_STATE = "28P01";

    @Override
    public void onApplicationEvent(ApplicationFailedEvent event) {
        Throwable cause = event.getException();
        while (cause != null) {
            if (cause instanceof SQLException sqlException
                    && POSTGRES_INVALID_PASSWORD_SQL_STATE.equals(sqlException.getSQLState())) {
                log.error("""
                        Database authentication failed (PostgreSQL SQLSTATE 28P01).
                        Set valid DB credentials before running the backend.
                        Required environment variables:
                          - DB_URL (e.g. jdbc:postgresql://localhost:5432/assetflow)
                          - DB_USERNAME (e.g. postgres)
                          - DB_PASSWORD (your real postgres password)
                        """);
                return;
            }
            cause = cause.getCause();
        }
    }
}
