package com.assetflow.assetflow.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Locale;

/**
 * Ensures {@code asset_category.organization_id} allows NULL so global categories (SUPER_ADMIN)
 * persist correctly. Hibernate {@code ddl-auto=update} often does not relax an existing NOT NULL.
 * Runs after the {@code entityManagerFactory} bean starts so Hibernate has updated the schema first.
 */
@Component
@DependsOn("entityManagerFactory")
@RequiredArgsConstructor
@Slf4j
public class AssetCategorySchemaCompatibilityRunner {

    private final DataSource dataSource;

    @PostConstruct
    public void relaxAssetCategoryOrganizationNullability() {
        try (Connection conn = dataSource.getConnection(); Statement st = conn.createStatement()) {
            String db = conn.getMetaData().getDatabaseProductName().toLowerCase(Locale.ROOT);
            if (!db.contains("postgresql") && !db.contains("h2")) {
                return;
            }
            st.executeUpdate("ALTER TABLE asset_category ALTER COLUMN organization_id DROP NOT NULL");
            log.debug("asset_category.organization_id nullability ensured for global categories.");
        } catch (SQLException ex) {
            log.warn("Skipped asset_category.organization_id nullability adjustment: {}", ex.getMessage());
        }
    }
}
