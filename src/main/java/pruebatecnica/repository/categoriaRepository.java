package pruebatecnica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pruebatecnica.entity.categoriaProductos;

import java.util.Optional;

public interface categoriaRepository extends JpaRepository<categoriaProductos, Long> {

    Optional<categoriaProductos> findByCodigo(String codigo);

    Optional<categoriaProductos> findByNombre(String nombre);
}

