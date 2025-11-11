import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrimaryButtonComponent } from '../../shared/components/buttons/primary-button.component';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, AppHeaderComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  onLogin() {
    // Handle login navigation
    console.log('Login clicked');
  }

  onMenuOpen(){
    console.log('Menu clicked');
  }
}
