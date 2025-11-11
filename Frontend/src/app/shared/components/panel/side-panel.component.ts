import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
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
    class="fixed inset-0 bg-black bg-opacity-50 z-[999]"
    (click)="closePanel()">
  </div>

  <!-- Panel -->
  <div
    class="absolute top-0 left-0 h-screen w-[260px] bg-[#1f1f1f] text-white shadow-xl transform transition-transform duration-300 ease-in-out z-[1000]"
    [style.transform]="isOpen ? 'translateX(0)' : 'translateX(-100%)'">
    
    <!-- Header -->
    <div class="p-6 border-b border-[#2a2a2a]">
      <h2 class="text-[20px] font-[700] text-[#e0e0e0]">Menu</h2>
    </div>

    <!-- List -->
    <div class="p-4 space-y-2 overflow-y-auto" style="height: calc(100vh - 80px);">
      <button 
        (click)="onItemClick('profile')"
        class="block w-full text-left hover:bg-[#2a2a2a] px-4 py-3 rounded-lg transition-colors text-[16px] font-[500]">
        Profil
      </button>
      <button 
        (click)="onItemClick('settings')"
        class="block w-full text-left hover:bg-[#2a2a2a] px-4 py-3 rounded-lg transition-colors text-[16px] font-[500]">
        Setări
      </button>
      <button 
        (click)="onItemClick('logout')"
        class="block w-full text-left hover:bg-[#2a2a2a] px-4 py-3 rounded-lg transition-colors text-[16px] font-[500] text-red-400">
        Logout
      </button>
    </div>
  </div>
  `
})
export class SidePanelComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() itemClicked = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    console.log('SidePanel isOpen changed to:', this.isOpen);
    console.log('Changes:', changes);
  }

  closePanel() {
    this.closed.emit();
  }

  onItemClick(item: string) {
    this.itemClicked.emit(item);
    this.closePanel();
  }
}