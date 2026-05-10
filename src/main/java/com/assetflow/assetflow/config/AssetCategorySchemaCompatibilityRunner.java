package com.assetflow.assetflow.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Locale;

/**
 * Ensures {@code asset_category.organization_id} allows NULL so global categories (SUPER_ADMIN)
 * persist correctly. Hibernate {@code ddl-auto=update} often does not relax an existing NOT NULL.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class AssetCategorySchemaCompatibilityRunner {

    private final DataSource dataSource;

    @Bean
    @Order(Integer.MAX_VALUE)
    public ApplicationRunner relaxAssetCategoryOrganizationNullability() {
        return args -> {
            try (Connection conn = dataSource.getConnection(); Statement st = conn.createStatement()) {
                String db = conn.getMetaData().getDatabaseProductName().toLowerCase(Locale.ROOT);
                if (!db.contains("postgresql") && !db.contains("h2")) {
                    return;
                }
                st.executeUpdate("ALTER TABLE asset_category ALTER COLUMN organization_id DROP NOT NULL");
                log.debug("asset_category.organization_id nullability ensured for global categories.");
            } catch (SQLException ex) {
                // Undefined table on some setups, or column already nullable with driver quirks
                log.warn("Skipped asset_category.organization_id nullability adjustment: {}", ex.getMessage());
            }
        };
    }
}
