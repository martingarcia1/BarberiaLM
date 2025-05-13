package com.example.OlysProyect.entities;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Table(name = "admin")
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String email;
    private String password;

}
