package com.assetflow.assetflow;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void loginWithSeededAdminReturns200AndUser() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@gmail.com\",\"password\":\"admin123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@gmail.com"))
                .andExpect(jsonPath("$.role.name").value("SUPER_ADMIN"));
    }

    @Test
    void registerWithInvalidPasswordReturns400() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"bad@test.com\",\"password\":\"short\",\"fullName\":\"Test User\",\"roleId\":1}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details.password").exists());
    }

    @Test
    void registerOrganizationAccountAutoCreatesOrganizationAndAssignsOrgAdminRole() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String email = "org+" + suffix + "@test.com";
        String organizationName = "Org " + suffix;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email":"%s",
                                  "password":"password123",
                                  "fullName":"Org Owner",
                                  "accountType":"ORGANIZATION",
                                  "organizationName":"%s"
                                }
                                """.formatted(email, organizationName)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.role.name").value("ORG_ADMIN"))
                .andExpect(jsonPath("$.organization.id").isNumber())
                .andExpect(jsonPath("$.organization.name").value(organizationName));
    }

    @Test
    void registerDefaultUserAccountAssignsUserRole() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String email = "user+" + suffix + "@test.com";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email":"%s",
                                  "password":"password123",
                                  "fullName":"Normal User"
                                }
                                """.formatted(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.role.name").value("USER"));
    }
}
