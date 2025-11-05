import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [disabled]="disabled"
      (click)="handleClick()"
      [style.width]="width"
      [style.height]="height"
      [style.border-color]="hasBorder ? borderColor : 'transparent'"
      class="bg-[#1a1a1a] text-[#e0e0e0] rounded-[16px] text-[16px] font-medium transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border-2"
      [ngClass]="customClass">
      {{ label }}
    </button>
  `
})
export class PrimaryButtonComponent {
  @Input() label: string = 'Button';
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';
  @Input() width: string = '100%';
  @Input() height: string = '48px';
  @Input() hasBorder: boolean = false;
  @Input() borderColor: string = '#e0e0e0';
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}