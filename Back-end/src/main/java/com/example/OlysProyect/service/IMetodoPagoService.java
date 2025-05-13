package com.example.OlysProyect.service;

import com.example.OlysProyect.entities.MetodoPago;

import java.util.Optional;

public interface IMetodoPagoService {
    Optional<MetodoPago> findById(Long id);
    void save(MetodoPago metodoPago);
}
