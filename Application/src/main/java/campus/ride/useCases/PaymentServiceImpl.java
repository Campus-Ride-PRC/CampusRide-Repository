package campus.ride.useCases;

import campus.ride.interfaces.PaymentService;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
    // Current requirement doesn't specify standalone payment operations
    // Payment creation happens during booking
}
