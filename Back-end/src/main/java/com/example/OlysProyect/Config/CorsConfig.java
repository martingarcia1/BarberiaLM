package com.example.OlysProyect.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://www.mngss.online")); // Permitir el origen del frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); // Métodos permitidos
        config.setAllowedHeaders(List.of("*")); // Permitir todos los headers
        config.setExposedHeaders(List.of("Authorization"));// Permitir credenciales (importante si estás trabajando con cookies o JWT)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Aplicar a todas las rutas
        return source;
    }
}
