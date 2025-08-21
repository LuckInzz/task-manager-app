package com.tasks.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Lida com os erros de validação do @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // Lida com o erro de email duplicado
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<?> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
            new Date(), 
            ex.getMessage(), 
            request.getDescription(false)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }

    // Lida com o erro de "não encontrado"
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
            new Date(), 
            ex.getMessage(), 
            request.getDescription(false)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }
}