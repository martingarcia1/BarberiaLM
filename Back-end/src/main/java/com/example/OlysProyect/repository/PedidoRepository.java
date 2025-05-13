package com.example.OlysProyect.repository;

import com.example.OlysProyect.entities.Pedido;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PedidoRepository extends CrudRepository<Pedido,Long> {

    List<Pedido> findPedidoByFechaBetween(LocalDate fechaIncio,LocalDate fechaFin);

    List<Pedido> findByEstadoPedido_Id(Long estadoPedidoId);

}
