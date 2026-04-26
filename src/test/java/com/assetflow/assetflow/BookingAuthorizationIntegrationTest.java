package com.assetflow.assetflow;

import com.assetflow.assetflow.entity.*;
import com.assetflow.assetflow.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BookingAuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private AssetCategoryRepository assetCategoryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private User ownerUser;
    private Booking ownerBooking;

    @BeforeEach
    void setUp() {
        Organization organization = organizationRepository.save(
                Organization.builder().name("Auth Org").build());

        Role userRole = roleRepository.findByName("USER").orElseGet(() ->
                roleRepository.save(Role.builder().name("USER").build()));

        ownerUser = userRepository.save(User.builder()
                .email("owner.auth@test.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .fullName("Owner User")
                .organization(organization)
                .role(userRole)
                .build());

        userRepository.save(User.builder()
                .email("other.auth@test.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .fullName("Other User")
                .organization(organization)
                .role(userRole)
                .build());

        AssetCategory category = assetCategoryRepository.save(
                AssetCategory.builder().name("Auth Category").organization(organization).build());
        Asset asset = assetRepository.save(Asset.builder()
                .name("Auth Asset")
                .organization(organization)
                .category(category)
                .status(AssetStatus.AVAILABLE)
                .build());

        ownerBooking = bookingRepository.save(Booking.builder()
                .organization(organization)
                .asset(asset)
                .user(ownerUser)
                .startTime(Instant.parse("2026-04-26T10:00:00Z"))
                .endTime(Instant.parse("2026-04-26T11:00:00Z"))
                .status(BookingStatus.PENDING)
                .build());
    }

    @Test
    void normalUserCannotAccessAnotherUsersBookingById() throws Exception {
        mockMvc.perform(get("/api/bookings/{id}", ownerBooking.getId())
                        .with(user("other.auth@test.com").authorities(new SimpleGrantedAuthority("USER"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void normalUserSearchIsRestrictedToTheirOwnBookings() throws Exception {
        mockMvc.perform(get("/api/bookings/search")
                        .param("userId", String.valueOf(ownerUser.getId()))
                        .with(user("other.auth@test.com").authorities(new SimpleGrantedAuthority("USER"))))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String body = result.getResponse().getContentAsString();
                    if (body.contains("\"id\":" + ownerBooking.getId())) {
                        throw new AssertionError("Search response should not include another user's booking");
                    }
                });
    }
}
