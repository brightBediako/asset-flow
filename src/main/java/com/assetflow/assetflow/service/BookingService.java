package com.assetflow.assetflow.service;

import com.assetflow.assetflow.entity.Booking;
import com.assetflow.assetflow.repository.AssetRepository;
import com.assetflow.assetflow.repository.BookingRepository;
import com.assetflow.assetflow.repository.OrganizationRepository;
import com.assetflow.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final OrganizationRepository organizationRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Booking> findByOrganizationId(Long organizationId) {
        return bookingRepository.findByOrganizationId(organizationId);
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
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking update(Long id, Booking booking) {
        Booking existing = bookingRepository.findById(id).orElse(null);
        if (existing == null) return null;
        if (booking.getStatus() != null) existing.setStatus(booking.getStatus());
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
}
