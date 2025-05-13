package com.example.OlysProyect.persistence.Impl;

import com.example.OlysProyect.entities.MetodoPago;
import com.example.OlysProyect.persistence.IMetodoPagoDao;
import com.example.OlysProyect.repository.MetodoPagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class MetodoPagoDaoImpl implements IMetodoPagoDao {
    @Autowired
    private MetodoPagoRepository metodoPagoRepository;
    @Override
    public Optional<MetodoPago> findById(Long id) {
        return metodoPagoRepository.findById(id);
    }

    @Override
    public void save(MetodoPago metodoPago) {
        metodoPagoRepository.save(metodoPago);
    }
}
