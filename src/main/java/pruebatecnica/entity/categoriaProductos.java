package pruebatecnica.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "categoriaProductos")
public class categoriaProductos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    int idCategoria;
    String codigo;
    String nombre;
    String descripcion;
    Boolean activo;


}
