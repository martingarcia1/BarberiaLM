package com.example.OlysProyect.persistence;

import com.example.OlysProyect.entities.EstadoPedido;

import java.util.Optional;

public interface IEstadoPedidoDao {
    Optional<EstadoPedido> findById(Long id);
    void save(EstadoPedido estadoPedido);
}
