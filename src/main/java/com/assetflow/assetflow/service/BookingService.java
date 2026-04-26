package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.Booking;
import com.assetflow.assetflow.entity.BookingStatus;
import com.assetflow.assetflow.repository.AssetRepository;
import com.assetflow.assetflow.repository.BookingRepository;
import com.assetflow.assetflow.repository.OrganizationRepository;
import com.assetflow.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final OrganizationRepository organizationRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    private static final List<BookingStatus> ACTIVE_STATUSES = List.of(
            BookingStatus.PENDING,
            BookingStatus.APPROVED
    );

    @Transactional(readOnly = true)
    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Booking> findByOrganizationId(Long organizationId) {
        return bookingRepository.findByOrganizationId(organizationId);
    }

    @Transactional(readOnly = true)
    public List<Booking> findByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Page<Booking> search(Long organizationId, Long userId, String query, Pageable pageable) {
        String normalizedQuery = (query == null || query.isBlank()) ? null : query.trim();
        return bookingRepository.search(organizationId, userId, normalizedQuery, pageable);
    }

    @Transactional(readOnly = true)
    public Booking findById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    @Transactional
    public Booking create(Booking booking) {
        if (booking.getOrganization() != null && booking.getOrganization().getId() != null) {
            booking.setOrganization(organizationRepository.findById(booking.getOrganization().getId()).orElseThrow());
        }
        if (booking.getAsset() != null && booking.getAsset().getId() != null) {
            booking.setAsset(assetRepository.findById(booking.getAsset().getId()).orElseThrow());
        }
        if (booking.getUser() != null && booking.getUser().getId() != null) {
            booking.setUser(userRepository.findById(booking.getUser().getId()).orElseThrow());
        }
        if (booking.getApprovedBy() != null && booking.getApprovedBy().getId() != null) {
            booking.setApprovedBy(userRepository.findById(booking.getApprovedBy().getId()).orElse(null));
        }

        validateTimeWindow(booking.getStartTime(), booking.getEndTime());
        ensureNoConflictingBooking(booking.getAsset() != null ? booking.getAsset().getId() : null,
                booking.getStartTime(), booking.getEndTime());

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking update(Long id, Booking booking) {
        Booking existing = bookingRepository.findById(id).orElse(null);
        if (existing == null) return null;

        if (booking.getStatus() != null) {
            validateStatusTransition(existing.getStatus(), booking.getStatus());
            existing.setStatus(booking.getStatus());
        }
        if (booking.getCheckedInAt() != null) existing.setCheckedInAt(booking.getCheckedInAt());
        if (booking.getCheckedOutAt() != null) existing.setCheckedOutAt(booking.getCheckedOutAt());
        if (booking.getApprovedBy() != null && booking.getApprovedBy().getId() != null) {
            existing.setApprovedBy(userRepository.findById(booking.getApprovedBy().getId()).orElse(null));
        }
        return bookingRepository.save(existing);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!bookingRepository.existsById(id)) return false;
        bookingRepository.deleteById(id);
        return true;
    }

    private void validateTimeWindow(Instant startTime, Instant endTime) {
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("startTime and endTime are required");
        }
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("startTime must be before endTime");
        }
    }

    private void ensureNoConflictingBooking(Long assetId, Instant startTime, Instant endTime) {
        if (assetId == null) {
            throw new IllegalArgumentException("asset.id is required");
        }
        boolean conflict = bookingRepository
                .existsByAssetIdAndStatusInAndStartTimeBeforeAndEndTimeAfter(assetId, ACTIVE_STATUSES, endTime, startTime);
        if (conflict) {
            throw new IllegalArgumentException("Asset is already booked for the selected time range");
        }
    }

    private void validateStatusTransition(BookingStatus current, BookingStatus next) {
        if (current == next) {
            return;
        }
        switch (current) {
            case PENDING -> {
                if (next != BookingStatus.APPROVED && next != BookingStatus.REJECTED) {
                    throw new IllegalArgumentException("Invalid status transition from PENDING to " + next);
                }
            }
            case APPROVED -> {
                if (next != BookingStatus.COMPLETED) {
                    throw new IllegalArgumentException("Invalid status transition from APPROVED to " + next);
                }
            }
            case REJECTED, COMPLETED -> {
                throw new IllegalArgumentException("Cannot change status once booking is " + current);
            }
        }
    }
}
