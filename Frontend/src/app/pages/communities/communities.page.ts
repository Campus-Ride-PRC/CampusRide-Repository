import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';
import { SidePanelComponent } from '../../shared/components/panel/side-panel.component';
import { Profile } from '../../core/services/profile';
import { UserResponse } from '../../core/models/userResponse';
import { AuthService } from '../../core/services/auth.service';
import { RedirectService } from '../../core/services/redirect.service';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.page.html',
  styleUrls: ['./communities.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, AppHeaderComponent, SidePanelComponent]
})
export class CommunitiesPage implements OnInit {
  readonly isPanelOpen = signal(false);
  user: UserResponse | null = null;

  constructor(
    private profileService: Profile,
    private authService: AuthService,
    private router: Router,
    private redirectService: RedirectService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.profileService.getLoggedUser().subscribe({
      next: (response: UserResponse) => {
        this.user = response;
      },
      error: (error: any) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  togglePanel() {
    this.isPanelOpen.set(!this.isPanelOpen());
  }

  closePanel() {
    this.isPanelOpen.set(false);
  }

  onMenuItemClick(itemId: string) {
    console.log('Menu item clicked:', itemId);
    this.redirectService.redirect('communities', itemId);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
