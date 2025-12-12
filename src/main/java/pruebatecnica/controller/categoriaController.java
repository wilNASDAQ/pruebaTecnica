package pruebatecnica.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pruebatecnica.entity.categoriaProductos;
import pruebatecnica.services.categoriaProductosService;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class categoriaController {

    private final categoriaProductosService cps;

    public categoriaController(categoriaProductosService cps) {
        this.cps = cps;
    }


    @GetMapping
    public List<categoriaProductos> todasCategorias() {
        return cps.getCategorias();
    }

    @PostMapping
    public ResponseEntity<?> crearCategoria(@Valid @RequestBody categoriaProductos cat) {
        return ResponseEntity.ok(cps.crearCategoria(cat));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> categoriaPorId(@PathVariable Long id) {
        categoriaProductos cat = cps.categoriaPorId(id);
        if (cat == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("CATEGORÍA NO ENCONTRADA");
        }
        return ResponseEntity.ok(cat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarCategoria(@PathVariable Long id, @Valid @RequestBody categoriaProductos cat) {
        categoriaProductos editada = cps.editarCategoria(id, cat);
        if (editada == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("CATEGORÍA NO ENCONTRADA");
        }
        return ResponseEntity.ok(editada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        categoriaProductos cat = cps.eliminarCategoria(id);
        if (cat == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("CATEGORÍA NO ENCONTRADA");
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("CATEGORÍA ELIMINADA: " + cat.getNombre());
    }
}
