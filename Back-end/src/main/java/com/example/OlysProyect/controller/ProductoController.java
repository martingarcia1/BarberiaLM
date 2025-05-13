package com.example.OlysProyect.controller;

import com.example.OlysProyect.controller.dto.ProductoDTO;
import com.example.OlysProyect.entities.Producto;
import com.example.OlysProyect.service.IProductoService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/producto")
public class ProductoController {
    @Autowired
    private IProductoService productoService;

    @GetMapping("/findByid/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id){
        Optional<Producto>productoOptional=productoService.findById(id);

        if (productoOptional.isPresent()){
            Producto producto = productoOptional.get();

            ProductoDTO productoDTO= ProductoDTO.builder()
                    .id(producto.getId())
                    .nombre(producto.getNombre())
                    .cantidad(producto.getCantidad())
                    .calorias(producto.getCalorias())
                    .precio(producto.getPrecio())
                    .tipoProducto(producto.getTipoProducto())
                    .build();

            return ResponseEntity.ok(productoDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?>findAll(){
        List<ProductoDTO>productoList=productoService.findAll().stream()
                .map(map-> ProductoDTO.builder()
                        .id(map.getId())
                        .nombre(map.getNombre())
                        .calorias(map.getCalorias())
                        .cantidad(map.getCantidad())
                        .precio(map.getPrecio())
                        .tipoProducto(map.getTipoProducto())
                        .build()
                ).toList();
        return ResponseEntity.ok(productoList);

    }

    @PostMapping("/save")
    public ResponseEntity<?>saveProducto(@RequestBody ProductoDTO productoDTO){
        if(productoDTO.getNombre().isBlank() || productoDTO.getCantidad() < 0 || productoDTO.getCalorias() == null || productoDTO.getTipoProducto().isBlank()){
            return  ResponseEntity.badRequest().build();
        }
        boolean respuesta= productoService.saveProducto(Producto.builder().nombre(productoDTO.getNombre()).calorias(productoDTO.getCalorias()).cantidad(productoDTO.getCantidad()).tipoProducto(productoDTO.getTipoProducto()).precio(productoDTO.getPrecio()).build());
        if (respuesta){
          return  ResponseEntity.ok("Producto Cargado");
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("Producto ya exitente");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?>updateProducto(@PathVariable Long id,@RequestBody ProductoDTO productoDTO){
        Optional<Producto>productoOptional=productoService.findById(id);

        if(productoOptional.isPresent()){
            Producto producto=productoOptional.get();

            producto.setCalorias(productoDTO.getCalorias());
            producto.setNombre(productoDTO.getNombre());
            producto.setTipoProducto(productoDTO.getTipoProducto());
            producto.setCantidad(productoDTO.getCantidad());
            producto.setPrecio(productoDTO.getPrecio());

            productoService.updateProducto(producto);

            return ResponseEntity.ok("Producto actualizado");
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<?>deleteProducto(@PathVariable Long id){
        if(id!=null){
            productoService.deleteById(id);
            return ResponseEntity.ok("Producto Eliminado");
        }
        return ResponseEntity.badRequest().build();
    }
}
