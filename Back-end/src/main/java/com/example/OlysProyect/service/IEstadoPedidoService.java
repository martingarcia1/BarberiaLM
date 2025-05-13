package com.example.OlysProyect.service;

import com.example.OlysProyect.entities.EstadoPedido;

import java.util.Optional;

public interface IEstadoPedidoService {
    Optional<EstadoPedido> findById(Long id);

    void save(EstadoPedido estadoPedido);
}
