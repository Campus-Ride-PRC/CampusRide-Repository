import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col items-center w-full">
      <label *ngIf="label" class="block text-[14px] font-medium text-gray-300 mb-3">
        {{ label }}
      </label>
      <div class="flex justify-center" [style.gap]="gap">
        <input
          *ngFor="let digit of digits; let i = index"
          #digitInput
          type="text"
          [name]="'text-input-' + i"
          inputmode="numeric"
          maxlength="1"
          [value]="digits[i]"
          (input)="onInput($event, i)"
          (keydown)="onKeyDown($event, i)"
          (paste)="onPaste($event)"
          [style.width]="cellWidth"
          [style.height]="cellHeight"
          class="bg-[#2a2a2c] text-[#e0e0e0] text-center text-[24px] font-medium rounded-[12px] border-2 border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#e0e0e0] focus:border-[#e0e0e0]"
        />
      </div>
      <p *ngIf="errorMessage" class="text-red-400 text-[12px] mt-2">
        {{ errorMessage }}
      </p>
    </div>
  `
})
export class OtpInputComponent {
  @Input() length: number = 6;
  @Input() label: string = '';
  @Input() cellWidth: string = '48px';
  @Input() cellHeight: string = '56px';
  @Input() gap: string = '8px'; // Padding între coloane
  @Input() errorMessage: string = '';
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();
  
  @ViewChildren('digitInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  
  digits: string[] = [];

  ngOnInit() {
    this.digits = Array(this.length).fill('');
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Only digits
    
    this.digits[index] = value;
    
    if (value && index < this.length - 1) {
      // Move to next input
      const nextInput = this.inputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }
    
    this.emitValue();
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    
    // Handle backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.inputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.focus();
        this.digits[index - 1] = '';
        this.emitValue();
      }
    }
    
    // Handle arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      this.inputs.toArray()[index - 1].nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < this.length - 1) {
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').replace(/[^0-9]/g, '') || '';
    
    for (let i = 0; i < Math.min(pastedData.length, this.length); i++) {
      this.digits[i] = pastedData[i];
    }
    
    // Focus last filled input or last input
    const focusIndex = Math.min(pastedData.length, this.length - 1);
    setTimeout(() => {
      this.inputs.toArray()[focusIndex]?.nativeElement.focus();
    }, 0);
    
    this.emitValue();
  }

  emitValue() {
    const value = this.digits.join('');
    this.valueChange.emit(value);
    
    if (value.length === this.length) {
      this.complete.emit(value);
    }
  }

  clear() {
    this.digits = Array(this.length).fill('');
    this.inputs.toArray()[0]?.nativeElement.focus();
    this.emitValue();
  }
}