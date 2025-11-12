import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';
import { RideCardComponent } from 'src/app/shared/components/cards/ride-card.component';
import { DriveService } from 'src/app/core/services/drive.service';
import { DriveCard } from 'src/app/core/models/drive-card.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, AppHeaderComponent, SidePanelComponent, RideCardComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isPanelOpen = false;
  drives: DriveCard[] = [];
  loading = false;
  currentPage = 0;
  totalPages = 0;

  constructor(
    private router: Router,
    private driveService: DriveService
  ) {}

  ngOnInit() {
    this.loadDrives();
  }

  loadDrives() {
    this.loading = true;
    this.driveService.getDriveCards(this.currentPage, 10).subscribe({
      next: (response) => {
        this.drives = response.content;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading drives:', error);
        this.loading = false;
      }
    });
  }

  getDriverName(drive: DriveCard): string {
    return `${drive.driverFirstName} ${drive.driverLastName}`;
  }

  getFromLocation(drive: DriveCard): string {
    return drive.fromNeighborhood || drive.fromLocationName;
  }

  getToLocation(drive: DriveCard): string {
    return drive.toNeighborhood || drive.toLocationName;
  }

  formatDepartureTime(time: string): string {
    const date = new Date(time);
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
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
    }
  }

  formatPrice(price: number): string {
    return `${price} RON`;
  }

  onCardClick(drive: DriveCard) {
    console.log('Drive clicked:', drive);
  }

  onMenuOpen() {
    this.isPanelOpen = true;
  }

  onPanelClosed() {
    this.isPanelOpen = false;
  }

  onMenuItemClick(item: string) {
    console.log('Menu item clicked:', item);
    
    switch(item) {
      case 'home':
        break;
      case 'drives':
        break;
      case 'settings':
        break;
      case 'logout':
        console.log('Logging out...');
        break;
    }
  }
}