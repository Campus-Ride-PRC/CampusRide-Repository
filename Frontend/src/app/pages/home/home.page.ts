import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AppHeaderComponent } from 'src/app/shared/components/header/app-header.component';
import { SidePanelComponent } from 'src/app/shared/components/panel/side-panel.component';
import { RideCardComponent } from 'src/app/shared/components/cards/ride-card.component';
import { DriveService } from 'src/app/core/services/drive.service';
import { AuthService } from 'src/app/core/services/auth.service';
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
  pageSize = 5;
  isLastPage = false;

  constructor(
    private router: Router,
    private driveService: DriveService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDrives();
  }

  loadDrives(reset: boolean = false) {
    if (this.loading || (this.isLastPage && !reset)) {
      return;
    }

    if (reset) {
      this.currentPage = 0;
      this.drives = [];
      this.isLastPage = false;
    }

    this.loading = true;
    this.driveService.getDriveCards(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (reset) {
          this.drives = response.content;
        } else {
          this.drives = [...this.drives, ...response.content];
        }
        this.totalPages = response.totalPages;
        this.isLastPage = response.last;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading drives:', error);
        this.loading = false;
      }
    });
  }

  loadMoreDrives(event?: any) {
    if (!this.isLastPage) {
      this.currentPage++;
      this.loadDrives();
    }
    
    if (event) {
      event.target.complete();
      
      // Disable infinite scroll when all data is loaded
      if (this.isLastPage) {
        event.target.disabled = true;
      }
    }
  }

  getDriverName(drive: DriveCard): string {
    return `${drive.driverFirstName} ${drive.driverLastName}`;
  }

  getFromLocation(drive: DriveCard): string {
    return drive.fromAddress.neighborhood || drive.fromAddress.locationName;
  }

  getToLocation(drive: DriveCard): string {
    return drive.toAddress.locationName || drive.toAddress.neighborhood;
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
    this.router.navigate(['/ride-details', drive.id]);
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
        // Already on home
        break;
      case 'drives':
        this.router.navigate(['/add-drive']);
        break;
      case 'my-bookings':
        this.router.navigate(['/my-bookings']);
        break;
      case 'driver-requests':
        this.router.navigate(['/driver-requests']);
        break;
      case 'settings':
        // TODO: Navigate to settings page when implemented
        console.log('Settings feature coming soon');
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }

  handleAddRide() {
    this.router.navigate(['/add-drive']);
  }
}
