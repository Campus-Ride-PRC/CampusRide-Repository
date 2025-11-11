# Booking System Implementation

## Overview
This document describes the booking system implementation for the Campus Ride application.

## Database Schema

### Bookings Table
- **Primary Key**: Composite key (driveId, userId)
- **Foreign Keys**:
  - `driveId` -> drives.id
  - `userId` -> users.id
- **Columns**:
  - `status`: ENUM(PENDING, ACCEPTED, DECLINED, DONE)
  - `role`: ENUM(CLIENT, DRIVER)
  - `requestedAt`: TIMESTAMP (required)
  - `updatedAt`: TIMESTAMP (required)

## Implementation Details

### 1. Domain Layer

#### Entities Created:
- **Booking** (`Domain/src/main/java/campus/ride/entities/Booking.java`)
  - Uses `@IdClass` with `BookingId` for composite primary key
  - Relationships to Drive and User entities
  
- **BookingId** (`Domain/src/main/java/campus/ride/entities/BookingId.java`)
  - Composite key class implementing Serializable
  - Contains driveId and userId

#### Enums Created:
- **BookingStatus** (`Domain/src/main/java/campus/ride/enums/BookingStatus.java`)
  - Values: PENDING, ACCEPTED, DECLINED, DONE
  
- **BookingRole** (`Domain/src/main/java/campus/ride/enums/BookingRole.java`)
  - Values: CLIENT, DRIVER

#### Drive Entity Updates:
- Added `driver` relationship (ManyToOne to User)
- Added `vehicle` relationship (ManyToOne to Vehicle)
- Added `bookings` relationship (OneToMany to Booking)
- Added helper methods: `decrementAvailableSeats()` and `incrementAvailableSeats()`

### 2. Application Layer

#### DTOs Created:
- **BookingRequestDto** - For creating booking requests
- **BookingResponseDto** - For returning booking information (includes user details)
- **BookingUpdateDto** - For accepting/declining bookings

#### Repositories:
- **BookingRepository** - Contract interface for booking operations

#### Services:
- **BookingService** - Interface defining booking operations
- **BookingServiceImpl** - Implementation with business logic:
  - `requestRide()` - Creates PENDING booking for CLIENT
  - `acceptBooking()` - Changes status to ACCEPTED and decrements available seats
  - `declineBooking()` - Changes status to DECLINED
  - `getBookingsByDrive()` - Retrieves all bookings for a drive
  - `getBookingsByUser()` - Retrieves all bookings for a user
  - `getPendingBookingsByDrive()` - Retrieves pending bookings for a drive
  - `getBooking()` - Retrieves specific booking

#### DriveService Updates:
- Modified `addAsync()` to:
  - Accept driverId and vehicleId in DriveDto
  - Validate and link driver and vehicle
  - Automatically create driver booking with:
    - Status: ACCEPTED
    - Role: DRIVER
    - Timestamps: Set to current time

### 3. Infrastructure Layer

#### Repository Implementation:
- **BookingJPARepository** (`Infrastructure/src/main/java/campus/ride/repositories/booking/BookingJPARepository.java`)
  - Extends JpaRepository with BookingId as key type
  - Implements custom queries for finding by drive/user/status

#### Vehicle Repository Updates:
- Added `findByUserId()` method to retrieve vehicle by user

#### User Repository Updates:
- Added `findById()` method

### 4. API Layer

#### Controllers:
- **BookingController** (`API/src/main/java/campus/ride/api/controller/BookingController.java`)
  - Endpoints:
    - `POST /api/bookings/request` - Request a ride
    - `PUT /api/bookings/{driveId}/{userId}/accept` - Accept booking
    - `PUT /api/bookings/{driveId}/{userId}/decline` - Decline booking
    - `GET /api/bookings/drive/{driveId}` - Get all bookings for drive
    - `GET /api/bookings/user/{userId}` - Get all bookings for user
    - `GET /api/bookings/drive/{driveId}/pending` - Get pending bookings for drive
    - `GET /api/bookings/{driveId}/{userId}` - Get specific booking

#### Validators:
- **BookingValidator** - Validates booking requests

#### DriveController Updates:
- Updated to accept `userId` in DriveCreateRequest
- Sets both driverId and vehicleId when creating drive

## Usage Flow

### Creating a Drive:
1. Frontend sends DriveCreateRequest with:
   - Address information (from/to)
   - Price, time, seats
   - **userId** (driver ID - required)
   - Vehicle details (model, license plate, color)

2. Backend:
   - Creates/retrieves addresses
   - Creates/retrieves vehicle (linked to user)
   - Creates drive with driver and vehicle
   - **Automatically creates driver booking** with ACCEPTED status

### Requesting a Ride (Client):
1. Client sends POST to `/api/bookings/request` with:
   ```json
   {
     "driveId": 1,
     "userId": 2
   }
   ```

2. Backend validates:
   - Drive exists and has available seats
   - User exists
   - User is not the driver
   - Booking doesn't already exist

3. Creates booking with:
   - Status: PENDING
   - Role: CLIENT
   - Timestamps: Current time

### Accepting a Booking (Driver):
1. Driver sends PUT to `/api/bookings/{driveId}/{userId}/accept`

2. Backend:
   - Validates booking exists and is PENDING
   - Checks available seats
   - Updates status to ACCEPTED
   - **Decrements available seats by 1**
   - Updates timestamp

### Declining a Booking (Driver):
1. Driver sends PUT to `/api/bookings/{driveId}/{userId}/decline`

2. Backend:
   - Validates booking exists and is PENDING
   - Updates status to DECLINED
   - Updates timestamp
   - Does NOT change available seats

## Vehicle Handling

### If User Has Vehicle:
- Vehicle is retrieved from database
- Vehicle details can be pre-filled in form (frontend responsibility)

### If User Doesn't Have Vehicle:
- User provides vehicle details in DriveCreateRequest
- Vehicle is created and linked to user during drive creation
- Future drives can reuse this vehicle

## Important Notes

1. **Authentication**: Currently using userId as a required field in requests. When JWT authentication is implemented, userId should come from the authenticated token.

2. **Seat Management**: 
   - Available seats are decremented only when booking is ACCEPTED
   - Declining a booking does NOT change seat count
   - Driver booking is created with ACCEPTED status and does NOT affect seat count

3. **Composite Keys**: Bookings use composite primary key (driveId, userId) to ensure one booking per user per drive.

4. **Validation**: All API endpoints validate input and business rules before processing.

## API Examples

### Request a Ride
```bash
POST /api/bookings/request
Content-Type: application/json

{
  "driveId": 1,
  "userId": 2
}
```

### Accept Booking
```bash
PUT /api/bookings/1/2/accept
```

### Get Pending Bookings for Drive
```bash
GET /api/bookings/drive/1/pending
```

### Create Drive with Vehicle
```bash
POST /api/drives
Content-Type: application/json

{
  "userId": 1,
  "fromStreet": "Main St",
  "fromNumber": "123",
  "fromNeighborhood": "Downtown",
  "toStreet": "Campus Dr",
  "toNumber": "456",
  "toNeighborhood": "University",
  "price": 15.50,
  "day": "2025-11-15",
  "hour": "08:00",
  "availableSeats": 3,
  "totalNoSeats": 4,
  "vehicleModel": "Toyota Camry",
  "vehicleLicencePlate": "ABC123",
  "vehicleColor": "Blue"
}
```
