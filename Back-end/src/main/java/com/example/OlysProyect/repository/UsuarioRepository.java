package com.example.OlysProyect.repository;

import com.example.OlysProyect.entities.Usuario;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario,Long> {
    Optional<Usuario>findOneByEmail(String email);
}
