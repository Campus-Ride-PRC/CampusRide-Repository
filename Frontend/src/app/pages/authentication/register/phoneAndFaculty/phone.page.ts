import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from 'src/app/shared/components/buttons/primary-button.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { DropdownComponent, DropdownOption } from 'src/app/shared/components/text-input/dropdown.component';
import { FacultyService } from 'src/app/core/services/faculty.service';
import { Faculty } from 'src/app/core/models/faculty.model';

@Component({
  selector: 'app-register-phone',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, PrimaryButtonComponent, TextInputComponent, DropdownComponent],
  templateUrl: './phone.page.html',
  styleUrls: ['./phone.page.scss'],
})
export class PhonePage implements OnInit {
  constructor(private router: Router, private facultyService: FacultyService) {}

  phoneNumber: string = '';
  selectedFaculty: string = '';
  faculties: DropdownOption[] = [];

  ngOnInit() {
    this.loadFaculties();
  }

  loadFaculties() {
    this.facultyService.getFaculties().subscribe({
      next: (data: Faculty[]) => {
        this.faculties = data.map(faculty => ({
          value: faculty.id.toString(),
          label: faculty.name
        }));
      },
      error: (err) => {
        console.error('Error loading faculties', err);
      }
    });
  }

  onContinue() {
    console.log('Selected faculty:', this.selectedFaculty);
    this.router.navigate(['/register/verify']);
  }
}
