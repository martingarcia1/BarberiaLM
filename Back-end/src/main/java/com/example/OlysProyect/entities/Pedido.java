package com.example.OlysProyect.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nombre_cliente")
    private String nombreCliente;
    @Column(name = "celular_cliente")
    private String celularCliente;
    @Column(name = "direccion_cliente")
    private String direccionCliente;

    private Boolean envio;

    private LocalDate fecha;

    private BigDecimal precio;

    private List<String>listaEnsaladas= new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "pedido_producto",joinColumns = @JoinColumn(name = "pedido_id"),inverseJoinColumns = @JoinColumn(name = "producto_id"))
    @JsonIgnore
    private List<Producto> productosList=new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_metodo_pago",nullable = false)
    @JsonIgnore
    private MetodoPago metodoPago;

    @ManyToOne
    @JoinColumn(name = "id_estado_pedido",nullable = false)
    @JsonIgnore
    private EstadoPedido estadoPedido;
}
