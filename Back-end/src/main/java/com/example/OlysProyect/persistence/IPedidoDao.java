package com.example.OlysProyect.persistence;

import com.example.OlysProyect.entities.Pedido;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IPedidoDao {
    Optional<Pedido> findById(Long id);
    List<Pedido>findAll();
    Pedido save(Pedido pedido);
    void deleteById(Long id);
    List<Pedido>findAllFechas(LocalDate fechaInicio, LocalDate fechaFin);
    void updateByEstadoPedido(Long id,Long idEstadoPedido);

    List<Pedido> findByEstadoPedido_Id(Long EstadoPedidoId);
}
