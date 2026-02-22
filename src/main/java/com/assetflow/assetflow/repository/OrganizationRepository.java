package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
