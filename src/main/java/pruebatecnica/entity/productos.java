package pruebatecnica.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class productos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;

    @NotBlank(message = "COLOQUE EL CODIGO")
    @Size(min = 4, max = 10, message = "EL CODIGO DEBE DE TENER ENTRE MINIMO Y MAXIMO 4-1O CARACTERES")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "NO SE ACEPTAN CARACTERES ESPECIALES")
    @Column(unique = true)
    private String codigo;

    @NotBlank(message = "COLOQUE EL NOMBRE")
    @Size(min = 4, message = "EL NOMBRE DEBE DE TENER MINIMO 4 CARACTERES")
    @Column(unique = true)
    private String nombre;

    @NotBlank(message = "COLOQUE LA DESCRIPCION")
    private String descripcion;

    @NotBlank(message = "COLOQUE LA MARCA")
    private String marca;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    @NotNull(message = "SELECCIONE UNA CATEGORIA")
    private categoriaProductos categoria;

    @Positive(message = "EL PRECIO DEBE SER MAYOR QUE O")
    private float precio;
}
