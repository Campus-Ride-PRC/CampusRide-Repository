import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  imports: [CommonModule, IonicModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="custom-date-picker">
      <label *ngIf="label" class="picker-label">{{ label }}</label>
      <div class="button-wrapper">
        <button 
          type="button"
          class="date-select-button" 
          [class.has-value]="value"
          [class.disabled]="disabled"
          [disabled]="disabled"
          (click)="togglePicker()">
          <ion-icon name="calendar-outline" class="button-icon"></ion-icon>
          <span class="button-text">{{ getDisplayText() }}</span>
        </button>
      </div>
      <div class="picker-container" *ngIf="isOpen" [class.disabled]="disabled">
        <ion-datetime
          [value]="value"
          [presentation]="presentation"
          [min]="min"
          [max]="max"
          [disabled]="disabled"
          [preferWheel]="preferWheel"
          [showDefaultTitle]="false"
          (ionChange)="onDateChange($event)"
          class="custom-datetime">
        </ion-datetime>
      </div>
      <div *ngIf="helperText" class="helper-text">{{ helperText }}</div>
    </div>
  `,
  styles: [`
    .custom-date-picker {
      width: 100%;
      margin-bottom: 16px;
    }

    .picker-label {
      display: block;
      font-family: 'Montserrat', -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #e5e7eb;
      margin-bottom: 8px;
    }

    .button-wrapper {
      width: 100%;
      height: 50px;
      flex-shrink: 0;
    }

    .date-select-button {
      width: 100%;
      height: 100%;
      background: #2a2a2a;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Montserrat', -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 15px;
      color: #9ca3af;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .date-select-button:hover:not(.disabled) {
      border-color: rgba(0, 195, 108, 0.5);
      box-shadow: 0 0 0 3px rgba(0, 195, 108, 0.1);
    }

    .date-select-button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .date-select-button.has-value {
      color: #ffffff;
      font-weight: 500;
    }

    .button-icon {
      font-size: 20px;
      color: #00C36C;
      flex-shrink: 0;
    }

    .button-text {
      flex: 1;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .picker-container {
      background: #2a2a2a;
      border-radius: 12px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      margin-top: 8px;
      animation: slideDown 0.3s ease;
      max-width: 100%;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .picker-container.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .custom-datetime {
      --background: transparent;
      --background-rgb: 42, 42, 42;
      
      /* Text colors */
      --ion-color-base: #ffffff;
      --ion-color-contrast: #1a1a1a;
      
      /* Selected/Active state */
      --ion-color-step-200: #00C36C;
      --ion-color-step-300: #00A859;
      
      /* Wheel picker colors */
      --wheel-highlight-background: rgba(0, 195, 108, 0.15);
      --wheel-highlight-border-radius: 8px;
      
      font-family: 'Montserrat', -apple-system, Roboto, Helvetica, sans-serif;
      padding: 12px;
    }

    .custom-datetime::part(wheel-item) {
      color: #9ca3af;
      font-size: 16px;
    }

    .custom-datetime::part(wheel-item active) {
      color: #ffffff;
      font-weight: 600;
    }

    .custom-datetime::part(calendar-day) {
      color: #9ca3af;
      font-size: 14px;
    }

    .custom-datetime::part(calendar-day today) {
      color: #00C36C;
      font-weight: 600;
    }

    .custom-datetime::part(calendar-day active) {
      background: #00C36C;
      color: #ffffff;
      border-radius: 8px;
      font-weight: 600;
    }

    .custom-datetime::part(calendar-day-hover) {
      background: rgba(0, 195, 108, 0.2);
      border-radius: 8px;
    }

    .helper-text {
      font-family: 'Montserrat', -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 6px;
      padding-left: 4px;
    }
  `]
})
export class CustomDatePickerComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() title?: string;
  @Input() helperText?: string;
  @Input() presentation: 'date' | 'time' | 'date-time' | 'time-date' | 'month' | 'month-year' | 'year' = 'date';
  @Input() min?: string;
  @Input() max?: string;
  @Input() preferWheel = false;
  @Input() disabled = false;

  @Output() dateChange = new EventEmitter<string>();

  value: string | null = null;
  isOpen = false;
  
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  togglePicker() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  onDateChange(event: any) {
    const newValue = event.detail.value;
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
    this.dateChange.emit(newValue);
    // Auto-close after selection
    this.isOpen = false;
  }

  getDisplayText(): string {
    if (!this.value) {
      return 'Select';
    }

    const date = new Date(this.value);
    
    if (this.presentation === 'date') {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } else if (this.presentation === 'time') {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (this.presentation === 'date-time' || this.presentation === 'time-date') {
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (this.presentation === 'month' || this.presentation === 'month-year') {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } else if (this.presentation === 'year') {
      return date.getFullYear().toString();
    }

    return 'Select';
  }

  // ControlValueAccessor implementation
  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
