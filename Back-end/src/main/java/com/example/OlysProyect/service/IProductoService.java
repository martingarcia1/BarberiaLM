package com.example.OlysProyect.service;

import com.example.OlysProyect.entities.Producto;

import java.util.List;
import java.util.Optional;

public interface IProductoService {
    Optional<Producto> findById(Long id);
    List<Producto> findAll();
    boolean saveProducto(Producto producto);
    void deleteById(Long id);
    void updateProducto(Producto producto);
}
