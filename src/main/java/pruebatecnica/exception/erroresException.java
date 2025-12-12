package pruebatecnica.exception; // asegúrate de corregir el paquete si lo escribiste "exeption"

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice
public class erroresException {

    // Captura errores de validación de @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> manejarErroresValidacion(MethodArgumentNotValidException ex) {
        FieldError fe = ex.getBindingResult().getFieldError();
        String msg = fe != null ? fe.getField() + ": " + fe.getDefaultMessage() : "Error de validación";
        return ResponseEntity.badRequest().body(msg);
    }

    // Captura IllegalArgumentException lanzadas desde services
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> manejarIllegalArgument(IllegalArgumentException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    // Captura RuntimeException no previstas
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> manejarRuntime(RuntimeException ex){
        return ResponseEntity.status(400).body(ex.getMessage());
    }

    // Captura cualquier otra excepción
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> manejarGenerico(Exception ex){
        return ResponseEntity.status(500).body("Error interno: " + ex.getMessage());
    }
}
