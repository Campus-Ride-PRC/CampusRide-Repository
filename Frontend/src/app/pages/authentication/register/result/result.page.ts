import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from 'src/app/shared/components/buttons/primary-button.component';

@Component({
  selector: 'app-register-result',
  standalone: true,
  imports: [CommonModule, IonicModule, PrimaryButtonComponent, RouterModule],
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage {
  constructor(private router: Router) {}

  onLoginPressed() {
    this.router.navigate(['/welcome']);
  }
}
