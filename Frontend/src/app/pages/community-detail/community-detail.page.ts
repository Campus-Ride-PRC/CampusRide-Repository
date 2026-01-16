import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';
import { CommunityService } from '../../core/services/community.service';
import { Community } from '../../core/models/community.model';

@Component({
  selector: 'app-community-detail',
  templateUrl: './community-detail.page.html',
  styleUrls: ['./community-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, AppHeaderComponent]
})
export class CommunityDetailPage implements OnInit {
  communityId: string | null = null;
  community: Community | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService
  ) {}

  ngOnInit() {
    this.communityId = this.route.snapshot.paramMap.get('id');
    console.log('Community ID:', this.communityId);
    
    // Check if community data was passed via navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || window.history.state;
    
    if (state?.['community']) {
      this.community = state['community'];
      console.log('✅ Community from navigation state:', this.community);
      console.log('✅ Community name:', this.community?.name);
      console.log('✅ Member count:', this.community?.memberCount);
      console.log('✅ Full community object:', JSON.stringify(this.community, null, 2));
    } else if (this.communityId) {
      // If no state, we would need to fetch from backend
      console.log('⚠️ No community in state, would fetch from backend');
    }
  }

  goBack() {
    this.router.navigate(['/communities']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
