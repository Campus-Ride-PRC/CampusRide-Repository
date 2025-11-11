import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <!-- Overlay -->
    <div
      *ngIf="isOpen"
      class="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[999]"
      (click)="closePanel()">
    </div>

    <!-- Panel -->
    <div
      class="absolute top-0 left-0 h-screen w-[260px] bg-[#1f1f1f] text-white shadow-xl transform transition-transform duration-300 ease-in-out z-[1000]"
      [class.-translate-x-full]="!isOpen">
      
      <!-- List -->
      <div class="p-4 space-y-3 overflow-y-auto h-full">
        <button class="h-[100px] block w-full text-left hover:bg-[#2a2a2a] px-3 py-2 rounded">Profil</button>
        <button class="h-[100px] block w-full text-left hover:bg-[#2a2a2a] px-3 py-2 rounded">Setări</button>
        <button class="h-[100px] block w-full text-left hover:bg-[#2a2a2a] px-3 py-2 rounded">Logout</button>
      </div>
    </div>
  `
})
export class SidePanelComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  closePanel() {
    this.closed.emit();
  }
}
