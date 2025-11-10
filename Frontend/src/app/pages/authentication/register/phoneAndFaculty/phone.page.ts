import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from 'src/app/shared/components/buttons/primary-button.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { DropdownComponent, DropdownOption } from 'src/app/shared/components/text-input/dropdown.component';
import { FacultyService } from 'src/app/core/services/faculty.service';
import { Faculty } from 'src/app/core/models/faculty.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register-phone',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, TextInputComponent, DropdownComponent],
  templateUrl: './phone.page.html',
  styleUrls: ['./phone.page.scss'],
})
export class PhonePage implements OnInit {
  constructor(private router: Router, private facultyService: FacultyService, 
    private authService: AuthService, private toastController: ToastController) {}

  phoneNumber: string = '';
  selectedFacultyId: number = -1;
  faculties: Faculty[] = [];
  facultiesDropdown: DropdownOption[] = [];

  ngOnInit() {
    this.loadFaculties();
  }

  loadFaculties() {
    this.facultyService.getFaculties().subscribe({
      next: (data: Faculty[]) => {
        this.faculties = data;
        this.facultiesDropdown = data.map(faculty => ({
          value: faculty.id.toString(),
          label: faculty.name
        }));

        console.log('Faculties loaded: ', this.faculties); 
      },
      error: (err) => {
        console.error('Error loading faculties', err);
      }
    });
  }

  onContinue() {
  if (!this.phoneNumber) {
    this.toastController.create({
      message: 'Please enter a phone number.',
      duration: 2000,
      color: 'danger'
    }).then(toast => toast.present());
    return;
  }

  console.log("faculty id selected: ", this.selectedFacultyId);

  const selectedFaculty = this.faculties.find(f => f.id === +this.selectedFacultyId);
  if (!selectedFaculty) {
    this.toastController.create({
      message: 'Please select a faculty.',
      duration: 2000,
      color: 'danger'
    }).then(toast => toast.present());
    return;
  }

  this.authService.setPhoneNumber(this.phoneNumber);
  this.authService.setFaculty(selectedFaculty);

  console.log("Faculty selected: ", selectedFaculty);
  console.log("Registration Data: ", this.authService.getRegistrationData());

  this.onRegister();
}


  onRegister() {
    this.authService.registerUser().subscribe({
      next: (res) => {
        console.log('Registration successful: ', res);
        this.router.navigate(['/register/verify']); 
      },
      error: (err) => {
        this.toastController.create({
          message: 'Registration failed. Please try again.',
          duration: 2000,
          color: 'danger'
        }).then(toast => toast.present());
        console.error(err);
      },
    });
  }
}
