package com.example.OlysProyect.controller.dto;

import com.example.OlysProyect.entities.EstadoPedido;
import com.example.OlysProyect.entities.MetodoPago;
import com.example.OlysProyect.entities.Producto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PedidoDTO {
    private Long id;
    private String nombreCliente;
    private String celularCliente;
    private String direccionCliente;
    private boolean envio;
    private LocalDate fecha;
    private BigDecimal precio;

    private List<String>listaEnsaladas= new ArrayList<>();

    private List<Producto> productosList=new ArrayList<>();

    private MetodoPago metodoPago;

    private EstadoPedido estadoPedido;
}
