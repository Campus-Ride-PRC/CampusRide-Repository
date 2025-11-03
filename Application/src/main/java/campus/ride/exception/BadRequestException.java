package campus.ride.exception;

public class BadRequestException extends BusinessException {
    public BadRequestException(String message) {
        super(message, 400);
    }
}
