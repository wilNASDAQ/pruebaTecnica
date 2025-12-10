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

    @Column(unique = true)
    private String codigo;

    @Column(unique = true)
    private String nombre;

    private String descripcion;

    private Boolean activo;


}
