import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PrimaryButtonComponent } from '../../../shared/components/buttons/primary-button.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
      class="fixed inset-0 bg-black bg-opacity-50 z-[999]"
      (click)="closePanel()">
    </div>

    <!-- Panel -->
    <div
      class="absolute top-0 left-0 h-screen w-[260px] bg-[#1a1a1a] text-white shadow-xl transform transition-transform duration-300 ease-in-out z-[1000]"
      [style.transform]="isOpen ? 'translateX(0)' : 'translateX(-100%)'">

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

  /** Butoanele principale și secundare */
  mainItems: PanelItem[] = [];
  secondaryItems: PanelItem[] = [];

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
      <svg class="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/>
      </svg>
    `);

    // Setăm array-urile de butoane
    this.mainItems = [
      { id: 'home', label: 'Home', icon: this.homeIcon, iconPosition: 'left', textAlign: 'start' }
    ];

    this.secondaryItems = [
      { id: 'settings', label: 'Settings', icon: this.settingsIcon, iconPosition: 'left', textAlign: 'start' },
      { id: 'logout', label: 'Log out', icon: this.logoutIcon, iconPosition: 'left', textAlign: 'start' }
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
