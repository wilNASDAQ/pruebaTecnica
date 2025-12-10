package pruebatecnica.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "categoriaProductos")
public class categoriaProductos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCategoria;

    private String codigo;
    private String nombre;
    private String descripcion;
    private Boolean activo;


}
