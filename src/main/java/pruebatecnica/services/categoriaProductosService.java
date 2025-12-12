package pruebatecnica.services;

import pruebatecnica.entity.categoriaProductos;

import java.util.List;

public interface categoriaProductosService {

    List<categoriaProductos> getCategorias();

    categoriaProductos crearCategoria(categoriaProductos cat);

    categoriaProductos categoriaPorId(Long id);

    categoriaProductos editarCategoria(Long id, categoriaProductos modificacion);

    categoriaProductos eliminarCategoria(Long id);
}
