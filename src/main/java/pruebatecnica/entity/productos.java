package pruebatecnica.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class productos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;
    String codigo;
    String nombre;
    String descripcion;
    String marca;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private categoriaProductos categoria;

    float precio;


}
