package pruebatecnica.services;

import pruebatecnica.entity.productos;

import java.util.List;

public interface productosService {

    List<productos> getproductos();

    boolean codigoExiste(String codigo);

    boolean nombreExiste(String nombre);

    productos crearProductos(productos pd);

    productos productosPorId(long id);

    productos productosPorNombre(String nombre);

    productos productosPorCodigo(String codigo);

    productos eliminarProductoPorId(long id);

    productos editarProducto(long id, productos modificacion);

}
