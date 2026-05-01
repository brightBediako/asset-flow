package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    @Query("""
            SELECT o
            FROM Organization o
            WHERE (:query = ''
              OR LOWER(COALESCE(o.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))
              OR LOWER(CAST(o.id AS string)) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Organization> search(@Param("query") String query, Pageable pageable);
}
