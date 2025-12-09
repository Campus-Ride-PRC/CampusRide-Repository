/// <reference types="google.maps" />
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address.model';

export interface ParsedAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  locationName: string;
  latitude: number;
  longitude: number;
}

export interface SnapResult {
  lat: number;
  lng: number;
  snapped: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private readonly DEFAULT_CENTER = { lat: 46.772962, lng: 23.597231 }; 
  private readonly DEFAULT_ZOOM = 13;

  constructor() {}

  /**
   * Check if Google Maps API is loaded and ready
   */
  isGoogleMapsLoaded(): boolean {
    return typeof google !== 'undefined' && 
           typeof google.maps !== 'undefined' &&
           typeof google.maps.Map !== 'undefined';
  }

  /**
   * Wait for Google Maps to load with timeout
   */
  async waitForGoogleMaps(timeoutMs: number = 10000): Promise<boolean> {
    // Ensure the script is injected (if not already)
    if (!this.isGoogleMapsLoaded()) {
      try {
        await this.loadGoogleMapsScript();
      } catch (err) {
        throw new Error('Failed to load Google Maps script: ' + err);
      }
    }

    const startTime = Date.now();
    while (!this.isGoogleMapsLoaded()) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error('Google Maps API failed to load within timeout period');
      }
      await this.delay(100);
    }

    return true;
  }

  /**
   * Dynamically injects the Google Maps script using the key from environment.
   * If the script is already present, waits for it to load.
   */
  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already available, resolve immediately
      if (this.isGoogleMapsLoaded()) {
        resolve();
        return;
      }

      // Check if a script element with our id already exists
      const existing = document.getElementById('google-maps-script');
      if (existing) {
        // If the global is still not ready, wait for load
        (existing as HTMLScriptElement).addEventListener('load', () => resolve());
        (existing as HTMLScriptElement).addEventListener('error', (e) => reject(e));
        return;
      }

      const apiKey = environment.googleMapsApiKey;
      if (!apiKey) {
        reject('Google Maps API key not provided in environment');
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        resolve();
      };
      script.onerror = (ev) => {
        reject(ev || new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initialize a Google Map instance
   */
  async createMap(
    element: HTMLElement,
    options?: google.maps.MapOptions
  ): Promise<google.maps.Map> {
    await this.waitForGoogleMaps();

    const defaultOptions: google.maps.MapOptions = {
      center: this.DEFAULT_CENTER,
      zoom: this.DEFAULT_ZOOM,
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'greedy',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      ...options
    };

    return new google.maps.Map(element, defaultOptions);
  }

  /**
   * Create a marker on the map
   */
  async createMarker(
    map: google.maps.Map,
    position: google.maps.LatLngLiteral,
    options?: google.maps.MarkerOptions
  ): Promise<google.maps.Marker> {
    await this.waitForGoogleMaps();

    return new google.maps.Marker({
      map,
      position,
      draggable: false,
      ...options
    });
  }

  /**
   * Geocode an address string to coordinates
   */
  async geocodeAddress(address: string): Promise<google.maps.GeocoderResult | null> {
    await this.waitForGoogleMaps();

    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          resolve(results[0]);
        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          resolve(null);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  /**
   * Reverse geocode coordinates to address
   * Returns all results to allow searching for neighborhood in separate result
   */
  async reverseGeocode(lat: number, lng: number): Promise<google.maps.GeocoderResult[] | null> {
    await this.waitForGoogleMaps();

    const geocoder = new google.maps.Geocoder();
    const location = { lat, lng };
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          resolve(results);
        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          resolve(null);
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });
  }

  /**
   * Parse a GeocoderResult (or array of results) into our Address model
   * Handles edge cases where components might be missing
   * When an array is provided, searches all results for neighborhood information
   */
  parseGeocoderResult(result: google.maps.GeocoderResult | google.maps.GeocoderResult[]): ParsedAddress | null {
    // Handle array of results
    const results = Array.isArray(result) ? result : [result];
    const mainResult = results[0];
    
    if (!mainResult || !mainResult.address_components) {
      return null;
    }

    const components = mainResult.address_components;
    const location = mainResult.geometry.location;

    // Extract components with fallbacks
    let street = '';
    let number = '';
    let neighborhood = '';
    let locationName = '';

    // Route (street name)
    const routeComponent = components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('route'));
    if (routeComponent) {
      street = routeComponent.long_name;
    }

    // Street number
    const numberComponent = components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('street_number'));
    if (numberComponent) {
      number = numberComponent.long_name;
    } else {
      // Fallback: use a default number if not found
      number = 'S/N'; // Sin Número (Without Number)
    }

    // Neighborhood - search across all results for the one with 'neighborhood' type
    let neighborhoodComponent: google.maps.GeocoderAddressComponent | undefined;
    
    // First, try to find a result that has type 'neighborhood' in its types array
    const neighborhoodResult = results.find(r => r.types && r.types.includes('neighborhood'));
    if (neighborhoodResult && neighborhoodResult.address_components) {
      neighborhoodComponent = neighborhoodResult.address_components.find(
        (c: google.maps.GeocoderAddressComponent) => c.types.includes('neighborhood')
      );
    }
    
    // If not found in separate result, search in the main result's components
    if (!neighborhoodComponent) {
      neighborhoodComponent = 
        components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('neighborhood')) ||
        components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('sublocality_level_1')) ||
        components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('sublocality')) ||
        components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('locality')) ||
        components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('administrative_area_level_2'));
    }
    
    if (neighborhoodComponent) {
      neighborhood = neighborhoodComponent.long_name;
    }
    console.log('Parsed neighborhood:', neighborhood);
    console.log("Neighborhood component:", neighborhoodComponent);
    // Location name (formatted address or point of interest)
    const poiComponent = components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('point_of_interest'));
    if (poiComponent) {
      locationName = poiComponent.long_name;
    } else if (mainResult.formatted_address) {
      locationName = mainResult.formatted_address;
    }

    // Validate that we have minimum required data
    if (!street && !locationName) {
      return null;
    }

    // If no street, try to extract from formatted address
    if (!street && locationName) {
      const parts = locationName.split(',');
      if (parts.length > 0) {
        street = parts[0].trim();
      }
    }

    // Extract city (locality)
    let city = '';
    const cityComponent = components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('locality'));
    if (cityComponent) {
      city = cityComponent.long_name;
    } else {
      // Fallback to administrative_area_level_2 (county/district)
      const adminComponent = components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('administrative_area_level_2'));
      if (adminComponent) {
        city = adminComponent.long_name;
      }
    }

    // If still no neighborhood, use locality
    if (!neighborhood) {
      const localityComponent = components.find((c: google.maps.GeocoderAddressComponent) => c.types.includes('locality'));
      if (localityComponent) {
        neighborhood = localityComponent.long_name;
      } else {
        neighborhood = 'Unknown';
      }
    }

    const lat = (typeof location.lat === 'function' ? location.lat() : location.lat) as number;
    const lng = (typeof location.lng === 'function' ? location.lng() : location.lng) as number;

    return {
      street: street || 'Unknown',
      number,
      neighborhood,
      city: city || neighborhood || 'Unknown',
      locationName: locationName || `${street} ${number}`,
      latitude: lat,
      longitude: lng
    };
  }

  /**
   * Create an Autocomplete instance for an input element
   */
  async createAutocomplete(
    input: HTMLInputElement,
    options?: google.maps.places.AutocompleteOptions
  ): Promise<google.maps.places.Autocomplete> {
    await this.waitForGoogleMaps();

    const defaultOptions: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'ro' }, // Restrict to Romania
      fields: ['address_components', 'geometry', 'formatted_address', 'name'],
      ...options
    };

    return new google.maps.places.Autocomplete(input, defaultOptions);
  }

  /**
   * Calculate and display a route between two points
   */
  async displayRoute(
    map: google.maps.Map,
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral,
    renderer?: google.maps.DirectionsRenderer
  ): Promise<google.maps.DirectionsResult> {
    await this.waitForGoogleMaps();

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = renderer || new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });

    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        }
      );
    });
  }

  /**
   * Find the nearest point on a polyline to a given coordinate
   * Uses Google Maps Geometry library for accurate snapping
   */
  findNearestPointOnPolyline(
    clickLatLng: google.maps.LatLngLiteral,
    polyline: google.maps.Polyline | google.maps.LatLng[],
    toleranceMeters: number = 50
  ): SnapResult {
    if (!this.isGoogleMapsLoaded() || !google.maps.geometry) {
      throw new Error('Google Maps Geometry library not loaded');
    }

    const clickPoint = new google.maps.LatLng(clickLatLng.lat, clickLatLng.lng);
    
    // Get path from polyline
    let path: google.maps.LatLng[];
    if (Array.isArray(polyline)) {
      path = polyline;
    } else {
      path = polyline.getPath().getArray();
    }

    if (path.length < 2) {
      return {
        lat: clickLatLng.lat,
        lng: clickLatLng.lng,
        snapped: false
      };
    }

    let closestPoint = path[0];
    let minDistance = google.maps.geometry.spherical.computeDistanceBetween(clickPoint, path[0]);

    // Check each segment of the polyline
    for (let i = 0; i < path.length - 1; i++) {
      const segmentStart = path[i];
      const segmentEnd = path[i + 1];

      // Find the closest point on this segment
      const projection = this.projectPointOnSegment(clickPoint, segmentStart, segmentEnd);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(clickPoint, projection);

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = projection;
      }
    }

    // Check if the click is within tolerance
    const snapped = minDistance <= toleranceMeters;

    return {
      lat: closestPoint.lat(),
      lng: closestPoint.lng(),
      snapped
    };
  }

  /**
   * Project a point onto a line segment (helper for snapping)
   */
  private projectPointOnSegment(
    point: google.maps.LatLng,
    segmentStart: google.maps.LatLng,
    segmentEnd: google.maps.LatLng
  ): google.maps.LatLng {
    const x = point.lat();
    const y = point.lng();
    const x1 = segmentStart.lat();
    const y1 = segmentStart.lng();
    const x2 = segmentEnd.lat();
    const y2 = segmentEnd.lng();

    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) {
      // Segment start and end are the same point
      return segmentStart;
    }

    // Calculate the parameter t of the projection
    const t = Math.max(0, Math.min(1, 
      ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
    ));

    // Calculate the projected point
    const projectedLat = x1 + t * dx;
    const projectedLng = y1 + t * dy;

    return new google.maps.LatLng(projectedLat, projectedLng);
  }

  /**
   * Extract polyline path from DirectionsResult
   */
  getPolylineFromDirections(directionsResult: google.maps.DirectionsResult): google.maps.LatLng[] {
    const path: google.maps.LatLng[] = [];
    
    if (!directionsResult.routes || directionsResult.routes.length === 0) {
      return path;
    }

    const route = directionsResult.routes[0];
    if (!route.overview_path) {
      return path;
    }

    return route.overview_path;
  }

  /**
   * Check if a location is near a polyline (for validation)
   */
  isLocationOnEdge(
    location: google.maps.LatLngLiteral,
    polyline: google.maps.Polyline | google.maps.LatLng[],
    toleranceMeters: number = 50
  ): boolean {
    if (!google.maps.geometry || !google.maps.geometry.poly) {
      console.warn('Google Maps Geometry library not loaded');
      return false;
    }

    const point = new google.maps.LatLng(location.lat, location.lng);
    
    let path: google.maps.LatLng[];
    if (Array.isArray(polyline)) {
      path = polyline;
    } else {
      path = polyline.getPath().getArray();
    }

    // Use Google's built-in isLocationOnEdge if available
    if (google.maps.geometry.poly.isLocationOnEdge) {
      return google.maps.geometry.poly.isLocationOnEdge(point, new google.maps.Polyline({ path }), toleranceMeters);
    }

    // Fallback: check minimum distance
    return this.findNearestPointOnPolyline(location, path, toleranceMeters).snapped;
  }

  /**
   * Fit map bounds to show multiple markers/locations
   */
  fitBounds(map: google.maps.Map, locations: google.maps.LatLngLiteral[]): void {
    if (!locations || locations.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    locations.forEach(loc => bounds.extend(loc));
    
    map.fitBounds(bounds);
    
    // Add padding
    if (locations.length === 1) {
      map.setZoom(15);
    }
  }

  /**
   * Get current user location
   */
  async getCurrentLocation(): Promise<google.maps.LatLngLiteral | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Error getting location:', error);
          resolve(null);
        },
        {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true
        }
      );
    });
  }

  /**
   * Format address for display (includes city name)
   */
  formatAddress(address: ParsedAddress | Address): string {
    if ('latitude' in address && 'longitude' in address) {
      // ParsedAddress
      const parsed = address as ParsedAddress;
      const cityPart = parsed.city && parsed.city !== parsed.neighborhood ? `, ${parsed.city}` : '';
      return `${parsed.street} ${parsed.number}, ${parsed.neighborhood}${cityPart}`;
    } else {
      // Address model
      const addr = address as Address;
      return `${addr.street} ${addr.number}, ${addr.neighborhood}`;
    }
  }

  /**
   * Format address with city for ride details display
   */
  formatAddressWithCity(address: ParsedAddress): string {
    const streetPart = address.number && address.number !== 'S/N' 
      ? `${address.street} ${address.number}` 
      : address.street;
    const cityPart = address.city || address.neighborhood;
    return `${streetPart}, ${cityPart}`;
  }

  /**
   * Utility: delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up map resources
   */
  destroyMap(map: google.maps.Map): void {
    if (map) {
      google.maps.event.clearInstanceListeners(map);
    }
  }

  /**
   * Validate parsed address has required fields
   */
  isValidParsedAddress(address: ParsedAddress | null): boolean {
    if (!address) return false;
    return !!(address.street && address.neighborhood && address.latitude && address.longitude);
  }

  /**
   * Find the nearest place/establishment at given coordinates
   * Uses Places API to get descriptive names like "FSEGA" instead of just street addresses
   * @param lat Latitude
   * @param lng Longitude
   * @param map Google Map instance (required for PlacesService)
   * @param radiusMeters Search radius in meters (default 50m)
   * @returns Place name if found, null otherwise
   */
  async findNearbyPlaceName(
    lat: number, 
    lng: number, 
    map: google.maps.Map,
    radiusMeters: number = 50
  ): Promise<string | null> {
    await this.waitForGoogleMaps();

    const placesService = new google.maps.places.PlacesService(map);
    const location = new google.maps.LatLng(lat, lng);

    return new Promise((resolve) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius: radiusMeters,
        // Search for establishments, points of interest
        type: 'establishment'
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          // Find the closest place to our coordinates
          let closestPlace = results[0];
          let closestDistance = Infinity;

          for (const place of results) {
            if (place.geometry?.location) {
              const distance = google.maps.geometry.spherical.computeDistanceBetween(
                location,
                place.geometry.location
              );
              if (distance < closestDistance) {
                closestDistance = distance;
                closestPlace = place;
              }
            }
          }

          // Only return the place name if it's within a reasonable distance
          if (closestDistance <= radiusMeters && closestPlace.name) {
            resolve(closestPlace.name);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Enhanced reverse geocoding that also tries to find a descriptive place name
   * @param lat Latitude
   * @param lng Longitude
   * @param map Optional Google Map instance for place name lookup
   * @returns ParsedAddress with potentially enhanced locationName
   */
  async reverseGeocodeWithPlaceName(
    lat: number, 
    lng: number, 
    map?: google.maps.Map
  ): Promise<ParsedAddress | null> {
    const geocodeResults = await this.reverseGeocode(lat, lng);
    
    if (!geocodeResults) {
      return null;
    }

    const parsed = this.parseGeocoderResult(geocodeResults);
    
    if (!parsed) {
      return null;
    }

    // Try to find a better place name if map is provided
    if (map) {
      const placeName = await this.findNearbyPlaceName(lat, lng, map);
      if (placeName) {
        parsed.locationName = placeName;
      }
    }

    return parsed;
  }
}
