package com.example.OlysProyect.service.Impl;

import com.example.OlysProyect.entities.Producto;
import com.example.OlysProyect.persistence.IProductoDao;
import com.example.OlysProyect.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements IProductoService {
    @Autowired
    private IProductoDao productoDao;
    @Override
    public Optional<Producto> findById(Long id) {
        return productoDao.findById(id);
    }

    @Override
    public List<Producto> findAll() {
        return (List<Producto>) productoDao.findAll();
    }

    @Override
    public boolean saveProducto(Producto producto) {
       Optional<Producto> productoOptional= productoDao.findByNombre(producto.getNombre());
       if (productoOptional.isEmpty()){
           productoDao.saveProducto(producto);
           return true;
       }
       else {
           return false;
       }

    }

    @Override
    public void deleteById(Long id) {
        productoDao.deleteById(id);
    }

    @Override
    public void updateProducto(Producto producto) {
        productoDao.saveProducto(producto);
    }


}
