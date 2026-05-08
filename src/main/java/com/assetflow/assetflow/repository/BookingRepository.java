package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.Booking;
import com.assetflow.assetflow.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByOrganizationId(Long organizationId);

    List<Booking> findByAssetId(Long assetId);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByAssetIdAndStatusIn(Long assetId, List<BookingStatus> statuses);

    boolean existsByAssetIdAndStatusInAndStartTimeBeforeAndEndTimeAfter(
            Long assetId, List<BookingStatus> statuses, Instant endTime, Instant startTime);

    @Query("""
            SELECT b
            FROM Booking b
            WHERE (:organizationId IS NULL OR b.organization.id = :organizationId)
              AND (:userId IS NULL OR b.user.id = :userId)
              AND (
                :query = ''
                OR LOWER(COALESCE(b.asset.name, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(COALESCE(b.user.fullName, '')) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(CAST(b.status AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(CAST(b.id AS string)) LIKE LOWER(CONCAT('%', :query, '%'))
              )
            """)
    Page<Booking> search(
            @Param("organizationId") Long organizationId,
            @Param("userId") Long userId,
            @Param("query") String query,
            Pageable pageable);
}
