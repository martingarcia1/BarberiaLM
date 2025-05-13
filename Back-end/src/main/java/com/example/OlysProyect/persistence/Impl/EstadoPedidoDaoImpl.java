package com.example.OlysProyect.persistence.Impl;

import com.example.OlysProyect.entities.EstadoPedido;
import com.example.OlysProyect.persistence.IEstadoPedidoDao;
import com.example.OlysProyect.repository.EstadoPedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class EstadoPedidoDaoImpl implements IEstadoPedidoDao {
    @Autowired
    private EstadoPedidoRepository estadoPedidoRepository;
    @Override
    public Optional<EstadoPedido> findById(Long id) {
        return estadoPedidoRepository.findById(id);
    }

    @Override
    public void save(EstadoPedido estadoPedido) {
        estadoPedidoRepository.save(estadoPedido);
    }
}
