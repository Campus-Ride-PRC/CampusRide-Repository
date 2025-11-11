import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

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
      class="bg-[#1a1a1a] text-[#e0e0e0] font-[600] rounded-[16px] text-[16px] font-medium transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center border-2"
      [ngClass]="customClass"
      [style.justifyContent]="textAlign === 'center' ? 'center' : 'flex-start'">

      <ng-container *ngIf="icon && iconPosition === 'left'">
        <span class="mr-2" [innerHTML]="icon"></span>
      </ng-container>

      {{ label }}

      <ng-container *ngIf="icon && iconPosition === 'right'">
        <span class="ml-2" [innerHTML]="icon"></span>
      </ng-container>

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

  @Input() icon?: SafeHtml; // SVG-ul ca SafeHtml
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() textAlign: 'start' | 'center' = 'center';

  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}
