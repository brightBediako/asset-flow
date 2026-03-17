package com.assetflow.assetflow;

import com.assetflow.assetflow.entity.Asset;
import com.assetflow.assetflow.entity.AssetCategory;
import com.assetflow.assetflow.entity.AssetStatus;
import com.assetflow.assetflow.entity.Organization;
import com.assetflow.assetflow.repository.AssetCategoryRepository;
import com.assetflow.assetflow.repository.AssetRepository;
import com.assetflow.assetflow.repository.OrganizationRepository;
import com.assetflow.assetflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Transactional
class BookingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private AssetCategoryRepository assetCategoryRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    private long orgId;
    private long assetId;
    private long userId;

    @BeforeEach
    void setUp() {
        Organization org = organizationRepository.findAll().stream().findFirst().orElseThrow();
        orgId = org.getId();
        AssetCategory cat = assetCategoryRepository.save(
                AssetCategory.builder().name("TestCat").organization(org).build());
        Asset asset = assetRepository.save(Asset.builder()
                .name("Test Asset")
                .organization(org)
                .category(cat)
                .status(AssetStatus.AVAILABLE)
                .build());
        assetId = asset.getId();
        userId = userRepository.findAll().get(0).getId();
    }

    @Test
    void createBookingWithEndBeforeStartReturns400() throws Exception {
        String body = """
                {"organization":{"id":%d},"asset":{"id":%d},"user":{"id":%d},"startTime":"2025-03-10T12:00:00Z","endTime":"2025-03-10T10:00:00Z","status":"PENDING"}
                """.formatted(orgId, assetId, userId).trim();
        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").value("startTime must be before endTime"));
    }
}
