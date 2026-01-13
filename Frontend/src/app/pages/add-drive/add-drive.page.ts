/// <reference types="google.maps" />
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, IonModal, ToastController, AlertController } from '@ionic/angular';
import { DriveService } from 'src/app/core/services/drive.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { GoogleMapsService, ParsedAddress } from 'src/app/core/services/google-maps.service';
import { DriveCreateRequest } from 'src/app/core/models/drive-create-request.model';
import { catchError, of, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';

type LocationMode = 'departure' | 'destination';
type FlowStep = 'location' | 'details';

interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  distance?: string;
}

import { CustomDatePickerComponent } from 'src/app/shared/components/date-picker/custom-date-picker.component';

@Component({
  selector: 'app-add-drive',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, CustomDatePickerComponent],
  templateUrl: './add-drive.page.html',
  styleUrls: ['./add-drive.page.scss']
})
export class AddDrivePage implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('departureInput', { static: false }) departureInput!: ElementRef<HTMLInputElement>;
  @ViewChild('destinationInput', { static: false }) destinationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('modal', { static: false }) modal!: IonModal;
  @ViewChild('bottomSheet', { static: false }) bottomSheet!: ElementRef<HTMLDivElement>;

  // Signals for reactive state
  readonly mapLoaded = signal(false);
  readonly mapError = signal<string | null>(null);
  readonly currentMode = signal<LocationMode>('departure');
  readonly departureAddress = signal<ParsedAddress | null>(null);
  readonly destinationAddress = signal<ParsedAddress | null>(null);
  readonly isSubmitting = signal(false);
  readonly currentStep = signal<FlowStep>('location');
  readonly currentBreakpoint = signal(0.6);
  readonly isGeocoding = signal(false);

  // Search suggestions
  readonly departureSuggestions = signal<PlaceSuggestion[]>([]);
  readonly destinationSuggestions = signal<PlaceSuggestion[]>([]);
  readonly showDepartureSuggestions = signal(false);
  readonly showDestinationSuggestions = signal(false);

  // Bottom sheet drag state
  readonly sheetHeight = signal(60); // percentage
  readonly isDragging = signal(false);
  readonly isExpanded = signal(false);

  // Computed signals
  readonly canProceedToDetails = computed(() =>
    this.departureAddress() !== null && this.destinationAddress() !== null
  );

  readonly showDetailsPanel = computed(() => this.currentStep() === 'details');

  driveForm!: FormGroup;
  userId: number | null = null;

  private map: google.maps.Map | null = null;
  private departureMarker: google.maps.Marker | null = null;
  private destinationMarker: google.maps.Marker | null = null;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;
  private isUpdatingFromMap = false;
  private isUpdatingFromInput = false;

  // Drag handling
  private dragStartY = 0;
  private dragStartHeight = 60;

  // Search subjects for debouncing
  private departureSearch$ = new Subject<string>();
  private destinationSearch$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private driveService: DriveService,
    private vehicleService: VehicleService,
    private authService: AuthService,
    private mapsService: GoogleMapsService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.initializeForm();
    this.setupSearchSubscriptions();
    addIcons({ calendarOutline });
  }

  async ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    if (this.userId) {
      this.loadUserVehicle(this.userId);
    }
  }

  async ngAfterViewInit() {
    await this.initializeMap();
  }

  ngOnDestroy() {
    this.cleanupMap();
    this.departureSearch$.complete();
    this.destinationSearch$.complete();
  }

  private setupSearchSubscriptions() {
    // Debounced departure search
    this.departureSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length >= 2) {
        this.searchPlaces(query, 'departure');
      } else {
        this.departureSuggestions.set([]);
        this.showDepartureSuggestions.set(false);
      }
    });

    // Debounced destination search
    this.destinationSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length >= 2) {
        this.searchPlaces(query, 'destination');
      } else {
        this.destinationSuggestions.set([]);
        this.showDestinationSuggestions.set(false);
      }
    });
  }

  private async searchPlaces(query: string, mode: LocationMode) {
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

        if (mode === 'departure') {
          this.departureSuggestions.set(suggestions);
          this.showDepartureSuggestions.set(true);
        } else {
          this.destinationSuggestions.set(suggestions);
          this.showDestinationSuggestions.set(true);
        }
      }
    });
  }

  onDepartureInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.departureSearch$.next(input.value);
  }

  onDestinationInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.destinationSearch$.next(input.value);
  }

  async selectSuggestion(suggestion: PlaceSuggestion, mode: LocationMode) {
    if (!this.placesService) return;

    this.isGeocoding.set(true);
    this.showDepartureSuggestions.set(false);
    this.showDestinationSuggestions.set(false);

    try {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: suggestion.placeId,
        fields: ['geometry', 'formatted_address', 'address_components', 'name']
      };

      this.placesService.getDetails(request, async (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const geocoderResult = {
            address_components: place.address_components || [],
            formatted_address: place.formatted_address || suggestion.mainText,
            geometry: {
              location: place.geometry.location,
              location_type: google.maps.GeocoderLocationType.ROOFTOP,
              viewport: place.geometry.viewport || new google.maps.LatLngBounds()
            },
            place_id: suggestion.placeId,
            types: []
          } as google.maps.GeocoderResult;

          const parsed = this.mapsService.parseGeocoderResult(geocoderResult);

          if (parsed) {
            // Override locationName with the place name for better UX
            parsed.locationName = suggestion.mainText;

            if (mode === 'departure') {
              this.departureAddress.set(parsed);
              if (this.departureInput?.nativeElement) {
                this.departureInput.nativeElement.value = suggestion.mainText;
              }
              await this.updateDepartureMarker({ lat, lng });
              this.currentMode.set('destination');
            } else {
              this.destinationAddress.set(parsed);
              if (this.destinationInput?.nativeElement) {
                this.destinationInput.nativeElement.value = suggestion.mainText;
              }
              await this.updateDestinationMarker({ lat, lng });
            }

            this.fitMapToBounds();
          }
        }
        this.isGeocoding.set(false);
      });
    } catch (error) {
      console.error('Error selecting suggestion:', error);
      this.isGeocoding.set(false);
      this.showToast('Failed to get location details', 'danger');
    }
  }

  private initializeForm() {
    this.driveForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
      day: ['', Validators.required],
      hour: ['', Validators.required],
      totalNoSeats: ['', [Validators.required, Validators.min(1)]],
      vehicleModel: ['', Validators.required],
      vehicleLicencePlate: ['', Validators.required],
      vehicleColor: ['', Validators.required],
      acceptedPaymentTypes: [['CASH'], Validators.required]
    });
  }

  private async initializeMap() {
    try {
      if (!this.mapContainer) {
        throw new Error('Map container not found');
      }

      await this.mapsService.waitForGoogleMaps(15000);
      const userLocation = await this.mapsService.getCurrentLocation();
      const center = userLocation || { lat: 44.4268, lng: 26.1025 };

      this.map = await this.mapsService.createMap(this.mapContainer.nativeElement, { center, zoom: 13 });
      this.map.addListener('click', (event: any) => this.onMapClick(event.latLng));

      // Initialize Places services (custom suggestions only, no Google dropdown)
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.map);

      this.mapLoaded.set(true);
      this.mapError.set(null);

    } catch (error: any) {
      console.error('Error initializing map:', error);
      this.mapError.set('Failed to load map. Please check your connection and refresh.');
      this.showToast('Map initialization failed', 'danger');
    }
  }

  private async updateDepartureMarker(location: google.maps.LatLngLiteral) {
    if (this.departureMarker) {
      this.departureMarker.setPosition(location);
    } else {
      this.departureMarker = await this.mapsService.createMarker(this.map!, location, {
        label: { text: 'A', color: '#FFFFFF', fontWeight: 'bold' },
        title: 'Pickup',
        draggable: true,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#1a1a1a',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        }
      });
      this.departureMarker.addListener('dragend', (event: any) => {
        this.currentMode.set('departure');
        this.onMapClick(event.latLng);
      });
    }
  }

  private async updateDestinationMarker(location: google.maps.LatLngLiteral) {
    if (this.destinationMarker) {
      this.destinationMarker.setPosition(location);
    } else {
      this.destinationMarker = await this.mapsService.createMarker(this.map!, location, {
        label: { text: 'B', color: '#FFFFFF', fontWeight: 'bold' },
        title: 'Destination',
        draggable: true,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#1a1a1a',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        }
      });
      this.destinationMarker.addListener('dragend', (event: any) => {
        this.currentMode.set('destination');
        this.onMapClick(event.latLng);
      });
    }
  }

  private fitMapToBounds() {
    if (this.departureMarker && this.destinationMarker && this.departureAddress() && this.destinationAddress()) {
      this.mapsService.fitBounds(this.map!, [
        { lat: this.departureAddress()!.latitude, lng: this.departureAddress()!.longitude },
        { lat: this.destinationAddress()!.latitude, lng: this.destinationAddress()!.longitude }
      ]);

      // Display route preview between the two points
      this.displayRoutePreview();
    }
  }

  /**
   * Display route preview between departure and destination points
   */
  private async displayRoutePreview() {
    const departure = this.departureAddress();
    const destination = this.destinationAddress();

    if (!departure || !destination || !this.map) {
      return;
    }

    try {
      const origin: google.maps.LatLngLiteral = {
        lat: departure.latitude,
        lng: departure.longitude
      };

      const destination_coords: google.maps.LatLngLiteral = {
        lat: destination.latitude,
        lng: destination.longitude
      };

      // Create or update DirectionsRenderer
      if (!this.directionsRenderer) {
        this.directionsRenderer = new google.maps.DirectionsRenderer({
          map: this.map,
          suppressMarkers: true, // We use our own markers with A/B labels
          polylineOptions: {
            strokeColor: '#4285F4',
            strokeWeight: 5,
            strokeOpacity: 0.8
          }
        });
      }

      // Display the route
      await this.mapsService.displayRoute(
        this.map,
        origin,
        destination_coords,
        this.directionsRenderer
      );

    } catch (error) {
      console.error('Error displaying route preview:', error);
      // Don't show toast for route preview errors - just log them
    }
  }

  /**
   * Clear the route preview from the map
   */
  private clearRoutePreview() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
      this.directionsRenderer = null;
    }
  }

  private hideSuggestions() {
    this.showDepartureSuggestions.set(false);
    this.showDestinationSuggestions.set(false);
  }

  private async onMapClick(latLng: google.maps.LatLng) {
    if (this.isUpdatingFromInput) return;

    this.isUpdatingFromMap = true;
    this.isGeocoding.set(true);
    this.hideSuggestions();

    try {
      const lat = latLng.lat();
      const lng = latLng.lng();

      // Use enhanced reverse geocoding with place name lookup
      const parsed = await this.mapsService.reverseGeocodeWithPlaceName(lat, lng, this.map || undefined);

      if (!parsed || !this.mapsService.isValidParsedAddress(parsed)) {
        this.showToast('Could not find address for this location', 'warning');
        return;
      }

      const location = { lat: parsed.latitude, lng: parsed.longitude };

      if (this.currentMode() === 'departure') {
        this.departureAddress.set(parsed);
        if (this.departureInput) {
          this.departureInput.nativeElement.value = this.mapsService.formatAddress(parsed);
        }
        await this.updateDepartureMarker(location);
        this.currentMode.set('destination');

      } else {
        this.destinationAddress.set(parsed);
        if (this.destinationInput) {
          this.destinationInput.nativeElement.value = this.mapsService.formatAddress(parsed);
        }
        await this.updateDestinationMarker(location);
        this.fitMapToBounds();
      }
    } catch (error) {
      console.error('Error handling map click:', error);
      this.showToast('Error processing location', 'danger');
    } finally {
      this.isUpdatingFromMap = false;
      this.isGeocoding.set(false);
    }
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
    newHeight = Math.max(40, Math.min(90, newHeight)); // Clamp between 40% and 90%

    this.sheetHeight.set(newHeight);
  }

  @HostListener('document:touchend')
  @HostListener('document:mouseup')
  onDragEnd() {
    if (!this.isDragging()) return;

    this.isDragging.set(false);

    // Snap to nearest breakpoint
    const height = this.sheetHeight();
    if (height < 50) {
      this.sheetHeight.set(40);
      this.isExpanded.set(false);
    } else if (height < 75) {
      this.sheetHeight.set(60);
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
    this.sheetHeight.set(60);
    this.isExpanded.set(false);
  }

  minimizeSheet() {
    this.sheetHeight.set(40);
    this.isExpanded.set(false);
  }

  selectDepartureMode() {
    this.currentMode.set('departure');
    this.showDestinationSuggestions.set(false);
  }

  selectDestinationMode() {
    this.currentMode.set('destination');
    this.showDepartureSuggestions.set(false);
  }

  clearDeparture() {
    this.departureAddress.set(null);
    this.departureSuggestions.set([]);
    this.showDepartureSuggestions.set(false);
    if (this.departureInput?.nativeElement) {
      this.departureInput.nativeElement.value = '';
    }
    if (this.departureMarker) {
      this.departureMarker.setMap(null);
      this.departureMarker = null;
    }
    // Clear route preview when departure is cleared
    this.clearRoutePreview();
  }

  clearDestination() {
    this.destinationAddress.set(null);
    this.destinationSuggestions.set([]);
    this.showDestinationSuggestions.set(false);
    if (this.destinationInput?.nativeElement) {
      this.destinationInput.nativeElement.value = '';
    }
    if (this.destinationMarker) {
      this.destinationMarker.setMap(null);
      this.destinationMarker = null;
    }
    // Clear route preview when destination is cleared
    this.clearRoutePreview();
  }

  onInputFocus(mode: LocationMode) {
    this.currentMode.set(mode);
    this.expandSheet();
  }

  onInputBlur(mode: LocationMode) {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      if (mode === 'departure') {
        this.showDepartureSuggestions.set(false);
      } else {
        this.showDestinationSuggestions.set(false);
      }
    }, 200);
  }

  proceedToDetails() {
    if (this.canProceedToDetails()) {
      this.currentStep.set('details');
      this.sheetHeight.set(90);
      this.isExpanded.set(true);
    }
  }

  backToMap() {
    this.currentStep.set('location');
    this.sheetHeight.set(60);
    this.isExpanded.set(false);
  }

  async confirmRide() {
    const alert = await this.alertController.create({
      header: 'Confirm Ride',
      message: 'Are you sure you want to create this ride?',
      cssClass: 'confirm-alert',
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
            this.onSubmit();
          }
        }
      ]
    });
    await alert.present();
  }

  private loadUserVehicle(userId: number) {
    this.vehicleService.getByUserId(userId)
      .pipe(catchError(error => of(null)))
      .subscribe(vehicle => {
        if (vehicle) {
          this.driveForm.patchValue({
            vehicleModel: vehicle.model,
            vehicleLicencePlate: vehicle.vehicleLicencePlate,
            vehicleColor: vehicle.color
          });
          // Disable if user has registered vehicle
          this.driveForm.get('vehicleModel')?.disable();
          this.driveForm.get('vehicleLicencePlate')?.disable();
          this.driveForm.get('vehicleColor')?.disable();
        }
      });
  }

  hasVehicle(): boolean {
    return this.driveForm.get('vehicleModel')?.disabled || false;
  }

  async onSubmit() {
    if (this.driveForm.invalid || !this.userId || !this.canProceedToDetails()) {
      this.markFormGroupTouched(this.driveForm);
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formValue = this.driveForm.getRawValue();
      const departure = this.departureAddress()!;
      const destination = this.destinationAddress()!;

      const driveRequest: DriveCreateRequest = {
        fromAddress: {
          street: departure.street,
          number: departure.number,
          neighborhood: departure.neighborhood,
          locationName: departure.locationName,
          city: departure.city
        },
        toAddress: {
          street: destination.street,
          number: destination.number,
          neighborhood: destination.neighborhood,
          locationName: destination.locationName,
          city: destination.city
        },
        price: parseFloat(formValue.price),
        day: formValue.day,
        hour: formValue.hour + ':00',
        totalNoSeats: parseInt(formValue.totalNoSeats, 10),
        vehicleModel: formValue.vehicleModel,
        vehicleLicencePlate: formValue.vehicleLicencePlate,
        vehicleColor: formValue.vehicleColor,
        userId: this.userId,
        acceptedPaymentTypes: formValue.acceptedPaymentTypes
      };

      this.driveService.addDrive(driveRequest).subscribe({
        next: async () => {
          await this.showToast('Ride created successfully!', 'success');
          this.router.navigate(['/home']);
        },
        error: async (error: any) => {
          console.error('Error creating drive:', error);
          let errorMessage = 'Failed to create ride. Please try again.';
          if (error.status === 400) errorMessage = 'Invalid ride data. Please check all fields.';
          else if (error.status === 422) errorMessage = 'Validation failed. Please check your input.';
          await this.showToast(errorMessage, 'danger');
          this.isSubmitting.set(false);
        },
        complete: () => this.isSubmitting.set(false)
      });
    } catch (error) {
      console.error('Error submitting drive:', error);
      await this.showToast('An unexpected error occurred', 'danger');
      this.isSubmitting.set(false);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => formGroup.get(key)?.markAsTouched());
  }

  getErrorMessage(fieldName: string): string {
    const control = this.driveForm.get(fieldName);
    if (control?.hasError('required') && control.touched) return 'This field is required';
    if (control?.hasError('min') && control.touched) return 'Value must be greater than 0';
    return '';
  }

  onPaymentMethodChange(event: any, type: string) {
    const currentTypes = this.driveForm.get('acceptedPaymentTypes')?.value || [];
    if (event.detail.checked) {
      if (!currentTypes.includes(type)) {
        this.driveForm.patchValue({ acceptedPaymentTypes: [...currentTypes, type] });
      }
    } else {
      this.driveForm.patchValue({ acceptedPaymentTypes: currentTypes.filter((t: string) => t !== type) });
    }
  }

  /**
   * Format departure address with all fields for display
   * Format: location_name, Street Number, Neighborhood, City
   */
  getFormattedDepartureAddress(): string {
    const addr = this.departureAddress();
    if (!addr) return 'Unknown location';

    // Build full address with all available fields
    const parts: string[] = [];

    // Add location name if available
    if (addr.locationName) {
      parts.push(addr.locationName);
    }

    // Add street and number if different from locationName
    if (addr.street && addr.street !== 'Unknown') {
      const streetPart = addr.number && addr.number !== 'S/N' ? `${addr.street} ${addr.number}` : addr.street;
      if (!addr.locationName || !addr.locationName.includes(addr.street)) {
        parts.push(streetPart);
      }
    }

    // Add neighborhood if available and not already included
    if (addr.neighborhood && addr.neighborhood !== 'Unknown' && !parts.some(p => p.includes(addr.neighborhood))) {
      parts.push(addr.neighborhood);
    }

    // Add city if available and not already included
    if (addr.city && addr.city !== 'Unknown' && !parts.some(p => p.includes(addr.city))) {
      parts.push(addr.city);
    }

    return parts.join(', ') || 'Unknown location';
  }

  /**
   * Format destination address with all fields for display
   * Format: location_name, Street Number, Neighborhood, City
   */
  getFormattedDestinationAddress(): string {
    const addr = this.destinationAddress();
    if (!addr) return 'Unknown location';

    // Build full address with all available fields
    const parts: string[] = [];

    // Add location name if available
    if (addr.locationName) {
      parts.push(addr.locationName);
    }

    // Add street and number if different from locationName
    if (addr.street && addr.street !== 'Unknown') {
      const streetPart = addr.number && addr.number !== 'S/N' ? `${addr.street} ${addr.number}` : addr.street;
      if (!addr.locationName || !addr.locationName.includes(addr.street)) {
        parts.push(streetPart);
      }
    }

    // Add neighborhood if available and not already included
    if (addr.neighborhood && addr.neighborhood !== 'Unknown' && !parts.some(p => p.includes(addr.neighborhood))) {
      parts.push(addr.neighborhood);
    }

    // Add city if available and not already included
    if (addr.city && addr.city !== 'Unknown' && !parts.some(p => p.includes(addr.city))) {
      parts.push(addr.city);
    }

    return parts.join(', ') || 'Unknown location';
  }

  getTodayDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  private cleanupMap() {
    this.clearRoutePreview();
    if (this.map) {
      this.mapsService.destroyMap(this.map);
      this.map = null;
    }
  }
}
