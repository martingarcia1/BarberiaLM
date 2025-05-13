package com.example.OlysProyect.controller;

import com.example.OlysProyect.controller.dto.MetodoPagoDTO;
import com.example.OlysProyect.controller.dto.PedidoDTO;
import com.example.OlysProyect.entities.MetodoPago;
import com.example.OlysProyect.service.IMetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/metodoPago")
public class MetodoPagoController {

    @Autowired
    private IMetodoPagoService metodoPagoService;

    @PostMapping("/save")
    public ResponseEntity<?> saveMetodoPago(@RequestBody MetodoPagoDTO metodoPagoDTO){

        if(metodoPagoDTO.getMetodoPago().isBlank()){
            return  ResponseEntity.badRequest().build();
        }

        MetodoPago metodoPago=MetodoPago.builder().metodoPago(metodoPagoDTO.getMetodoPago()).build();
        metodoPagoService.save(metodoPago);
        return ResponseEntity.ok("Metodo de pago Cargado");
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<?>findById(@PathVariable Long id){
        Optional<MetodoPago>metodoPagoOptional=metodoPagoService.findById(id);

        if(metodoPagoOptional.isPresent()){
            MetodoPago metodoPago=metodoPagoOptional.get();
            MetodoPagoDTO metodoPagoDTO=MetodoPagoDTO.builder()
                    .id(metodoPago.getId())
                    .metodoPago(metodoPago.getMetodoPago())
                    .pedidoLista(metodoPago.getPedidoLista())
                    .build();

            return ResponseEntity.ok(metodoPagoDTO);
        }
        return ResponseEntity.notFound().build();

    }
}
