package com.example.OlysProyect.service.Impl;

import com.example.OlysProyect.entities.Pedido;
import com.example.OlysProyect.entities.Producto;
import com.example.OlysProyect.persistence.IPedidoDao;
import com.example.OlysProyect.persistence.IProductoDao;
import com.example.OlysProyect.service.IPedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoServiceImpl implements IPedidoService {
    @Autowired
    private IPedidoDao pedidoDao;

    @Autowired
    private IProductoDao productoDao;

    @Override
    public Optional<Pedido> findById(Long id) {
        return pedidoDao.findById(id);
    }

    @Override
    public List<Pedido> findAll() {
        return (List<Pedido>)pedidoDao.findAll() ;
    }

    @Transactional
    @Override
    public Pedido save(Pedido pedido) {

        for (Producto producto : pedido.getProductosList()){
            Optional<Producto> productoOptional=productoDao.findById(producto.getId());

            if (productoOptional.isPresent()){
                Producto producto1=productoOptional.get();

                if (producto1.getCantidad() == 1){

                }
                else {
                    throw new RuntimeException("No hay stock para el producto: "+producto1.getNombre());
                }
            }
            else {
                throw new RuntimeException("No existe el producto con el id: "+producto.getId());
            }

        }
       return pedidoDao.save(pedido);
    }

    @Override
    public void deleteById(Long id) {
        pedidoDao.deleteById(id);
    }

    @Override
    public List<Pedido> findAllFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        return pedidoDao.findAllFechas(fechaInicio,fechaFin);
    }

    @Override
    public void updateByEstadoPedido(Long id, Long idEstadoPedido) {
        pedidoDao.updateByEstadoPedido(id,idEstadoPedido);
    }

    @Override
    public List<Pedido> findByEstadoPedido_Id(Long EstadoPedidoId) {
        return pedidoDao.findByEstadoPedido_Id(EstadoPedidoId);
    }
}
