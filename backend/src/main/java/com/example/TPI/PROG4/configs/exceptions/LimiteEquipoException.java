package com.example.TPI.PROG4.configs.exceptions;

import org.springframework.http.HttpStatus;

import java.util.List;

public class LimiteEquipoException extends CustomException {

    public LimiteEquipoException(String message) {
        super(message, HttpStatus.CONFLICT, List.of(message));
    }
}
