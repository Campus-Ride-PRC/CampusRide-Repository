package campus.ride.interfaces;

import java.util.concurrent.CompletableFuture;

import campus.ride.transfer.dtos.address.AddressDto;

public interface AddressService {
    CompletableFuture<AddressDto> getOrCreate(String street, String number, String neighborhood, String locationName, String city);
}