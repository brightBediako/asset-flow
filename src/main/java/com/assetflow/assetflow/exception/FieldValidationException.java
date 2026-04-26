package com.assetflow.assetflow.exception;

import java.util.Map;

public class FieldValidationException extends RuntimeException {
    private final Map<String, String> details;

    public FieldValidationException(String message, Map<String, String> details) {
        super(message);
        this.details = details;
    }

    public Map<String, String> getDetails() {
        return details;
    }
}
