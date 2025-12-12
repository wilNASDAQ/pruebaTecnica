package pruebatecnica.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pruebatecnica.entity.categoriaProductos;
import pruebatecnica.repository.categoriaRepository;

import java.util.List;

@Service
public class categoriaProductosServiceImpl implements categoriaProductosService {

    @Autowired
    private categoriaRepository repo;

    public List<categoriaProductos> getCategorias() {
        return repo.findAll();
    }


    public categoriaProductos crearCategoria(categoriaProductos cat) {
        if (repo.findByCodigo(cat.getCodigo()).isPresent()) {
            throw new IllegalArgumentException("EL CÓDIGO YA EXISTE");
        }
        if (repo.findByNombre(cat.getNombre()).isPresent()) {
            throw new IllegalArgumentException("EL NOMBRE YA EXISTE");
        }
        return repo.save(cat);

    }

    public categoriaProductos categoriaPorId(Long id) {
        return repo.findById(id).orElse(null);
    }

    public categoriaProductos editarCategoria(Long id, categoriaProductos modificacion) {
        categoriaProductos cat = categoriaPorId(id);

        repo.findByCodigo(modificacion.getCodigo()).filter(p -> p.getIdCategoria() != id)
                .ifPresent(p -> {
                    throw new IllegalArgumentException("EL CÓDIGO YA EXISTE");
                });

        repo.findByNombre(modificacion.getNombre()).filter(p -> p.getIdCategoria() != id)
                .ifPresent(p -> {
                    throw new IllegalArgumentException("EL NOMBRE YA EXISTE");
                });

        cat.setCodigo(modificacion.getCodigo());
        cat.setNombre(modificacion.getNombre());
        cat.setDescripcion(modificacion.getDescripcion());
        cat.setActivo(modificacion.getActivo());
        return repo.save(cat);

    }

    public categoriaProductos eliminarCategoria(Long id) {
        categoriaProductos cat = categoriaPorId(id);
        if (cat != null) {
            repo.delete(cat);
            return cat;
        }
        return null;
    }
}
