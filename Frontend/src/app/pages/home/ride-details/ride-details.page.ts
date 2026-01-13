/// <reference types="google.maps" />
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal, computed, HostListener } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DriveService } from 'src/app/core/services/drive.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AddressService } from 'src/app/core/services/address.service';
import { GoogleMapsService, ParsedAddress } from 'src/app/core/services/google-maps.service';
import { DriveDetails } from 'src/app/core/models/drive-details.model';
import { BookingRequest } from 'src/app/core/models/booking.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PaymentMethodService } from 'src/app/core/services/payment-method.service';
import { PaymentMethod } from 'src/app/core/models/payment-method.model';
import { PaymentService, CheckoutSessionRequest } from 'src/app/core/services/payment.service';
import { addIcons } from 'ionicons';
import { cashOutline, cardOutline, addCircleOutline } from 'ionicons/icons';

type FlowStep = 'details' | 'pickup' | 'confirmation';

interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  distance?: string;
}

interface ExistingPickupPoint {
  lat: number;
  lng: number;
  address: string;
  passengerCount: number;
  passengerNames: string[];
  passengers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  }>;
  status: 'PENDING' | 'ACCEPTED' | 'MIXED';
}

@Component({
  selector: 'app-ride-details',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ride-details.page.html',
  styleUrls: ['./ride-details.page.scss'],
})
export class RideDetailsPage implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('pickupInput', { static: false }) pickupInput!: ElementRef<HTMLInputElement>;

  driveId!: number;
  drive: DriveDetails | null = null;
  isDriverView: boolean = false;

  // Signals for reactive state
  readonly mapLoaded = signal(false);
  readonly mapError = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly requestingRide = signal(false);
  readonly routePolyline = signal<google.maps.LatLng[] | null>(null);
  readonly currentStep = signal<FlowStep>('details');
  readonly isGeocoding = signal(false);

  // Pickup point state
  readonly pickupAddress = signal<ParsedAddress | null>(null);
  readonly pickupLocation = signal<{ lat: number; lng: number } | null>(null);
  readonly existingPickupPoints = signal<ExistingPickupPoint[]>([]);

  // Booking state
  readonly userBooking = signal<any | null>(null);
  readonly isCurrentUserDriver = signal(false);
  readonly userPickupPoint = signal<ExistingPickupPoint | null>(null);

  // Search suggestions
  readonly pickupSuggestions = signal<PlaceSuggestion[]>([]);
  readonly showPickupSuggestions = signal(false);

  // Bottom sheet drag state
  readonly sheetHeight = signal(55);
  readonly isDragging = signal(false);
  readonly isExpanded = signal(false);

  // Payment Selection
  readonly selectedPaymentMethodId = signal<number | null>(null); // null means nothing selected yet
  readonly selectedPaymentType = signal<'CASH' | 'CARD' | null>(null); // Track selected payment type
  readonly availablePaymentMethods = signal<PaymentMethod[]>([]); // To be populated from API
  // Default to CASH if no payment types specified (for older rides)
  readonly acceptedDrivePaymentTypes = computed(() => {
    const types = this.drive?.acceptedPaymentTypes;
    return types && types.length > 0 ? types : ['CASH'];
  });

  // Computed signals
  readonly isPastRide = computed(() => {
    if (!this.drive) return false;
    const driveTime = new Date(this.drive.time);
    const now = new Date();
    return driveTime < now;
  });

  readonly canBookRide = computed(() =>
    this.pickupLocation() !== null &&
    this.drive !== null &&
    this.drive.availableSeats > 0 &&
    !this.isPastRide() &&
    !this.isCurrentUserDriver() &&
    !this.userBooking()
  );

  readonly showDetailsPanel = computed(() => this.currentStep() === 'details');
  readonly showPickupPanel = computed(() => this.currentStep() === 'pickup');
  readonly showConfirmationPanel = computed(() => this.currentStep() === 'confirmation');

  private map: google.maps.Map | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  private pickupMarker: google.maps.Marker | null = null;
  private startMarker: google.maps.Marker | null = null;
  private endMarker: google.maps.Marker | null = null;
  private existingPickupMarkers: google.maps.Marker[] = [];
  private currentInfoWindow: google.maps.InfoWindow | null = null;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  // Route coordinates for validation
  private routeStartLocation: google.maps.LatLngLiteral | null = null;
  private routeEndLocation: google.maps.LatLngLiteral | null = null;

  // Drag handling
  private dragStartY = 0;
  private dragStartHeight = 55;

  // Search subject for debouncing
  private pickupSearch$ = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private driveService: DriveService,
    private bookingService: BookingService,
    private authService: AuthService,
    private addressService: AddressService,
    private mapsService: GoogleMapsService,
    private toastController: ToastController,
    private alertController: AlertController,
    private paymentMethodService: PaymentMethodService,
    private paymentService: PaymentService
  ) {
    addIcons({ cashOutline, cardOutline, addCircleOutline });
    this.setupSearchSubscription();
  }


  private loadPaymentMethods() {
    this.paymentMethodService.getMyPaymentMethods().subscribe({
      next: (methods) => {
        this.availablePaymentMethods.set(methods);
        // Pre-select Default if applicable for this ride (e.g. if CARD is accepted and user has default card)
      },
      error: (err) => console.error('Error loading payment methods', err)
    });
  }

  onPaymentMethodSelect(methodId: number | 'CASH') {
    if (typeof methodId === 'number') {
      this.selectedPaymentMethodId.set(methodId);
    } else {
      // Handle CASH selection (maybe use -1 or null to represent cash if backend supports it, 
      // but BookingRequest expects paymentMethodId. 
      // If CASH is handled as a payment method in DB, we need its ID? 
      // OR if backend handles null paymentMethodId as CASH?
      // Looking at BookingLogic: "paymentMethodId" is optional in my updated model.
      this.selectedPaymentMethodId.set(null); // Assuming null = CASH or manual handling
    }
  }

  // Helper to check if a method type is accepted by the drive
  isPaymentTypeAccepted(type: 'CARD' | 'CASH'): boolean {
    return this.acceptedDrivePaymentTypes().includes(type);
  }

  // Method to select payment type (Cash or Card)
  selectPaymentType(type: 'CASH' | 'CARD') {
    this.selectedPaymentType.set(type);
  }

  // Method to select a payment method by clicking on the entire row
  selectPaymentMethod(methodId: number | 'CASH') {
    this.onPaymentMethodSelect(methodId);
  }

  // Navigate to payment methods page with return URL including current step
  navigateToPaymentMethods() {
    const currentStepValue = this.currentStep();
    this.router.navigate(['/payment-methods'], {
      queryParams: { returnUrl: `/ride-details/${this.driveId}?step=${currentStepValue}` }
    });
  }

  // Proceed to Stripe checkout for card payment
  async proceedToStripeCheckout() {
    if (!this.pickupLocation() || !this.pickupAddress()) {
      this.showToast('Please select a pickup location', 'warning');
      return;
    }

    this.requestingRide.set(true);

    const addr = this.pickupAddress();
    if (!addr) {
      this.requestingRide.set(false);
      this.showToast('Pickup location missing', 'danger');
      return;
    }

    // First, save the pickup address to get its ID
    this.addressService.getOrCreate(addr).subscribe({
      next: (addressDto: any) => {
        this.createStripeCheckoutSession(addressDto.id);
      },
      error: (err) => {
        console.error('Failed to save pickup address:', err);
        this.requestingRide.set(false);
        this.showToast('Failed to process pickup address', 'danger');
      }
    });
  }

  private createStripeCheckoutSession(pickupAddressId: number) {
    const baseUrl = window.location.origin;
    
    const request: CheckoutSessionRequest = {
      driveId: this.driveId,
      pickupAddressId: pickupAddressId,
      successUrl: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&drive_id=${this.driveId}`,
      cancelUrl: `${baseUrl}/ride-details/${this.driveId}?step=confirmation&payment=cancelled`
    };

    this.paymentService.createCheckoutSession(request).subscribe({
      next: (response) => {
        // Redirect to Stripe Checkout
        this.paymentService.redirectToCheckout(response.checkoutUrl);
      },
      error: (error) => {
        console.error('Error creating checkout session:', error);
        this.showToast(error.error?.message || 'Failed to proceed to checkout', 'danger');
        this.requestingRide.set(false);
      }
    });
  }

  async confirmBooking() {
    const acceptedTypes = this.acceptedDrivePaymentTypes();
    const needsPaymentSelection = acceptedTypes.length > 0;

    if (acceptedTypes.includes('CARD') && !acceptedTypes.includes('CASH') && !this.selectedPaymentMethodId()) {
      this.showToast('Please select a payment method', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm Booking',
      message: 'Are you sure you want to book this ride?',
      cssClass: 'booking-confirm-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.requestingRide.set(true);

            const request: BookingRequest = {
              driveId: this.driveId,
              pickupAddressId: -1, 
              paymentMethodId: this.selectedPaymentMethodId() || undefined
            };

            this.handleBookingWithAddress(request);
          }
        }
      ]
    });
    await alert.present();
  }

  private handleBookingWithAddress(request: BookingRequest) {
    const addr = this.pickupAddress();
    if (!addr) {
      this.requestingRide.set(false);
      this.showToast('Pickup location missing', 'danger');
      return;
    }

    this.addressService.getOrCreate(addr).subscribe({
      next: (addressDto: any) => {
        request.pickupAddressId = addressDto.id;
        this.sendBookingRequest(request);
      },
      error: () => {
        this.requestingRide.set(false);
        this.showToast('Failed to process pickup address', 'danger');
      }
    });
  }

  private sendBookingRequest(request: BookingRequest) {
    this.bookingService.requestRide(request).subscribe({
      next: () => {
        this.showToast('Booking request sent successfully!', 'success');
        this.requestingRide.set(false);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Booking error:', error);
        this.showToast('Failed to book ride', 'danger');
        this.requestingRide.set(false);
      }
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.driveId = parseInt(id, 10);

      // Check if this is driver view based on query parameter
      const driverMode = this.route.snapshot.queryParamMap.get('driverMode');
      this.isDriverView = driverMode === 'true';

      // Check for step query parameter (used when returning from payment-methods)
      const step = this.route.snapshot.queryParamMap.get('step') as FlowStep | null;
      if (step && ['details', 'pickup', 'confirmation'].includes(step)) {
        this.currentStep.set(step);
      }

      this.loadDriveDetails();
    } else {
      this.error.set('Invalid drive ID');
    }
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      if (this.drive) {
        this.initializeMap();
      }
    }, 500);
  }

  ngOnDestroy() {
    this.cleanupMap();
    this.pickupSearch$.complete();
  }

  private setupSearchSubscription() {
    this.pickupSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length >= 2) {
        this.searchPlaces(query);
      } else {
        this.pickupSuggestions.set([]);
        this.showPickupSuggestions.set(false);
      }
    });
  }

  private async searchPlaces(query: string) {
    if (!this.autocompleteService) return;

    const request: google.maps.places.AutocompletionRequest = {
      input: query,
      componentRestrictions: { country: 'ro' },
      types: ['geocode', 'establishment']
    };

    this.autocompleteService.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        const suggestions: PlaceSuggestion[] = predictions.slice(0, 5).map(p => ({
          placeId: p.place_id,
          mainText: p.structured_formatting.main_text,
          secondaryText: p.structured_formatting.secondary_text || '',
          distance: p.distance_meters ? `${(p.distance_meters / 1000).toFixed(1)} km` : undefined
        }));

        this.pickupSuggestions.set(suggestions);
        this.showPickupSuggestions.set(true);
      }
    });
  }

  onPickupInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pickupSearch$.next(input.value);
  }

  async selectSuggestion(suggestion: PlaceSuggestion) {
    if (!this.placesService) return;

    this.isGeocoding.set(true);
    this.showPickupSuggestions.set(false);

    try {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: suggestion.placeId,
        fields: ['geometry', 'formatted_address', 'address_components', 'name']
      };

      this.placesService.getDetails(request, async (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          // Validate and snap to route
          await this.validateAndSnapToRoute({ lat, lng }, suggestion.mainText);
        }
        this.isGeocoding.set(false);
      });
    } catch (error) {
      console.error('Error selecting suggestion:', error);
      this.isGeocoding.set(false);
      this.showToast('Failed to get location details', 'danger');
    }
  }

  private async validateAndSnapToRoute(location: { lat: number; lng: number }, addressName: string) {
    const polyline = this.routePolyline();
    if (!polyline || polyline.length === 0) {
      this.showToast('Route not loaded yet', 'warning');
      return;
    }

    // Snap to nearest point on route with larger tolerance for address search
    const snapResult = this.mapsService.findNearestPointOnPolyline(
      location,
      polyline,
      500 // 500 meters tolerance for address search
    );

    if (snapResult.snapped) {
      const snappedLocation = { lat: snapResult.lat, lng: snapResult.lng };

      // Update pickup location
      this.pickupLocation.set(snappedLocation);

      // Create parsed address
      const parsedAddress: ParsedAddress = {
        street: addressName,
        number: '',
        neighborhood: '',
        city: '',
        locationName: addressName,
        latitude: snapResult.lat,
        longitude: snapResult.lng
      };
      this.pickupAddress.set(parsedAddress);

      // Update input value
      if (this.pickupInput?.nativeElement) {
        this.pickupInput.nativeElement.value = addressName;
      }

      // Update marker
      await this.updatePickupMarker(snappedLocation);

      this.showToast('Pickup point set on route', 'success');
    } else {
      this.showToast('This location is too far from the route. Please select a point closer to the route.', 'warning');
    }
  }

  loadDriveDetails() {
    this.loading.set(true);
    this.error.set(null);

    this.driveService.getDriveById(this.driveId).subscribe({
      next: (response) => {
        this.drive = response;
        this.loading.set(false);

        // Check if current user is the driver
        let currentUserId = this.authService.getCurrentUserId();

        // Check if userId was passed via query params (from my-bookings)
        const userIdFromQuery = this.route.snapshot.queryParamMap.get('userId');
        if (userIdFromQuery) {
          currentUserId = parseInt(userIdFromQuery, 10);
        }

        if (currentUserId) {
          const isDriver = response.driverId === currentUserId;
          this.isCurrentUserDriver.set(isDriver);

          // Only check for user booking if user is not the driver
          if (!isDriver) {
            this.checkUserBooking(currentUserId);
          }
        }

        // Mock existing pickup points (replace with actual API call)
        this.loadExistingPickupPoints();

        if (this.mapContainer) {
          this.initializeMap();
        }

        // Load User's payment methods if they are not the driver and haven't booked yet
        if (!this.isCurrentUserDriver() && !this.userBooking()) {
          this.loadPaymentMethods();
        }
      },
      error: (error) => {
        console.error('Error loading drive details:', error);
        this.error.set('Failed to load drive details');
        this.loading.set(false);
      }
    });
  }

  private loadExistingPickupPoints() {
    // Fetch bookings for this drive to show pickup points
    this.bookingService.getBookingsByDrive(this.driveId).subscribe({
      next: (bookings) => {
        // Group bookings by pickup location
        const locationMap = new Map<string, ExistingPickupPoint>();

        // For driver view, show both PENDING and ACCEPTED bookings
        // For passenger view, show only ACCEPTED bookings
        const filteredBookings = this.isDriverView
          ? bookings.filter(b =>
            (b.status === 'ACCEPTED' || b.status === 'PENDING') &&
            b.pickupAddress?.latitude &&
            b.pickupAddress?.longitude
          )
          : bookings.filter(b =>
            b.status === 'ACCEPTED' &&
            b.pickupAddress?.latitude &&
            b.pickupAddress?.longitude
          );

        filteredBookings.forEach(booking => {
          const key = `${booking.pickupAddress!.latitude},${booking.pickupAddress!.longitude}`;
          const existing = locationMap.get(key);

          const passengerInfo = {
            firstName: booking.userFirstName,
            lastName: booking.userLastName,
            email: booking.userEmail,
            status: booking.status
          };

          if (existing) {
            existing.passengerCount++;
            existing.passengerNames.push(`${booking.userFirstName} ${booking.userLastName.charAt(0)}.`);
            existing.passengers.push(passengerInfo);

            // Update status: if any booking is PENDING, mark as MIXED (if already has ACCEPTED) or PENDING
            if (booking.status === 'PENDING' && existing.status === 'ACCEPTED') {
              existing.status = 'MIXED';
            } else if (booking.status === 'ACCEPTED' && existing.status === 'PENDING') {
              existing.status = 'MIXED';
            }
          } else {
            locationMap.set(key, {
              lat: booking.pickupAddress!.latitude,
              lng: booking.pickupAddress!.longitude,
              address: booking.pickupAddress!.locationName || booking.pickupAddress!.street || 'Pickup location',
              passengerCount: 1,
              passengerNames: [`${booking.userFirstName} ${booking.userLastName.charAt(0)}.`],
              passengers: [passengerInfo],
              status: booking.status as 'PENDING' | 'ACCEPTED'
            });
          }
        });

        this.existingPickupPoints.set(Array.from(locationMap.values()));
        this.displayExistingPickupMarkers();
      },
      error: (error) => {
        console.error('Error loading pickup points:', error);
        this.existingPickupPoints.set([]);
      }
    });
  }

  private async initializeMap() {
    if (!this.drive || !this.mapContainer) {
      return;
    }

    try {
      await this.mapsService.waitForGoogleMaps(15000);

      const center = { lat: 46.772962, lng: 23.597231 }; // Cluj default
      this.map = await this.mapsService.createMap(this.mapContainer.nativeElement, {
        center,
        zoom: 12,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
        ]
      });

      // Initialize Places services
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.map);

      // Add click listener for pickup point selection (only active in pickup step)
      // Also close info window when clicking on map
      this.map.addListener('click', (event: any) => {
        // Close any open info window when clicking on the map
        if (this.currentInfoWindow) {
          this.currentInfoWindow.close();
          this.currentInfoWindow = null;
        }

        if (this.currentStep() === 'pickup') {
          this.onMapClick(event);
        }
      });

      await this.displayRoute();
      this.mapLoaded.set(true);
      this.mapError.set(null);

    } catch (error: any) {
      console.error('Error initializing map:', error);
      this.mapError.set('Failed to load map. Please refresh.');
      this.showToast('Map initialization failed', 'danger');
    }
  }

  private async displayRoute() {
    if (!this.drive || !this.map) {
      return;
    }

    try {
      const fromAddress = `${this.drive.fromAddress.street} ${this.drive.fromAddress.number}, ${this.drive.fromAddress.neighborhood}, ${this.drive.fromAddress.city}, ${this.drive.fromAddress.locationName}, Romania`;
      const toAddress = `${this.drive.toAddress.street} ${this.drive.toAddress.number}, ${this.drive.toAddress.neighborhood}, ${this.drive.toAddress.city}, ${this.drive.toAddress.locationName}, Romania`;

      const fromResult = await this.mapsService.geocodeAddress(fromAddress);
      const toResult = await this.mapsService.geocodeAddress(toAddress);

      if (!fromResult || !toResult) {
        this.showToast('Could not load route locations', 'warning');
        return;
      }

      const fromLocation = fromResult.geometry.location;
      const toLocation = toResult.geometry.location;

      const origin: google.maps.LatLngLiteral = {
        lat: (typeof fromLocation.lat === 'function' ? fromLocation.lat() : fromLocation.lat) as number,
        lng: (typeof fromLocation.lng === 'function' ? fromLocation.lng() : fromLocation.lng) as number
      };

      const destination: google.maps.LatLngLiteral = {
        lat: (typeof toLocation.lat === 'function' ? toLocation.lat() : toLocation.lat) as number,
        lng: (typeof toLocation.lng === 'function' ? toLocation.lng() : toLocation.lng) as number
      };

      // Store route endpoints
      this.routeStartLocation = origin;
      this.routeEndLocation = destination;

      // Create DirectionsRenderer with custom styling
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true, // We'll create our own markers
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });

      // Display the route
      const directionsResult = await this.mapsService.displayRoute(
        this.map,
        origin,
        destination,
        this.directionsRenderer ?? undefined
      );

      // Extract polyline for snapping
      const polyline = this.mapsService.getPolylineFromDirections(directionsResult);
      this.routePolyline.set(polyline);

      // Create custom start and end markers
      await this.createRouteMarkers(origin, destination);

      // Add existing pickup point markers
      await this.displayExistingPickupMarkers();

    } catch (error) {
      console.error('Error displaying route:', error);
      this.showToast('Could not display route', 'warning');
    }
  }

  private async createRouteMarkers(origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) {
    if (!this.map) return;

    // Start marker with "A" label
    this.startMarker = await this.mapsService.createMarker(this.map, origin, {
      title: 'Pickup (A)',
      label: { text: 'A', color: '#FFFFFF', fontWeight: 'bold' },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#1a1a1a',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      }
    });

    // End marker with "B" label - using CIRCLE shape to properly display label
    this.endMarker = await this.mapsService.createMarker(this.map, destination, {
      title: 'Destination (B)',
      label: { text: 'B', color: '#FFFFFF', fontWeight: 'bold' },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#1a1a1a',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      }
    });
  }

  private async displayExistingPickupMarkers() {
    if (!this.map) return;

    // Clear existing markers
    this.existingPickupMarkers.forEach(marker => marker.setMap(null));
    this.existingPickupMarkers = [];

    let pickupPoints = [...this.existingPickupPoints()];

    // Add user's pickup point if it exists and not already in the list
    const userPickup = this.userPickupPoint();
    if (userPickup) {
      const existingIndex = pickupPoints.findIndex(p =>
        Math.abs(p.lat - userPickup.lat) < 0.0001 &&
        Math.abs(p.lng - userPickup.lng) < 0.0001
      );

      if (existingIndex === -1) {
        // Add user's pickup point to the list
        pickupPoints.push(userPickup);
      }
    }

    for (const point of pickupPoints) {
      // Check if this is the user's pickup point
      const isUserPickup = userPickup &&
        Math.abs(point.lat - userPickup.lat) < 0.0001 &&
        Math.abs(point.lng - userPickup.lng) < 0.0001;

      // Determine marker color based on status
      let markerColor: string;
      let statusLabel: string;
      let markerScale: number = 12;

      if (isUserPickup) {
        // Highlight user's pickup point with purple and larger size
        markerColor = '#8B5CF6'; // Purple
        statusLabel = 'Your Pickup';
        markerScale = 16; // Larger marker
      } else if (this.isDriverView) {
        // For driver view: Green for ACCEPTED, Orange for PENDING
        if (point.status === 'ACCEPTED') {
          markerColor = '#10B981'; // Green
          statusLabel = 'Accepted';
        } else if (point.status === 'PENDING') {
          markerColor = '#F59E0B'; // Orange
          statusLabel = 'Pending';
        } else {
          markerColor = '#8B5CF6'; // Purple for mixed
          statusLabel = 'Mixed';
        }
      } else {
        // For passenger view: always orange/amber for existing pickups
        markerColor = '#F59E0B';
        statusLabel = 'Pickup';
      }

      const marker = await this.mapsService.createMarker(this.map, { lat: point.lat, lng: point.lng }, {
        title: `${point.passengerCount} passenger(s) - ${statusLabel}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: markerScale,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: isUserPickup ? '#ffffff' : '#ffffff',
          strokeWeight: isUserPickup ? 4 : 3
        },
        label: {
          text: isUserPickup ? '★' : point.passengerCount.toString(),
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: isUserPickup ? '16px' : '12px',
          fontFamily: isUserPickup ? 'Arial, sans-serif' : undefined
        },
        zIndex: isUserPickup ? 1000 : undefined
      });

      // Add click listener
      if (this.isDriverView) {
        // For driver: show passenger info in info window
        marker.addListener('click', () => {
          this.showPassengerInfo(marker, point);
        });
      } else if (!isUserPickup) {
        // For passenger: select this pickup point (but not for user's own pickup)
        marker.addListener('click', () => {
          this.selectExistingPickupPoint(point);
        });
      }

      this.existingPickupMarkers.push(marker);
    }
  }

  private showPassengerInfo(marker: google.maps.Marker, point: ExistingPickupPoint) {
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }

    let content = `
      <div style="padding: 8px; max-width: 240px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">
          Pickup Location
        </h3>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
          <strong>📍 ${point.address}</strong>
        </p>
        <div style="border-top: 1px solid #e5e5e5; padding-top: 8px;">
          <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #1a1a1a;">
            Passengers (${point.passengerCount})
          </h4>
    `;

    point.passengers.forEach((passenger, index) => {
      const statusColor = passenger.status === 'ACCEPTED' ? '#10B981' : '#F59E0B';
      const statusEmoji = passenger.status === 'ACCEPTED' ? '✓' : '⏳';
      const isPending = passenger.status === 'PENDING';

      content += `
        <div style="margin-bottom: ${index < point.passengers.length - 1 ? '6px' : '0'}; padding: 6px; background: #f9f9f9; border-radius: 4px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="flex: 1;">
                <div style="font-size: 13px; font-weight: 500; color: #1a1a1a; margin-bottom: 2px;">
                  ${passenger.firstName} ${passenger.lastName}
                </div>
                <div style="font-size: 11px; color: #666;">
                  ${passenger.email}
                </div>
              </div>
              <div style="margin-left: 6px;">
                <span style="
                  display: inline-block;
                  padding: 3px 6px;
                  font-size: 10px;
                  font-weight: 600;
                  color: white;
                  background-color: ${statusColor};
                  border-radius: 10px;
                ">
                  ${statusEmoji} ${passenger.status}
                </span>
              </div>
            </div>
            ${isPending ? `
              <div style="display: flex; gap: 4px; padding-top: 4px;">
                <button 
                  class="accept-passenger-btn"
                  data-passenger-email="${passenger.email}"
                  style="
                    flex: 1;
                    padding: 5px 8px;
                    font-size: 11px;
                    font-weight: 600;
                    color: white;
                    background-color: #10B981;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.backgroundColor='#059669'"
                  onmouseout="this.style.backgroundColor='#10B981'"
                >
                  ✓ ACCEPTED
                </button>
                <button 
                  class="decline-passenger-btn"
                  data-passenger-email="${passenger.email}"
                  style="
                    flex: 1;
                    padding: 5px 8px;
                    font-size: 11px;
                    font-weight: 600;
                    color: white;
                    background-color: #EF4444;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.backgroundColor='#DC2626'"
                  onmouseout="this.style.backgroundColor='#EF4444'"
                >
                  ✕ Decline
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });

    content += `
        </div>
      </div>
    `;

    this.currentInfoWindow = new google.maps.InfoWindow({
      content: content
    });

    this.currentInfoWindow.open(this.map!, marker);

    google.maps.event.addListenerOnce(this.currentInfoWindow, 'domready', () => {
      document.querySelectorAll('.accept-passenger-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const email = (e.target as HTMLElement).getAttribute('data-passenger-email');
          const passenger = point.passengers.find(p => p.email === email);
          if (passenger) {
            this.handleAcceptPassenger(passenger);
          }
        });
      });

      document.querySelectorAll('.decline-passenger-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const email = (e.target as HTMLElement).getAttribute('data-passenger-email');
          const passenger = point.passengers.find(p => p.email === email);
          if (passenger) {
            this.handleDeclinePassenger(passenger);
          }
        });
      });
    });
  }

  private async handleAcceptPassenger(passenger: { firstName: string; lastName: string; email: string; status: string }) {
    if (!this.drive) return;

    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }

    this.bookingService.getBookingsByDrive(this.driveId).subscribe({
      next: (bookings) => {
        const booking = bookings.find(b => b.userEmail === passenger.email && b.status === 'PENDING');
        if (booking) {
          this.bookingService.acceptBooking(this.driveId, booking.userId).subscribe({
            next: async () => {
              await this.showToast(`Accepted ${passenger.firstName} ${passenger.lastName}`, 'success');
              this.loadExistingPickupPoints();
            },
            error: async (error) => {
              console.error('Error accepting booking:', error);
              await this.showToast('Failed to accept booking. Please try again.', 'danger');
            }
          });
        }
      },
      error: async (error) => {
        console.error('Error fetching bookings:', error);
        await this.showToast('Failed to process request', 'danger');
      }
    });
  }

  private async handleDeclinePassenger(passenger: { firstName: string; lastName: string; email: string; status: string }) {
    if (!this.drive) return;

    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
    }

    const alert = await this.alertController.create({
      header: 'Decline Booking',
      message: `Are you sure you want to decline ${passenger.firstName} ${passenger.lastName}'s booking request?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Decline',
          role: 'destructive',
          handler: () => {
            this.bookingService.getBookingsByDrive(this.driveId).subscribe({
              next: (bookings) => {
                const booking = bookings.find(b => b.userEmail === passenger.email && b.status === 'PENDING');
                if (booking) {
                  this.bookingService.declineBooking(this.driveId, booking.userId).subscribe({
                    next: async () => {
                      await this.showToast(`Declined ${passenger.firstName} ${passenger.lastName}`, 'success');
                      this.loadExistingPickupPoints();
                    },
                    error: async (error) => {
                      console.error('Error declining booking:', error);
                      await this.showToast('Failed to decline booking. Please try again.', 'danger');
                    }
                  });
                }
              },
              error: async (error) => {
                console.error('Error fetching bookings:', error);
                await this.showToast('Failed to process request', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  private async selectExistingPickupPoint(point: ExistingPickupPoint) {
    // Check if this is the user's own pickup point
    const userPickup = this.userPickupPoint();
    const isUserPickup = userPickup &&
      Math.abs(point.lat - userPickup.lat) < 0.0001 &&
      Math.abs(point.lng - userPickup.lng) < 0.0001;

    // Don't allow selecting user's own pickup point
    if (isUserPickup) {
      return;
    }

    this.pickupLocation.set({ lat: point.lat, lng: point.lng });

    const parsedAddress: ParsedAddress = {
      street: point.address,
      number: '',
      neighborhood: '',
      city: '',
      locationName: point.address,
      latitude: point.lat,
      longitude: point.lng
    };
    this.pickupAddress.set(parsedAddress);

    if (this.pickupInput?.nativeElement) {
      this.pickupInput.nativeElement.value = point.address;
    }

    await this.updatePickupMarker({ lat: point.lat, lng: point.lng });

    this.showToast(`Join ${point.passengerCount} other passenger(s) at this stop`, 'success');
  }

  private async onMapClick(event: any) {
    if (this.currentStep() !== 'pickup') return;

    const clickLatLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    const polyline = this.routePolyline();
    if (!polyline || polyline.length === 0) {
      this.showToast('Route not loaded yet', 'warning');
      return;
    }

    this.isGeocoding.set(true);

    try {
      // Snap the click to the nearest point on the route
      const snapResult = this.mapsService.findNearestPointOnPolyline(
        clickLatLng,
        polyline,
        150 // 150 meters tolerance for map click
      );

      if (snapResult.snapped) {
        const snappedLocation = { lat: snapResult.lat, lng: snapResult.lng };
        this.pickupLocation.set(snappedLocation);

        // Reverse geocode to get address with place name lookup
        const parsed = await this.mapsService.reverseGeocodeWithPlaceName(
          snapResult.lat,
          snapResult.lng,
          this.map || undefined
        );
        if (parsed) {
          this.pickupAddress.set(parsed);
          if (this.pickupInput?.nativeElement) {
            this.pickupInput.nativeElement.value = this.mapsService.formatAddress(parsed);
          }
        }

        await this.updatePickupMarker(snappedLocation);
        this.showToast('Pickup point selected', 'success');

      } else {
        this.showToast('Please click closer to the route', 'warning');
      }
    } catch (error) {
      console.error('Error handling map click:', error);
      this.showToast('Error selecting pickup point', 'danger');
    } finally {
      this.isGeocoding.set(false);
    }
  }

  private async updatePickupMarker(location: google.maps.LatLngLiteral) {
    if (!this.map) return;

    if (this.pickupMarker) {
      this.pickupMarker.setPosition(location);
    } else {
      this.pickupMarker = await this.mapsService.createMarker(this.map, location, {
        title: 'Your Pickup Point',
        draggable: true,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: '#8B5CF6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        },
        animation: google.maps.Animation.DROP
      });

      // Handle marker drag
      this.pickupMarker.addListener('dragend', async (event: any) => {
        const newLatLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };

        // Validate new position is on route
        const polyline = this.routePolyline();
        if (polyline) {
          const snapResult = this.mapsService.findNearestPointOnPolyline(newLatLng, polyline, 150);
          if (snapResult.snapped) {
            this.pickupLocation.set({ lat: snapResult.lat, lng: snapResult.lng });
            this.pickupMarker?.setPosition({ lat: snapResult.lat, lng: snapResult.lng });

            // Reverse geocode with place name lookup
            const parsed = await this.mapsService.reverseGeocodeWithPlaceName(
              snapResult.lat,
              snapResult.lng,
              this.map || undefined
            );
            if (parsed) {
              this.pickupAddress.set(parsed);
              if (this.pickupInput?.nativeElement) {
                this.pickupInput.nativeElement.value = this.mapsService.formatAddress(parsed);
              }
            }
          } else {
            // Reset to previous position
            const prevLoc = this.pickupLocation();
            if (prevLoc) {
              this.pickupMarker?.setPosition(prevLoc);
            }
            this.showToast('Please keep pickup point on the route', 'warning');
          }
        }
      });
    }

    // Center map on pickup point
    this.map.panTo(location);
  }

  // Bottom sheet drag handlers
  onDragStart(event: TouchEvent | MouseEvent) {
    this.isDragging.set(true);
    this.dragStartY = this.getEventY(event);
    this.dragStartHeight = this.sheetHeight();
    event.preventDefault();
  }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  onDragMove(event: TouchEvent | MouseEvent) {
    if (!this.isDragging()) return;

    const currentY = this.getEventY(event);
    const deltaY = this.dragStartY - currentY;
    const screenHeight = window.innerHeight;
    const deltaPercent = (deltaY / screenHeight) * 100;

    let newHeight = this.dragStartHeight + deltaPercent;
    newHeight = Math.max(35, Math.min(90, newHeight));

    this.sheetHeight.set(newHeight);
  }

  @HostListener('document:touchend')
  @HostListener('document:mouseup')
  onDragEnd() {
    if (!this.isDragging()) return;

    this.isDragging.set(false);

    const height = this.sheetHeight();
    if (height < 45) {
      this.sheetHeight.set(35);
      this.isExpanded.set(false);
    } else if (height < 70) {
      this.sheetHeight.set(55);
      this.isExpanded.set(false);
    } else {
      this.sheetHeight.set(90);
      this.isExpanded.set(true);
    }
  }

  private getEventY(event: TouchEvent | MouseEvent): number {
    if (event instanceof TouchEvent) {
      return event.touches[0]?.clientY || event.changedTouches[0]?.clientY || 0;
    }
    return event.clientY;
  }

  expandSheet() {
    this.sheetHeight.set(90);
    this.isExpanded.set(true);
  }

  collapseSheet() {
    this.sheetHeight.set(55);
    this.isExpanded.set(false);
  }

  // Navigation between steps
  proceedToPickup() {
    this.currentStep.set('pickup');
    this.sheetHeight.set(60);
  }

  backToDetails() {
    this.currentStep.set('details');
    this.sheetHeight.set(55);
    // Clear pickup selection
    this.pickupLocation.set(null);
    this.pickupAddress.set(null);
    if (this.pickupMarker) {
      this.pickupMarker.setMap(null);
      this.pickupMarker = null;
    }
    if (this.pickupInput?.nativeElement) {
      this.pickupInput.nativeElement.value = '';
    }
  }

  proceedToConfirmation() {
    if (this.canBookRide()) {
      this.currentStep.set('confirmation');
      this.sheetHeight.set(70);
    }
  }

  backToPickup() {
    this.currentStep.set('pickup');
    this.sheetHeight.set(60);
  }

  clearPickup() {
    this.pickupLocation.set(null);
    this.pickupAddress.set(null);
    this.pickupSuggestions.set([]);
    this.showPickupSuggestions.set(false);
    if (this.pickupInput?.nativeElement) {
      this.pickupInput.nativeElement.value = '';
    }
    if (this.pickupMarker) {
      this.pickupMarker.setMap(null);
      this.pickupMarker = null;
    }
  }

  onInputFocus() {
    this.expandSheet();
  }

  onInputBlur() {
    setTimeout(() => {
      this.showPickupSuggestions.set(false);
    }, 200);
  }

  // Helper methods
  getDriverName(): string {
    if (!this.drive) return '';
    return `${this.drive.driverFirstName} ${this.drive.driverLastName}`;
  }

  /**
   * Format the from/pickup location with street address and city/neighborhood
   * Format: location_name, Street Number, Neighborhood, City
   */
  getFromLocation(): string {
    if (!this.drive) return '';
    const addr = this.drive.fromAddress;

    // Build full address with all available fields
    const parts: string[] = [];

    // Add location name if available
    if (addr.locationName) {
      parts.push(addr.locationName);
    }

    // Add street and number
    if (addr.street) {
      const streetPart = addr.number ? `${addr.street} ${addr.number}` : addr.street;
      // Only add if different from locationName
      if (!addr.locationName || !addr.locationName.includes(addr.street)) {
        parts.push(streetPart);
      }
    }

    // Add neighborhood if available and not already included
    if (addr.neighborhood && !parts.some(p => p.includes(addr.neighborhood))) {
      parts.push(addr.neighborhood);
    }

    return parts.join(', ') || 'Unknown location';
  }

  /**
   * Format the destination location with street address and city/neighborhood
   * Format: location_name, Street Number, Neighborhood, City
   */
  getToLocation(): string {
    if (!this.drive) return '';
    const addr = this.drive.toAddress;

    // Build full address with all available fields
    const parts: string[] = [];

    // Add location name if available
    if (addr.locationName) {
      parts.push(addr.locationName);
    }

    // Add street and number
    if (addr.street) {
      const streetPart = addr.number ? `${addr.street} ${addr.number}` : addr.street;
      // Only add if different from locationName
      if (!addr.locationName || !addr.locationName.includes(addr.street)) {
        parts.push(streetPart);
      }
    }

    // Add neighborhood if available and not already included
    if (addr.neighborhood && !parts.some(p => p.includes(addr.neighborhood))) {
      parts.push(addr.neighborhood);
    }

    return parts.join(', ') || 'Unknown location';
  }

  /**
   * Format the pickup location with city context
   */
  getPickupLocation(): string {
    const addr = this.pickupAddress();
    if (!addr) return '';

    // Use the locationName or formatted address with city
    if (addr.locationName && addr.city && !addr.locationName.includes(addr.city)) {
      return `${addr.locationName}, ${addr.city}`;
    }
    return addr.locationName || this.mapsService.formatAddressWithCity(addr);
  }

  formatDepartureTime(): string {
    if (!this.drive) return '';

    const date = new Date(this.drive.time);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (isToday) {
      return `Today, ${timeStr}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${timeStr}`;
    } else {
      return `${date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })}, ${timeStr}`;
    }
  }

  formatPrice(): string {
    if (!this.drive) return '';
    return `${this.drive.price} RON`;
  }

  getEstimatedPickupTime(): string {
    // This would be calculated based on pickup position along the route
    // For now, return the departure time
    return this.formatDepartureTime();
  }


  private checkUserBooking(userId: number) {
    this.bookingService.getBooking(this.driveId, userId).subscribe({
      next: (booking) => {
        this.userBooking.set(booking);

        // If booking has pickup address, create a pickup point for it
        if (booking.pickupAddress) {
          const userPickup: ExistingPickupPoint = {
            lat: booking.pickupAddress.latitude,
            lng: booking.pickupAddress.longitude,
            address: booking.pickupAddress.locationName || booking.pickupAddress.street,
            passengerCount: 1,
            passengerNames: [`${booking.userFirstName} ${booking.userLastName}`],
            passengers: [{
              firstName: booking.userFirstName,
              lastName: booking.userLastName,
              email: booking.userEmail,
              status: booking.status
            }],
            status: booking.status === 'ACCEPTED' ? 'ACCEPTED' : booking.status === 'PENDING' ? 'PENDING' : 'MIXED'
          };
          this.userPickupPoint.set(userPickup);
        }
      },
      error: (error) => {
        // No booking found (404 is expected)
        if (error.status !== 404) {
          console.error('Error checking user booking:', error);
        }
      }
    });
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  goBack() {
    if (this.currentStep() === 'pickup') {
      this.backToDetails();
    } else if (this.currentStep() === 'confirmation') {
      this.backToPickup();
    } else {
      // Check if we should return to a specific page
      const returnTo = this.route.snapshot.queryParamMap.get('returnTo');
      if (returnTo === 'my-bookings') {
        this.router.navigate(['/my-bookings']);
      } else {
        this.location.back();
      }
    }
  }

  private cleanupMap() {
    if (this.currentInfoWindow) {
      this.currentInfoWindow.close();
      this.currentInfoWindow = null;
    }
    if (this.map) {
      this.mapsService.destroyMap(this.map);
      this.map = null;
    }
    this.directionsRenderer = null;
    this.pickupMarker = null;
    this.startMarker = null;
    this.endMarker = null;
    this.existingPickupMarkers.forEach(m => m.setMap(null));
    this.existingPickupMarkers = [];
  }
}
