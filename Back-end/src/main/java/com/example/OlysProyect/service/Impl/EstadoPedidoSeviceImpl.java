package com.example.OlysProyect.service.Impl;

import com.example.OlysProyect.entities.EstadoPedido;
import com.example.OlysProyect.persistence.IEstadoPedidoDao;
import com.example.OlysProyect.service.IEstadoPedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EstadoPedidoSeviceImpl implements IEstadoPedidoService {
    @Autowired
    private IEstadoPedidoDao estadoPedidoDao;
    @Override
    public Optional<EstadoPedido> findById(Long id) {
        return estadoPedidoDao.findById(id);
    }

    @Override
    public void save(EstadoPedido estadoPedido) {
        estadoPedidoDao.save(estadoPedido);
    }
}
