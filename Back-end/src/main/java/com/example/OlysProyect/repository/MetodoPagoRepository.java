package com.example.OlysProyect.repository;

import com.example.OlysProyect.entities.MetodoPago;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetodoPagoRepository extends CrudRepository<MetodoPago,Long> {
}
