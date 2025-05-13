package com.example.OlysProyect.persistence;

import com.example.OlysProyect.entities.MetodoPago;


import java.util.Optional;


public interface IMetodoPagoDao {
    Optional<MetodoPago> findById(Long id);
    void save(MetodoPago metodoPago);
}
