package pruebatecnica.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "categoriaProductos")
public class categoriaProductos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCategoria;

    @NotBlank(message = "COLOQUE EL CODIGO")
    @Size(min = 2, max = 10, message = "EL CODIGO DEBE TENER ENTRE 2 Y 10 CARACTERES")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "NO SE ACEPTAN CARACTERES ESPECIALES NI ESPACIOS")
    @Column(unique = true)
    private String codigo;


    @NotBlank(message = "COLOQUE EL NOMBRE")
    @Size(min = 2, message = "EL NOMBRE DEBE DE TENER MINIMO 2 CARACTERES")
    @Column(unique = true)
    private String nombre;

    @NotBlank(message = "COLOQUE LA DESCRIPCION")
    private String descripcion;

    @NotNull(message = "MARQUE SI ESTA ACTIVO")
    private Boolean activo;

}
