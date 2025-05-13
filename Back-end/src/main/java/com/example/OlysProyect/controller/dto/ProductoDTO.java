package com.example.OlysProyect.controller.dto;

import com.example.OlysProyect.entities.Pedido;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductoDTO {
    private Long id;
    private String tipoProducto;
    private String nombre;
    private int cantidad;
    private BigDecimal calorias;
    private int precio;

    private List<Pedido> pedido=new ArrayList<>();
}
