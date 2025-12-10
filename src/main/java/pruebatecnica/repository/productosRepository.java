package pruebatecnica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pruebatecnica.entity.productos;

import java.util.Optional;

public interface productosRepository extends JpaRepository<productos, Long> {

    Optional<productos> findByCodigo(String codigo);
    Optional<productos> findByNombre(String nombre);



}
