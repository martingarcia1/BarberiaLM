package com.example.OlysProyect.persistence.Impl;

import com.example.OlysProyect.entities.EstadoPedido;
import com.example.OlysProyect.entities.Pedido;
import com.example.OlysProyect.persistence.IPedidoDao;
import com.example.OlysProyect.repository.EstadoPedidoRepository;
import com.example.OlysProyect.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
public class PedidoDaoImpl implements IPedidoDao {
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private EstadoPedidoRepository estadoPedidoRepository;

    @Override
    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public List<Pedido> findAll() {
        return (List<Pedido>)pedidoRepository.findAll() ;
    }

    @Override
    public Pedido save(Pedido pedido) {
       return pedidoRepository.save(pedido);
    }

    @Override
    public void deleteById(Long id) {
        pedidoRepository.deleteById(id);
    }

    @Override
    public List<Pedido> findAllFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        return pedidoRepository.findPedidoByFechaBetween(fechaInicio,fechaFin);
    }

    @Override
    public void updateByEstadoPedido(Long id,Long idEstadoPedido) {
        Optional<Pedido> pedidoOptional=pedidoRepository.findById(id);

        if (pedidoOptional.isPresent()){
            Pedido pedido=pedidoOptional.get();
            Optional<EstadoPedido> estadoPedidoOptional=estadoPedidoRepository.findById(idEstadoPedido);
            if (estadoPedidoOptional.isPresent()){
                EstadoPedido estadoPedido=estadoPedidoOptional.get();

                pedido.setEstadoPedido(estadoPedido);
                pedidoRepository.save(pedido);

            }


        }
    }

    @Override
    public List<Pedido> findByEstadoPedido_Id(Long EstadoPedidoId) {
        return pedidoRepository.findByEstadoPedido_Id(EstadoPedidoId);
    }
}
