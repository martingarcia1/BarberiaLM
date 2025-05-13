package com.example.OlysProyect.persistence;

import com.example.OlysProyect.entities.Producto;

import java.util.List;
import java.util.Optional;

public interface IProductoDao {

    Optional<Producto> findById(Long id);
    List<Producto>findAll();
    void saveProducto(Producto producto);
    void deleteById(Long id);
    Optional<Producto> findByNombre(String nombre);
}
