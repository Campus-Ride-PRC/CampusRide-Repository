package campus.ride.exception;

public class BusinessException extends RuntimeException {
    private final int statusCode;
    
    public BusinessException(String message) {
        super(message);
        this.statusCode = 500; // Default to internal server error
    }
    
    public BusinessException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
    }
    
    public BusinessException(String message, Throwable cause, int statusCode) {
        super(message, cause);
        this.statusCode = statusCode;
    }
    
    public int getStatusCode() {
        return statusCode;
    }
}
