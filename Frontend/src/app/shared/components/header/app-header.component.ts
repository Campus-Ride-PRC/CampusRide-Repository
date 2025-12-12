import {Component, Output, EventEmitter, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonHeader, IonIcon, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="bg-[#1e1e1e]">
        <div class="flex items-center justify-between gap-4 pe-4 ps-[20px]">
          <div class="flex items-center gap-4">
            <!-- Modern Menu Icon -->
            <span
              (click)="onMenuClick()"
              class="p-2 rounded-xl transition-colors flex items-center justify-center"
              ion-button="false"
              style="--background: transparent; --ripple-color: transparent;">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e0e0e0"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </span>
            <!-- App Name -->
            <p class="text-[#e0e0e0] text-[28px] font-[700] mt-[18px] mb-[18px] ps-[8px] tracking-tight">
              {{menuTitle}}
            </p>
          </div>
          <!-- Notification Icon -->
          <span
            (click)="onNotificationClick()"
            class="p-2 rounded-xl transition-colors flex items-center justify-center"
            ion-button="false"
            style="--background: transparent; --ripple-color: transparent; padding-inline-end: 20px;">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e0e0e0"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </span>
        </div>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [`
    ion-toolbar {
      --background: #1a1a1a;
      --border-width: 0;
      --padding-start: 0;
      --padding-end: 0;
    }
  `]
})
export class AppHeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Input({required:true}) menuTitle!: string;
  @Input() menuIcon!: string;

  onMenuClick() {
    this.menuClick.emit();
  }

  onNotificationClick() {
    this.notificationClick.emit();
  }
}
