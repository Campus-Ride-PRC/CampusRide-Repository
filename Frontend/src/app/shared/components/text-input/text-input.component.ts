import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ],
  template: `
  <div class="flex justify-center w-full">
    <div [style.width]="width" [ngClass]="customClass">
      <label *ngIf="label" class="block text-[14px] font-medium text-gray-300 mb-2">
        {{ label }}
      </label>
      <input
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [(ngModel)]="value"
        (blur)="onTouched()"
        [style.height]="height"
        class="w-full bg-[#2a2a2c] text-[#e0e0e0] rounded-[16px] px-[10px] py-3 text-[16px]
         focus:outline-none focus:ring-2 focus:ring-[#e0e0e0]
         disabled:opacity-50 disabled:cursor-not-allowed
         placeholder:text-gray-500 border-2 border-[#e0e0e0]"
      />
      <p *ngIf="errorMessage" class="text-red-400 text-[12px] mt-1">
        {{ errorMessage }}
      </p>
    </div>
  </div>
`
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() width: string = '100%';
  @Input() height: string = '48px';
  @Input() errorMessage: string = '';
  @Input() customClass: string = '';
  
  @Output() valueChange = new EventEmitter<string>();

  private _value: string = '';
  
  onChange: any = () => {};
  onTouched: any = () => {};

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  writeValue(value: string): void {
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