package com.assetflow.assetflow.repository;

import com.assetflow.assetflow.entity.Booking;
import com.assetflow.assetflow.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByOrganizationId(Long organizationId);

    List<Booking> findByAssetId(Long assetId);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByAssetIdAndStatusIn(Long assetId, List<BookingStatus> statuses);

    boolean existsByAssetIdAndStatusInAndStartTimeBeforeAndEndTimeAfter(
            Long assetId, List<BookingStatus> statuses, Instant endTime, Instant startTime);
}
