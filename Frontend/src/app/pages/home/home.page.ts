import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, AppHeaderComponent, SidePanelComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  isPanelOpen = false;

  constructor(private router: Router) {
    console.log('HomePage initialized, isPanelOpen:', this.isPanelOpen);
  }

  onMenuOpen() {
  console.log('Menu opened - before setting isPanelOpen to true');
  this.isPanelOpen = true;
  console.log('Menu opened - after setting isPanelOpen to true:', this.isPanelOpen);
}

onPanelClosed() {
  console.log('Panel closed - before setting isPanelOpen to false');
  this.isPanelOpen = false;
  console.log('Panel closed - after setting isPanelOpen to false:', this.isPanelOpen);
}

  onMenuItemClick(item: string) {
    console.log('Menu item clicked:', item);
    
    switch(item) {
      case 'home':
        // Navigate to home
        // this.router.navigate(['/home']);
        break;
      case 'drives':
        // Navigate to add drives
        // this.router.navigate(['/drives']);
        break;
      case 'settings':
        // Navigate to settings
        // this.router.navigate(['/settings']);
        break;
      case 'logout':
        // Handle logout
        console.log('Logging out...');
        break;
    }
  }
}