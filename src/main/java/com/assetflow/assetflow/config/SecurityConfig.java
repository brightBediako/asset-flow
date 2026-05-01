package com.assetflow.assetflow.config;

import com.assetflow.assetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/actuator/health/**", "/actuator/info").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        // Public catalog browsing endpoints
                        .requestMatchers(HttpMethod.GET, "/api/assets", "/api/assets/**").permitAll()
                        // Read access for any authenticated user; write requires SUPER_ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/roles", "/api/roles/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/users", "/api/users/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/organizations", "/api/organizations/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/*").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/assets/**").hasAnyAuthority("SUPER_ADMIN", "ORG_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/assets/**").hasAnyAuthority("SUPER_ADMIN", "ORG_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/assets/**").hasAnyAuthority("SUPER_ADMIN", "ORG_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/asset-categories", "/api/asset-categories/**")
                        .hasAnyAuthority("SUPER_ADMIN", "ORG_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/asset-categories", "/api/asset-categories/**").hasAuthority("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/asset-categories", "/api/asset-categories/**").hasAuthority("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/asset-categories", "/api/asset-categories/**").hasAuthority("SUPER_ADMIN")
                        .requestMatchers("/api/roles/**").hasAuthority("SUPER_ADMIN")
                        .requestMatchers("/api/users/**").hasAnyAuthority("SUPER_ADMIN", "ORG_ADMIN")
                        .requestMatchers("/api/organizations/**").hasAuthority("SUPER_ADMIN")
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().authenticated());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> userRepository.findByEmail(email)
                .map(user -> org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPasswordHash())
                        .authorities(user.getRole().getName())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
