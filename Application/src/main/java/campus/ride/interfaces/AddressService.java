package campus.ride.interfaces;

import campus.ride.Address;

import java.util.concurrent.CompletableFuture;

public interface AddressService {
    CompletableFuture<Address> getOrCreate(String street, String number, String neighborhood, String locationName);
}