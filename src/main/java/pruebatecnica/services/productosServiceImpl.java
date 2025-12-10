package pruebatecnica.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pruebatecnica.entity.productos;
import pruebatecnica.repository.productosRepository;

import java.util.List;

@Service
public class productosServiceImpl implements productosService {

    @Autowired
    private productosRepository repo;

    public List<productos> getproductos() {
        return repo.findAll();
    }

    public boolean codigoExiste(String codigo) {
        return repo.findByCodigo(codigo).isPresent();
    }

    public boolean nombreExiste(String nombre) {
        return repo.findByNombre(nombre).isPresent();
    }

    public productos crearProductos(productos pd) {
        if (codigoExiste(pd.getCodigo())) {
            throw new RuntimeException("ESE CODIGO YA EXISTE");
        }
        if (nombreExiste(pd.getNombre())) {
            throw new RuntimeException("ESE NOMBRE YA EXISTE");
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

        if (pd != null) {

            pd.setCodigo(modificacion.getCodigo());
            pd.setNombre(modificacion.getNombre());
            pd.setDescripcion(modificacion.getDescripcion());
            pd.setMarca(modificacion.getMarca());
            pd.setCategoria(modificacion.getCategoria());
            pd.setPrecio(modificacion.getPrecio());

            return repo.save(pd);
        }
        return null;
    }


}
