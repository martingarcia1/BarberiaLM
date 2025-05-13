package com.example.OlysProyect.controller;

import com.example.OlysProyect.controller.dto.EstadoPedidoDTO;
import com.example.OlysProyect.entities.EstadoPedido;

import com.example.OlysProyect.service.IEstadoPedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/estadoPedido")
public class EstadoPedidoController {
    @Autowired
    private IEstadoPedidoService estadoPedidoService;

    @PostMapping("/save")
    public ResponseEntity<?> saveEstadoPedido(@RequestBody EstadoPedidoDTO estadoPedidoDTO){

        if(estadoPedidoDTO.getEstadoPedido().isBlank()){
            return  ResponseEntity.badRequest().build();
        }

       EstadoPedido estadoPedido=EstadoPedido.builder().estadoPedido(estadoPedidoDTO.getEstadoPedido()).build();
        estadoPedidoService.save(estadoPedido);
        return ResponseEntity.ok("Estado de pedido Cargado");
    }

    @GetMapping("/findById/{id}")
    public  ResponseEntity<?> findById(@PathVariable Long id){
        Optional<EstadoPedido>estadoPedidoOptional= estadoPedidoService.findById(id);
        if(estadoPedidoOptional.isPresent()){
            EstadoPedido estadoPedido=estadoPedidoOptional.get();

            EstadoPedidoDTO estadoPedidoDTO= EstadoPedidoDTO.builder()
                    .id(estadoPedido.getId())
                    .estadoPedido(estadoPedido.getEstadoPedido())
                    .pedidoLista(estadoPedido.getPedidoLista())
                    .build();

           return ResponseEntity.ok(estadoPedidoDTO);
        }
        return ResponseEntity.notFound().build();

    }
}
