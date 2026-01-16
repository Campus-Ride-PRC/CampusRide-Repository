import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from '../../shared/components/header/app-header.component';

@Component({
  selector: 'app-community-detail',
  templateUrl: './community-detail.page.html',
  styleUrls: ['./community-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, AppHeaderComponent]
})
export class CommunityDetailPage implements OnInit {
  communityId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.communityId = this.route.snapshot.paramMap.get('id');
    console.log('Community ID:', this.communityId);
  }

  goBack() {
    this.router.navigate(['/communities']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
