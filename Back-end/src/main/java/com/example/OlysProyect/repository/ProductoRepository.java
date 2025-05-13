package com.example.OlysProyect.repository;

import com.example.OlysProyect.entities.Producto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductoRepository extends CrudRepository<Producto,Long> {

    Optional<Producto> findByNombre(String nombre);
}
