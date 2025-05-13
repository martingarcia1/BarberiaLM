package com.example.OlysProyect.service;

import com.example.OlysProyect.entities.Pedido;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IPedidoService {
    Optional<Pedido> findById(Long id);
    List<Pedido> findAll();
    Pedido save(Pedido pedido);
    void deleteById(Long id);
    List<Pedido>findAllFecha(LocalDate fechaInicio,LocalDate fechaFin);
    void updateByEstadoPedido(Long id,Long idEstadoPedido);

    List<Pedido> findByEstadoPedido_Id(Long EstadoPedidoId);
}
