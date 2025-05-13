package com.example.OlysProyect.controller.dto;

import com.example.OlysProyect.entities.Pedido;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MetodoPagoDTO {
    private Long id;
    private String metodoPago;

    private List<Pedido> pedidoLista= new ArrayList<>();
}
