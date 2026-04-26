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

import java.util.List;

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
            normalizeLegacyUserRole();

            if (userRepository.count() > 0) {
                log.debug("Users already exist, skipping seed");
                return;
            }

            Role superAdmin = roleRepository.findByName("SUPER_ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("SUPER_ADMIN").build()));
            roleRepository.findByName("ORG_ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ORG_ADMIN").build()));
            roleRepository.findByName("USER")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("USER").build()));

            Organization org = organizationRepository.findAll().isEmpty()
                    ? organizationRepository.save(Organization.builder().name("Default Organization").build())
                    : organizationRepository.findAll().get(0);

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User admin = User.builder()
                        .email("admin@gmail.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .fullName("System Admin")
                        .role(superAdmin)
                        .organization(org)
                        .build();
                userRepository.save(admin);
                log.info("Seeded initial SUPER_ADMIN user: admin@gmail.com");
            }
        };
    }

    private void normalizeLegacyUserRole() {
        Role canonicalUserRole = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("USER").build()));

        roleRepository.findByName("User").ifPresent(legacyRole -> {
            if (legacyRole.getId().equals(canonicalUserRole.getId())) {
                return;
            }

            List<User> usersWithLegacyRole = userRepository.findByRoleId(legacyRole.getId());
            if (!usersWithLegacyRole.isEmpty()) {
                usersWithLegacyRole.forEach(user -> user.setRole(canonicalUserRole));
                userRepository.saveAll(usersWithLegacyRole);
                log.info("Migrated {} user(s) from legacy role 'User' to 'USER'.", usersWithLegacyRole.size());
            }

            roleRepository.delete(legacyRole);
            log.info("Removed legacy role 'User' after normalization.");
        });
    }
}
