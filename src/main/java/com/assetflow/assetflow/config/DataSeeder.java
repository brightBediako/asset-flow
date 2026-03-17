package com.assetflow.assetflow.config;

import com.assetflow.assetflow.entity.Organization;
import com.assetflow.assetflow.entity.Role;
import com.assetflow.assetflow.entity.User;
import com.assetflow.assetflow.repository.OrganizationRepository;
import com.assetflow.assetflow.repository.RoleRepository;
import com.assetflow.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final RoleRepository roleRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Order(1)
    public CommandLineRunner seedData() {
        return args -> {
            if (userRepository.count() > 0) {
                log.debug("Users already exist, skipping seed");
                return;
            }

            Role superAdmin = roleRepository.findByName("SUPER_ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("SUPER_ADMIN").build()));
            roleRepository.findByName("ORG_ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ORG_ADMIN").build()));
            roleRepository.findByName("User")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("User").build()));

            Organization org = organizationRepository.findAll().isEmpty()
                    ? organizationRepository.save(Organization.builder().name("Default Organization").build())
                    : organizationRepository.findAll().get(0);

            if (userRepository.findByEmail("admin@assetflow.local").isEmpty()) {
                User admin = User.builder()
                        .email("admin@assetflow.local")
                        .passwordHash(passwordEncoder.encode("Admin123!"))
                        .fullName("System Admin")
                        .role(superAdmin)
                        .organization(org)
                        .build();
                userRepository.save(admin);
                log.info("Seeded initial SUPER_ADMIN user: admin@assetflow.local");
            }
        };
    }
}
