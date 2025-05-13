package com.example.OlysProyect.security;


import com.example.OlysProyect.Config.CorsConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class WebSecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private  JWTAuthorizationFilter JWTauthorizationFilter;
    @Autowired
    private  CorsConfig corsConfig;
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http,AuthenticationManager authManager) throws Exception {

            JWTAuthenticationFilter jwtAuthenticationFilter=new JWTAuthenticationFilter();

            jwtAuthenticationFilter.setAuthenticationManager(authManager);
            jwtAuthenticationFilter.setFilterProcessesUrl("/login");


        return http
                .cors(cors ->  cors.configurationSource(corsConfig.corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/producto/findAll",
                                "/api/pedido/save",
                                "/api/mp/webhook").permitAll() // Estos endpoints son accesibles
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilter(jwtAuthenticationFilter)
                .addFilterBefore(JWTauthorizationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
