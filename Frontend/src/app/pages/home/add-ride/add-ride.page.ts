import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  ToastController, IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, arrowBack, locationOutline, timeOutline, peopleOutline, cashOutline } from 'ionicons/icons';
import {AppHeaderComponent} from "../../../shared/components/header/app-header.component";
import {PrimaryButtonComponent} from "../../../shared/components/buttons/primary-button.component";
import {RideCardComponent} from "../../../shared/components/cards/ride-card.component";
import {IonicModule} from "@ionic/angular";
import {SidePanelComponent} from "../../../shared/components/panel/side-panel.component";
import {DriveCard} from "../../../core/models/drive-card.model";
import {DriveService} from "../../../core/services/drive.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-ride',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AppHeaderComponent,
    IonicModule,

  ],
  templateUrl: './add-ride.page.html',
  styleUrls: ['./add-ride.page.scss']
})
export class AddRidePage implements OnInit {
  rideForm!: FormGroup;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private fb: FormBuilder,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private toastController: ToastController,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private service: DriveService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router
  ) {
    addIcons({
      addOutline,
      arrowBack,
      locationOutline,
      timeOutline,
      peopleOutline,
      cashOutline
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  async submitForm() {
    if (this.rideForm.invalid) {
      return;
    }

    const rideData = this.rideForm.value;
    console.log('Ride created:', rideData);
    await this.showToast('Ride created successfully!', 'success');
    const rideData2: any = {
      fromStreet: '1',
      fromNumber: '33',
      fromNeighborhood: 'mmmd',
      fromLocationName: rideData.from,
      toStreet: '1',
      toNumber: '31',
      toNeighborhood: 'asasa',
      toLocationName: rideData.destination,
      price: rideData.price,
      day: rideData.day.split("T")[0],
      hour: rideData.hour.split("T")[1],
      availableSeats: rideData.seats,
      totalNoSeats: rideData.seats,
      userId: 4,
      vehicleId: '1',
      vehicleLicensePlate: '1',
      vehicleColor: '2'


    };
    this.service.addDrive(rideData2).subscribe({next:
        (x) =>  this.router.navigate(['home']),
    error: (err) => {console.error(err)}})
    this.rideForm.reset();
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  initializeForm() {
    this.rideForm = this.fb.group({
      from: ['', Validators.required],
      destination: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      day: [null, Validators.required],
      hour: [null, Validators.required],
      seats: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
    });
  }

  onMenuOpen() {
    this.router.navigate(['home']);
  }
}
