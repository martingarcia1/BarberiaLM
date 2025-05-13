package com.example.OlysProyect.MercadoPago;

import com.example.OlysProyect.EmailSenderService.EmailService;
import com.example.OlysProyect.entities.EstadoPedido;
import com.example.OlysProyect.entities.Pedido;
import com.example.OlysProyect.service.IEstadoPedidoService;
import com.example.OlysProyect.service.IPedidoService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.Console;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class MercadoPagoController {
    @Autowired
    private MercadoPagoService mercadoPagoService;
    @Autowired
    private IPedidoService pedidoService;
    @Autowired
    private IEstadoPedidoService estadoPedidoService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/api/mp/webhook")
    public ResponseEntity<?> handleWebhookNotification(@RequestBody Map<String, Object> webhookData) {


        String type = (String) webhookData.get("type");
        String action = (String) webhookData.get("action");

        if ("merchant_order".equals(webhookData.get("topic"))) {
            Object resourceObj = webhookData.get("resource");
            if (resourceObj instanceof String) {
                String resourceUrl = (String) resourceObj;
                Map<String, Object> merchantOrderDetails = mercadoPagoService.getMerchantOrderDetails(resourceUrl);
                if (merchantOrderDetails.containsKey("additional_info")) {

                    String additionalInfo = (String) merchantOrderDetails.get("additional_info");
                    if(additionalInfo.isBlank()){
                        return ResponseEntity.notFound().build();
                    }

                    try {
                        long idPedido = Long.parseLong(additionalInfo);
                         Optional<Pedido> pedidoOptional=pedidoService.findById(idPedido);
                         long idEstadoPedido=2;
                         Optional<EstadoPedido>estadoPedidoOptional=estadoPedidoService.findById(idEstadoPedido);
                        if (pedidoOptional.isPresent()){
                            Pedido pedido=pedidoOptional.get();
                            pedido.setEstadoPedido(estadoPedidoOptional.get());
                            pedidoService.save(pedido);

                            if(pedido.getEnvio()){
                                try {
                                    List<String> recipients = Arrays.asList("ssanttifigueroa@gmail.com","gonzalezmartinnatanael@gmail.com");
                                    emailService.sendEmail(recipients,"Nuevo pedido","El usuario "+pedido.getNombreCliente()+" hizo en pedido con envio a la direccion: "+ pedido.getDireccionCliente());
                                } catch (MessagingException e) {
                                    System.out.print(e.getMessage());
                                }
                            }



                            return ResponseEntity.ok("Pedido Pagado");
                        }

                    } catch (NumberFormatException e) {
                        System.out.println("Error al convertir 'additional_info' a long: " + e.getMessage());
                    }

                } else {
                    System.out.println("El campo 'additional_info' no está presente en los detalles de la orden");
                }
            } else {
                System.out.println("El campo 'resource' no es una cadena");
            }
        }

        return ResponseEntity.badRequest().body("Invalid webhook data");
    }
}
