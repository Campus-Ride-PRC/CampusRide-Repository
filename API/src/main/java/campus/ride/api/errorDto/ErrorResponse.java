package campus.ride.api.errorDto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ErrorResponse", description = "Standard error payload returned by the API when an exception occurs")
public class ErrorResponse {
    @Schema(description = "Timestamp when the error occurred", example = "2025-11-02T12:19:29.166")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime timestamp;

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "HTTP reason phrase", example = "Bad Request")
    private String error;

    @Schema(description = "Human readable error message", example = "Invalid value 'abc' for parameter 'id'")
    private String message;

    @Schema(description = "Request path that produced the error", example = "/api/v1/resource/abc")
    private String path;

    @ArraySchema(arraySchema = @Schema(description = "List of validation errors, present when validation fails"))
    private List<FieldValidationError> fieldErrors;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(int status, String error, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<FieldValidationError> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(List<FieldValidationError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }

    @Schema(name = "FieldValidationError", description = "Details about a single field validation error")
    public static class FieldValidationError {
        @Schema(description = "The field that failed validation", example = "hour")
        private String field;

        @Schema(description = "Associated validation message", example = "must not be null")
        private String message;

        public FieldValidationError() {}

        public FieldValidationError(String field, String message) {
            this.field = field;
            this.message = message;
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
