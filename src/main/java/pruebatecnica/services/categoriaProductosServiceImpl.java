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

    public boolean codigoExiste(String codigo) {
        return repo.findByCodigo(codigo).isPresent();
    }

    public boolean nombreExiste(String nombre) {
        return repo.findByNombre(nombre).isPresent();
    }

    public categoriaProductos crearCategoria(categoriaProductos cat) {
        if (codigoExiste(cat.getCodigo())) {
            throw new RuntimeException("ESE CÓDIGO YA EXISTE");
        }
        if (nombreExiste(cat.getNombre())) {
            throw new RuntimeException("ESE NOMBRE YA EXISTE");
        }
        return repo.save(cat);
    }

    public categoriaProductos categoriaPorId(Long id) {
        return repo.findById(id).orElse(null);
    }

    public categoriaProductos editarCategoria(Long id, categoriaProductos modificacion) {
        categoriaProductos cat = categoriaPorId(id);

        if (cat != null) {
            cat.setCodigo(modificacion.getCodigo());
            cat.setNombre(modificacion.getNombre());
            cat.setDescripcion(modificacion.getDescripcion());
            cat.setActivo(modificacion.getActivo());
            return repo.save(cat);
        }

        return null;
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
