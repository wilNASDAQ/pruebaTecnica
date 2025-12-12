package pruebatecnica.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pruebatecnica.entity.productos;
import pruebatecnica.repository.categoriaRepository;
import pruebatecnica.repository.productosRepository;

import java.util.List;

@Service
public class productosServiceImpl implements productosService {

    @Autowired
    private productosRepository repo;

    @Autowired
    private categoriaRepository categoriaRepo;

    public List<productos> getproductos() {
        return repo.findAll();
    }

    public productos crearProductos(productos pd) {
        if (pd.getCategoria() == null || categoriaRepo.findById(pd.getCategoria().getIdCategoria()).isEmpty()) {
            throw new IllegalArgumentException("LA CATEGORIA NO EXISTE");
        }
        if (repo.findByCodigo(pd.getCodigo()).isPresent()) {
            throw new IllegalArgumentException("EL CÓDIGO YA EXISTE");
        }
        if (repo.findByNombre(pd.getNombre()).isPresent()) {
            throw new IllegalArgumentException("EL NOMBRE YA EXISTE");
        }
        return repo.save(pd);
    }

    public productos productosPorId(long id) {
        return repo.findById(id).orElse(null);
    }

    public productos productosPorNombre(String nombre) {
        return repo.findByNombre(nombre).orElse(null);
    }

    public productos productosPorCodigo(String codigo) {
        return repo.findByCodigo(codigo).orElse(null);
    }

    public productos eliminarProductoPorId(long id) {
        productos pd = productosPorId(id);

        if (pd != null) {
            repo.delete(pd);
            return pd;
        }

        return null;
    }

    public productos editarProducto(long id, productos modificacion) {
        productos pd = productosPorId(id);

        repo.findByCodigo(modificacion.getCodigo()).filter(p -> p.getIdProducto() != id)
                .ifPresent(p -> {
                    throw new IllegalArgumentException("EL CÓDIGO YA EXISTE");
                });

        repo.findByNombre(modificacion.getNombre()).filter(p -> p.getIdProducto() != id)
                .ifPresent(p -> {
                    throw new IllegalArgumentException("EL NOMBRE YA EXISTE");
                });

        pd.setCodigo(modificacion.getCodigo());
        pd.setNombre(modificacion.getNombre());
        pd.setDescripcion(modificacion.getDescripcion());
        pd.setMarca(modificacion.getMarca());
        pd.setCategoria(modificacion.getCategoria());
        pd.setPrecio(modificacion.getPrecio());

        return repo.save(pd);
    }



}
