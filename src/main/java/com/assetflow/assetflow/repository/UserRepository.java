package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByOrganizationId(Long organizationId);

    List<User> findByRoleId(Long roleId);

    @Query("""
            SELECT u
            FROM User u
            WHERE (:organizationId IS NULL OR u.organization.id = :organizationId)
              AND (
                :query IS NULL
                OR LOWER(COALESCE(u.fullName, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(COALESCE(u.email, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(COALESCE(u.role.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(CAST(u.id AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
              )
            """)
    Page<User> search(
            @Param("organizationId") Long organizationId,
            @Param("query") String query,
            Pageable pageable);
}
