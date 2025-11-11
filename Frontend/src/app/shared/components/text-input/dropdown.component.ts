import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface DropdownOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ],
  template: `
  <div class="flex justify-center w-full">
    <div [style.width]="width" class="relative">
      <label *ngIf="label" class="block text-[14px] font-medium text-gray-300 mb-2">
        {{ label }}
      </label>
      
      <!-- Dropdown trigger -->
      <div
        (click)="toggleDropdown()"
        [style.height]="height"
        class="w-full bg-[#2a2a2c] text-[#e0e0e0] rounded-[16px] px-[10px] py-3 text-[16px]
         border-2 border-[#e0e0e0] cursor-pointer flex items-center justify-between"
         [class.opacity-50]="disabled"
         [class.cursor-not-allowed]="disabled">
        <span [class.text-gray-500]="!selectedLabel">
          {{ selectedLabel || placeholder }}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
          [class.rotate-180]="isOpen"
          class="transition-transform">
          <path fill="#e0e0e0" d="M6 9L1 4h10z"/>
        </svg>
      </div>

      <!-- Dropdown menu -->
      <div
        *ngIf="isOpen"
        [style.height]="dropdownHeight"
        class="absolute z-50 w-full mt-1 bg-[#2a2a2c] border-2 border-[#e0e0e0] rounded-[16px] overflow-y-auto shadow-lg">
        <div
          *ngFor="let option of options"
          (click)="selectOption(option)"
          [style.height]="optionHeight"
          class="px-[10px] flex items-center text-[16px] text-[#e0e0e0] cursor-pointer hover:bg-[#3a3a3c] transition-colors"
          [class.bg-[#3a3a3c]]="value === option.value">
          {{ option.label }}
        </div>
      </div>

      <p *ngIf="errorMessage" class="text-red-400 text-[12px] mt-1">
        {{ errorMessage }}
      </p>
    </div>
  </div>
`,
  styles: [`
    /* Custom scrollbar */
    div::-webkit-scrollbar {
      width: 8px;
    }
    div::-webkit-scrollbar-track {
      background: #1a1a1c;
      border-radius: 8px;
    }
    div::-webkit-scrollbar-thumb {
      background: #4a4a4c;
      border-radius: 8px;
    }
    div::-webkit-scrollbar-thumb:hover {
      background: #5a5a5c;
    }
  `]
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() name: string = 'dropdown-' + Math.random();
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() options: DropdownOption[] = [];
  @Input() disabled: boolean = false;
  @Input() width: string = '100%';
  @Input() height: string = '48px';
  @Input() optionHeight: string = '24px';
  @Input() dropdownHeight: string = '200px';
  @Input() errorMessage: string = '';
  
  @Output() valueChange = new EventEmitter<string | number>();

  isOpen: boolean = false;
  private _value: string | number = '';
  
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private elementRef: ElementRef) {}

  get value(): string | number {
    return this._value;
  }

  set value(val: string | number) {
    this._value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  get selectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.value);
    return selected ? selected.label : '';
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: DropdownOption) {
    this.value = option.value;
    this.isOpen = false;
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  writeValue(value: string | number): void {
    this._value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}