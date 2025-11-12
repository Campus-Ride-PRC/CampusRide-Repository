import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DriveService } from 'src/app/core/services/drive.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriveCreateRequest } from 'src/app/core/models/drive-create-request.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-add-drive',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-drive.page.html',
  styleUrls: ['./add-drive.page.scss']
})
export class AddDrivePage implements OnInit {
  driveForm!: FormGroup;
  userId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private driveService: DriveService,
    private vehicleService: VehicleService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    if (this.userId) {
      this.loadUserVehicle(this.userId);
    }
  }

  private initializeForm() {
    this.driveForm = this.fb.group({
      // From Location
      fromStreet: ['', Validators.required],
      fromNumber: ['', Validators.required],
      fromNeighborhood: ['', Validators.required],
      fromLocationName: [''],

      // To Location
      toStreet: ['', Validators.required],
      toNumber: ['', Validators.required],
      toNeighborhood: ['', Validators.required],
      toLocationName: [''],

      // Drive Details
      price: ['', [Validators.required, Validators.min(0)]],
      day: ['', Validators.required],
      hour: ['', Validators.required],
      availableSeats: ['', [Validators.required, Validators.min(1)]],
      totalNoSeats: ['', [Validators.required, Validators.min(1)]],

      // Vehicle Details
      vehicleModel: ['', Validators.required],
      vehicleLicencePlate: ['', Validators.required],
      vehicleColor: ['', Validators.required]
    });
  }

  private loadUserVehicle(userId: number) {
    this.vehicleService.getByUserId(userId)
      .pipe(
        catchError(error => {
          // If vehicle not found (404), just continue without pre-filling
          if (error.status === 404) {
            console.log('No vehicle found for user');
          }
          return of(null);
        })
      )
      .subscribe(vehicle => {
        if (vehicle) {
          // Pre-fill vehicle fields
          this.driveForm.patchValue({
            vehicleModel: vehicle.model,
            vehicleLicencePlate: vehicle.vehicleLicencePlate,
            vehicleColor: vehicle.color
          });
        }
      });
  }

  onSubmit() {
    if (this.driveForm.invalid || !this.userId) {
      this.markFormGroupTouched(this.driveForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.driveForm.value;
    
    // Date is already in YYYY-MM-DD format from HTML5 input
    const dayString = formValue.day;
    
    // Time is in HH:MM format from HTML5 input, convert to HH:MM:SS
    const hourString = formValue.hour + ':00';

    const driveRequest: DriveCreateRequest = {
      fromStreet: formValue.fromStreet,
      fromNumber: formValue.fromNumber,
      fromNeighborhood: formValue.fromNeighborhood,
      fromLocationName: formValue.fromLocationName || '',
      toStreet: formValue.toStreet,
      toNumber: formValue.toNumber,
      toNeighborhood: formValue.toNeighborhood,
      toLocationName: formValue.toLocationName || '',
      price: parseFloat(formValue.price),
      day: dayString,
      hour: hourString,
      availableSeats: parseInt(formValue.availableSeats, 10),
      totalNoSeats: parseInt(formValue.totalNoSeats, 10),
      vehicleModel: formValue.vehicleModel,
      vehicleLicencePlate: formValue.vehicleLicencePlate,
      vehicleColor: formValue.vehicleColor,
      userId: this.userId
    };

    this.driveService.addDrive(driveRequest).subscribe({
      next: (response: any) => {
        console.log('Drive created successfully:', response);
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Error creating drive:', error);
        this.isLoading = false;
        
        if (error.status === 400) {
          this.errorMessage = 'Invalid drive data. Please check all fields.';
        } else if (error.status === 422) {
          this.errorMessage = 'Validation failed. Please check your input.';
        } else {
          this.errorMessage = 'Failed to create drive. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.driveForm.get(fieldName);
    if (control?.hasError('required') && control.touched) {
      return 'This field is required';
    }
    if (control?.hasError('min') && control.touched) {
      return 'Value must be greater than 0';
    }
    return '';
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
