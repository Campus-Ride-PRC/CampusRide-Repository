import {Component, Input, Output, EventEmitter, SimpleChanges, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {PrimaryButtonComponent} from '../../../shared/components/buttons/primary-button.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

interface PanelItem {
  id: string;
  label: string;
  icon: SafeHtml; // SVG-ul va fi SafeHtml
  iconPosition?: 'left' | 'right';
  textAlign?: 'start' | 'center';
}

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, IonicModule, PrimaryButtonComponent],
  template: `
    <!-- Overlay -->
    <div
      *ngIf="isOpen"
      [style.position]="'fixed'"
      [style.top]="'0'"
      [style.left]="'0'"
      [style.right]="'0'"
      [style.bottom]="'0'"
      [style.background-color]="'rgba(0, 0, 0, 0.5)'"
      [style.z-index]="'998'"
      (click)="closePanel()">
    </div>

    <!-- Panel -->
    <div
      [style.position]="'fixed'"
      [style.top]="'0'"
      [style.left]="'0'"
      [style.height]="'100vh'"
      [style.width]="'260px'"
      [style.background-color]="'#1a1a1a'"
      [style.color]="'white'"
      [style.box-shadow]="'0 10px 25px rgba(0, 0, 0, 0.3)'"
      [style.transform]="isOpen ? 'translateX(0)' : 'translateX(-100%)'"
      [style.transition]="'transform 0.3s ease-in-out'"
      [style.z-index]="'999'"
      (click)="$event.stopPropagation()">

      <div class="flex flex-col h-full">

        <!-- User Profile Header (Non-clickable) -->
        <div class="mt-[32px] px-4 pb-4 mb-2" style="padding-inline-start: 28px; padding-bottom: 16px;">
          <div class="flex items-center" style="gap: 8px;">
            <img
              [src]="userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'"
              [alt]="userFirstName"
              style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid #00B862; flex-shrink: 0;"
            />
            <div class="flex flex-col">
              <div style="font-size: 18px;">
                <span class="text-sm" style="font-weight: 500;">Hello, </span>
                <span class="text-base text-white" style="font-weight: 600;">{{ userFirstName || 'Guest' }}</span>
              </div>
              <div class="text-xs text-gray-400" style="font-weight: 600; font-size: 12px;">
                <span>{{ ridesCount }} rides</span>
                <span> • </span>
                <span>{{ friendsCount }} friends</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Butoane principale (sus) -->
        <div class="px-4 space-y-2 flex-1">
          <app-primary-button
            *ngFor="let item of mainItems"
            [label]="item.label"
            [icon]="item.icon"
            [iconPosition]="item.iconPosition || 'left'"
            [textAlign]="item.textAlign || 'start'"
            [hasBorder]="isActiveRoute(item.id)"
            [borderColor]="'#ffffff'"
            class="w-full"
            variant="transparent"
            (onClick)="onItemClick(item.id)"
            customClass="ps-[32px]">
          </app-primary-button>
        </div>

        <!-- Butoane secundare (jos) -->
        <div class="p-4 space-y-2">
          <app-primary-button
            *ngFor="let item of secondaryItems"
            [label]="item.label"
            [icon]="item.icon"
            [iconPosition]="item.iconPosition || 'left'"
            [textAlign]="item.textAlign || 'start'"
            [hasBorder]="isActiveRoute(item.id)"
            [borderColor]="'#ffffff'"
            class="w-full"
            variant="transparent"
            (onClick)="onItemClick(item.id)"
            customClass="ps-[32px]">
          </app-primary-button>
        </div>

      </div>
    </div>
  `
})
export class SidePanelComponent implements OnInit {
  @Input() isOpen = false;
  @Input() userFirstName: string = '';
  @Input() userAvatar: string = '';
  @Input() friendsCount: number = 0;
  @Input() ridesCount: number = 0;
  @Input() currentRoute: string = '';
  @Output() closed = new EventEmitter<void>();
  @Output() itemClicked = new EventEmitter<string>();
  @Output() rideClicked = new EventEmitter<number>();

  /** Icon-urile vor fi SafeHtml */
  homeIcon!: SafeHtml;
  settingsIcon!: SafeHtml;
  logoutIcon!: SafeHtml;
  profileIcon!: SafeHtml;
  friendsIcon!: SafeHtml;
  addRideIcon!: SafeHtml;
  rideRequestsIcon!: SafeHtml;
  myRidesIcon!: SafeHtml;
  myBookingsIcon!: SafeHtml;

  /** Butoanele principale și secundare */
  mainItems: PanelItem[] = [];
  secondaryItems: PanelItem[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.homeIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    `);

    this.settingsIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    `);

    this.logoutIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/>
      </svg>
    `);

    this.profileIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4.5 20.25a8.25 8.25 0 0115 0" />
      </svg>
    `);

    this.friendsIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    `);

    this.addRideIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 4v16m8-8H4"/>
      </svg>
    `);

    this.rideRequestsIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    `);

    this.myRidesIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
      </svg>
    `);

    this.myBookingsIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    `);

    this.mainItems = [
      {id: 'home', label: 'Home', icon: this.homeIcon, iconPosition: 'left', textAlign: 'start'},
      {id: 'friends', label: 'Friends', icon: this.friendsIcon, iconPosition: 'left', textAlign: 'start'},
      {id: 'add-ride', label: 'Add a Ride', icon: this.addRideIcon, iconPosition: 'left', textAlign: 'start'},
      {id: 'ride-requests', label: 'Ride Requests', icon: this.rideRequestsIcon, iconPosition: 'left', textAlign: 'start'},
      {id: 'my-rides', label: 'My Rides', icon: this.myRidesIcon, iconPosition: 'left', textAlign: 'start'},
      {id: 'my-bookings', label: 'My Bookings', icon: this.myBookingsIcon, iconPosition: 'left', textAlign: 'start'},
    ];

    this.secondaryItems = [
      {id: 'profile', label: 'Profile', icon: this.profileIcon, iconPosition: 'left', textAlign: 'start'},
      {id: 'settings', label: 'Settings', icon: this.settingsIcon, iconPosition: 'left', textAlign: 'start'},
      {id: 'logout', label: 'Log out', icon: this.logoutIcon, iconPosition: 'left', textAlign: 'start'}
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('SidePanel isOpen changed to:', this.isOpen);
  }

  isActiveRoute(itemId: string): boolean {
    // Map route paths to menu item IDs
    const routeMap: { [key: string]: string } = {
      '/home': 'home',
      '/friends': 'friends',
      '/add-drive': 'add-ride',
      '/driver-requests': 'ride-requests',
      '/my-rides': 'my-rides',
      '/my-bookings': 'my-bookings',
      '/profile': 'profile',
      '/settings': 'settings'
    };

    return routeMap[this.currentRoute] === itemId;
  }

  closePanel() {
    this.closed.emit();
  }

  onItemClick(itemId: string) {
    this.itemClicked.emit(itemId);
    this.closePanel();
  }

  onRideClick(rideId: number) {
    this.rideClicked.emit(rideId);
    this.closePanel();
  }
}
