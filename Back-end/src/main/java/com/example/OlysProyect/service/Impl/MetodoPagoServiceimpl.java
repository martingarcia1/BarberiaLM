package com.example.OlysProyect.service.Impl;

import com.example.OlysProyect.entities.MetodoPago;
import com.example.OlysProyect.persistence.IMetodoPagoDao;
import com.example.OlysProyect.service.IMetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MetodoPagoServiceimpl implements IMetodoPagoService {
    @Autowired
    private IMetodoPagoDao metodoPagoDao;
    @Override
    public Optional<MetodoPago> findById(Long id) {
        return metodoPagoDao.findById(id);
    }

    @Override
    public void save(MetodoPago metodoPago) {
        metodoPagoDao.save(metodoPago);
    }
}
