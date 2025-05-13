package com.example.OlysProyect.repository;

import com.example.OlysProyect.entities.EstadoPedido;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoPedidoRepository extends CrudRepository<EstadoPedido,Long> {
}
