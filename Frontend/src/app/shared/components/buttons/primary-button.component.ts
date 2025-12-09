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
  (mousedown)="onPress(true)"
  (mouseup)="onPress(false)"
  (mouseleave)="onPress(false)"
  (touchstart)="onPress(true)"
  (touchend)="onPress(false)"
  [style.width]="width"
  [style.height]="height"
  [style.border-color]="getBorderColor()"
  [ngClass]="buttonClasses"
  [style.justifyContent]="textAlign === 'center' ? 'center' : 'flex-start'">

  <ng-container *ngIf="icon && iconPosition === 'left'">
    <span class="mr-2 pe-[8px]" [innerHTML]="icon"></span>
  </ng-container>

  {{ label }}

  <ng-container *ngIf="icon && iconPosition === 'right'">
    <span class="ml-2 ps-[8px]" [innerHTML]="icon"></span>
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
  @Input() variant: 'primary' | 'dark' | 'transparent' = 'dark';

  @Output() onClick = new EventEmitter<void>();

  private _isPressed: boolean = false;

  get buttonClasses(): string {
    const base = 'text-white font-[600] rounded-[16px] text-[16px] font-medium transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center border-2';
    
    let variantClass = '';
    switch (this.variant) {
      case 'primary':
        variantClass = 'bg-[#00C36C]';
        break;
      case 'transparent':
        variantClass = 'bg-transparent hover:bg-[#2A2A2C] active:bg-[#1E1E1E]';
        break;
      default: // dark
        variantClass = 'bg-[#2A2A2C] hover:bg-[#333335] active:bg-[#1E1E1E]';
        break;
    }
      
    return `${base} ${variantClass} ${this.customClass}`;
  }

  handleClick() {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }

  onPress(state: boolean) {
    this._isPressed = state;
  }

  getBorderColor(): string {
    if (this.hasBorder) {
      return this.borderColor;
    } else if (this._isPressed) {
      return this.borderColor; // border doar pe durata click-ului
    } else {
      return 'transparent';
    }
  }
}
