package com.example.OlysProyect.controller;

import com.example.OlysProyect.controller.dto.PedidoDTO;
import com.example.OlysProyect.entities.EstadoPedido;
import com.example.OlysProyect.entities.Pedido;
import com.example.OlysProyect.service.IEstadoPedidoService;
import com.example.OlysProyect.service.IPedidoService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/pedido")
public class PedidoController {
    @Autowired
    private IPedidoService pedidoService;

    @Autowired
    private IEstadoPedidoService estadoPedidoService;

    @Value("${mercado-pago.access-token}")
    private String accessToken;

    @PostMapping("/save")
    public ResponseEntity<?> savePedido(@RequestBody PedidoDTO pedidoDTO){
        if (pedidoDTO.getNombreCliente().isBlank()||pedidoDTO.getCelularCliente().isBlank()||pedidoDTO.getMetodoPago()==null||pedidoDTO.getFecha()==null||pedidoDTO.getProductosList()==null||pedidoDTO.getPrecio()==null){
            return ResponseEntity.badRequest().build();
        }
        long estadoPedido=1;
        String direccion=pedidoDTO.getDireccionCliente();
        Optional<EstadoPedido> estadoPedidoOptional=estadoPedidoService.findById(estadoPedido);
        Pedido pedido=Pedido.builder().nombreCliente(pedidoDTO.getNombreCliente())
                .celularCliente(pedidoDTO.getCelularCliente())
                .direccionCliente(direccion != null && !direccion.isEmpty() ? pedidoDTO.getDireccionCliente() : " ")
                .productosList(pedidoDTO.getProductosList())
                .metodoPago(pedidoDTO.getMetodoPago())
                .estadoPedido(estadoPedidoOptional.get())
                .fecha(pedidoDTO.getFecha())
                .envio(pedidoDTO.isEnvio())
                .precio(pedidoDTO.getPrecio())
                .listaEnsaladas(pedidoDTO.getListaEnsaladas())
                .build();
        Pedido pedidoAGuardar = pedidoService.save(pedido);

        try {

            MercadoPagoConfig.setAccessToken(accessToken);

            PreferenceItemRequest itemRequest=PreferenceItemRequest.builder()
                    .quantity(1)
                    .title("Bowls de ensalada")
                    .unitPrice(pedido.getPrecio())
                    .currencyId("ARS")
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);


            PreferenceBackUrlsRequest backUrlsRequest = PreferenceBackUrlsRequest.builder()
                    .pending("https://www.mngss.online/")
                    .failure("https://www.mngss.online/")
                    .success("https://www.mngss.online/")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrlsRequest)
                    .additionalInfo(""+pedidoAGuardar.getId())
                    .notificationUrl("https://protective-heart-production.up.railway.app/api/mp/webhook")
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference= client.create(preferenceRequest);

            return ResponseEntity.ok(preference.getId());


        }catch (MPException | MPApiException e) {
            throw new RuntimeException(e);
        }

    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?>updatePedido(@PathVariable Long id,@RequestBody PedidoDTO pedidoDTO){
        if(id!=null){
            pedidoService.updateByEstadoPedido(id,pedidoDTO.getEstadoPedido().getId());
            return ResponseEntity.ok("Estado Pedido Cambiado");
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<?>findById(@PathVariable Long id){
        Optional<Pedido>pedidoOptional=pedidoService.findById(id);

        if (pedidoOptional.isPresent()){
            Pedido pedido=pedidoOptional.get();

            PedidoDTO pedidoDTO=PedidoDTO.builder()
                    .id(pedido.getId())
                    .nombreCliente(pedido.getNombreCliente())
                    .celularCliente(pedido.getCelularCliente())
                    .direccionCliente(pedido.getDireccionCliente())
                    .estadoPedido(pedido.getEstadoPedido())
                    .metodoPago(pedido.getMetodoPago())
                    .productosList(pedido.getProductosList())
                    .fecha(pedido.getFecha())
                    .envio(pedido.getEnvio())
                    .precio(pedido.getPrecio())
                    .listaEnsaladas(pedido.getListaEnsaladas())
                    .build();

            return ResponseEntity.ok(pedidoDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("findAll")
    public ResponseEntity<?>findAll(){
        List<PedidoDTO>pedidoDTOS=pedidoService.findAll().stream()
                .map(map->
                        PedidoDTO.builder()
                                .id(map.getId())
                                .nombreCliente(map.getNombreCliente())
                                .celularCliente(map.getCelularCliente())
                                .direccionCliente(map.getDireccionCliente())
                                .estadoPedido(map.getEstadoPedido())
                                .metodoPago(map.getMetodoPago())
                                .productosList(map.getProductosList())
                                .fecha(map.getFecha())
                                .envio(map.getEnvio())
                                .precio(map.getPrecio())
                                .listaEnsaladas(map.getListaEnsaladas())
                                .build())
                .toList();

        return  ResponseEntity.ok(pedidoDTOS);
    }

    @GetMapping("/findAll/{fechaI}/{fechaF}")
    public ResponseEntity<?> findAllByFecha(@PathVariable LocalDate fechaI,@PathVariable LocalDate fechaF){
        if (fechaF==null || fechaI==null){
            return ResponseEntity.badRequest().build();
        }
        if (fechaF.isBefore(fechaI)){
            return ResponseEntity.badRequest().body("La fecha final no puede ser anterior a la fecha inicial");
        }
        List<PedidoDTO>pedidoDTOS=pedidoService.findAllFecha(fechaI,fechaF).stream()
                .map(map->
                        PedidoDTO.builder()
                                .id(map.getId())
                                .nombreCliente(map.getNombreCliente())
                                .celularCliente(map.getCelularCliente())
                                .direccionCliente(map.getDireccionCliente())
                                .estadoPedido(map.getEstadoPedido())
                                .metodoPago(map.getMetodoPago())
                                .productosList(map.getProductosList())
                                .fecha(map.getFecha())
                                .envio(map.getEnvio())
                                .precio(map.getPrecio())
                                .listaEnsaladas(map.getListaEnsaladas())
                                .build())
                .toList();

        return ResponseEntity.ok(pedidoDTOS);
    }

    @GetMapping("findAllByEstadoPedido/{estadoPedidoId}")
    public ResponseEntity<?> findAllByEstadoPedido(@PathVariable Long estadoPedidoId){
        if(estadoPedidoId > 0){
            List<PedidoDTO> pedidoDTOS= pedidoService.findByEstadoPedido_Id(estadoPedidoId).stream()
                    .map(map->
                            PedidoDTO.builder()
                                    .id(map.getId())
                                    .nombreCliente(map.getNombreCliente())
                                    .celularCliente(map.getCelularCliente())
                                    .direccionCliente(map.getDireccionCliente())
                                    .estadoPedido(map.getEstadoPedido())
                                    .metodoPago(map.getMetodoPago())
                                    .productosList(map.getProductosList())
                                    .fecha(map.getFecha())
                                    .envio(map.getEnvio())
                                    .precio(map.getPrecio())
                                    .listaEnsaladas(map.getListaEnsaladas())
                                    .build())
                    .toList();

            return ResponseEntity.ok(pedidoDTOS);
        }
        return ResponseEntity.badRequest().body("Id no encontrado");
    }

}
