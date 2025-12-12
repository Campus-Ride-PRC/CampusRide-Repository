import {Component, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
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

        <!-- Butoane principale (sus) -->
        <div class="mt-[32px] p-4 space-y-2 flex-1">
          <app-primary-button
            *ngFor="let item of mainItems"
            [label]="item.label"
            [icon]="item.icon"
            [iconPosition]="item.iconPosition || 'left'"
            [textAlign]="item.textAlign || 'start'"
            class="w-full"
            variant="transparent"
            (onClick)="onItemClick(item.id)"
            customClass="ps-[32px]">
          </app-primary-button>
        </div>

        <!-- Butoane secundare (jos) -->
        <div class="p-4 space-y-2 border-t border-[#2a2a2a]">
          <app-primary-button
            *ngFor="let item of secondaryItems"
            [label]="item.label"
            [icon]="item.icon"
            [iconPosition]="item.iconPosition || 'left'"
            [textAlign]="item.textAlign || 'start'"
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
export class SidePanelComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() itemClicked = new EventEmitter<string>();

  /** Icon-urile vor fi SafeHtml */
  homeIcon!: SafeHtml;
  settingsIcon!: SafeHtml;
  logoutIcon!: SafeHtml;
  bookingsIcon!: SafeHtml;
  requestsIcon!: SafeHtml;
  profileIcon!: SafeHtml;

  /** Butoanele principale și secundare */
  mainItems: PanelItem[] = [];
  secondaryItems: PanelItem[] = [];
  drivesIcon: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    // Sanitizăm SVG-urile pentru Angular
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

    this.drivesIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="#ffffffff"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="#ffffffff" d="M16.42 4a2 2 0 0 1 1.649.868l.087.14l3.58 6.265a2 2 0 0 1 .256.82l.008.173v4.498a2 2 0 0 1-.136.725l-.075.17l-1.118 2.235a2 2 0 0 1-1.628 1.1l-.161.006H17a2 2 0 0 1-1.995-1.85L15 19H9a2 2 0 0 1-1.85 1.995L7 21H5.118a2 2 0 0 1-1.71-.964l-.079-.142l-1.118-2.236a2 2 0 0 1-.202-.709L2 16.764v-4.498a2 2 0 0 1 .184-.838l.08-.155l3.58-6.265a2 2 0 0 1 1.572-1.001L7.58 4h8.84Zm0 2H7.58L4 12.266v4.498L5.118 19H7v-.9a1.1 1.1 0 0 1 .98-1.094L8.1 17h7.8a1.1 1.1 0 0 1 1.094.98l.006.12v.9h1.882L20 16.764v-4.498L16.42 6Zm.134 5.105a1 1 0 0 1 1.34.448a1.01 1.01 0 0 1-.448 1.342C15.802 13.715 13.81 14 12 14c-1.846 0-3.77-.282-5.442-1.103a1.017 1.017 0 0 1-.452-1.344a1.008 1.008 0 0 1 1.24-.489l.267.115l.244.097l.219.08l.26.086l.302.092l.34.091l.377.09l.411.082A12.41 12.41 0 0 0 12 12c1.516 0 3.169-.232 4.555-.895Z"/></g></svg>
    `);

    this.bookingsIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    `);

    this.requestsIcon = this.sanitizer.bypassSecurityTrustHtml(`
      <svg class="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
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


    // Setăm array-urile de butoane
    this.mainItems = [
      {id: 'home', label: 'Home', icon: this.homeIcon, iconPosition: 'left', textAlign: 'start'},
      {id: 'drives', label: 'Add a ride', icon: this.drivesIcon, iconPosition: 'left', textAlign: 'start'},
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

  closePanel() {
    this.closed.emit();
  }

  onItemClick(itemId: string) {
    this.itemClicked.emit(itemId);
    this.closePanel();
  }
}
