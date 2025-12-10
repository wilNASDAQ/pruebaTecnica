package pruebatecnica.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pruebatecnica.entity.productos;
import pruebatecnica.services.productosService;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class productosController {

    private final productosService psi;

    public productosController(productosService psi) {
        this.psi = psi;
    }


    @GetMapping
    public List<productos> productosTodos() {
        return psi.getproductos();
    }

    @PostMapping
    public ResponseEntity<?> crearProductos(@RequestBody productos p) {
        try {
            return ResponseEntity.ok(psi.crearProductos(p));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @GetMapping("/id/{id}")
    public ResponseEntity<?> productosPorId(@PathVariable long id) {
        productos p = psi.productosPorId(id);
        if (p == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ESTE PRODUCTO NO SE ENCUENTRA EN LA BASE DE DATOS");
        }
        return ResponseEntity.ok(p);
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> productosPorNombre(@PathVariable String nombre) {
        productos p = psi.productosPorNombre(nombre);
        if (p == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ESTE PRODUCTO NO SE ENCUENTRA EN LA BASE DE DATOS");
        }
        return ResponseEntity.ok(p);
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<?> productosPorCodigo(@PathVariable String codigo) {
        productos p = psi.productosPorCodigo(codigo);
        if (p == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ESTE PRODUCTO NO SE ENCUENTRA EN LA BASE DE DATOS");
        }
        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProductoPorId(@PathVariable long id) {
        productos p = psi.eliminarProductoPorId(id);
        if (p == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ESTE PRODUCTO NO SE ENCUENTRA EN LA BASE DE DATOS");
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("ESTE PRODUCTO SE ELIMINO: " + p.getNombre());
    }



    @PutMapping("/{id}")
    public ResponseEntity<?> editarProducto(@PathVariable long id, @RequestBody productos p) {
        productos pd = psi.editarProducto(id, p);
        if (pd == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ESTE PRODUCTO NO SE ENCUENTRA EN LA BASE DE DATOS");
        }
        return ResponseEntity.ok(pd);

    }


}
