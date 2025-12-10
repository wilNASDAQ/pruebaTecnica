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

    @Column(unique = true)
    private String codigo;

    @Column(unique = true)
    private String nombre;

    private String descripcion;

    @Column(name = "marca")
    private String marca;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private categoriaProductos categoria;

    float precio;


}
