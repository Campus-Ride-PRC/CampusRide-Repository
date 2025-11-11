import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="bg-[#1e1e1e]">
        <div class="flex items-center gap-4 pe-4 ps-[20px]">
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
            CampusRide
          </p>
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

  onMenuClick() {
    this.menuClick.emit();
  }
}
