import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
          inputmode="numeric"
          maxlength="1"
          [name]="'otp-' + i"
          [value]="digits[i]"
          (input)="onInput($event, i)"
          (keydown)="onKeyDown($event, i)"
          (paste)="onPaste($event)"
          (focus)="onFocus($event)"
          [style.width]="cellWidth"
          [style.height]="cellHeight"
          class="bg-[#2a2a2c] text-[#e0e0e0] text-center text-[24px] font-medium rounded-[12px] border-2 border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#e0e0e0]"
        />
      </div>
      <p *ngIf="errorMessage" class="text-red-400 text-[12px] mt-2">
        {{ errorMessage }}
      </p>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true
    }
  ]
})
export class OtpInputComponent implements ControlValueAccessor {
  @Input() length = 6;
  @Input() label = '';
  @Input() cellWidth = '48px';
  @Input() cellHeight = '56px';
  @Input() gap = '8px';
  @Input() errorMessage = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();

  @ViewChildren('digitInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  digits: string[] = [];

  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.digits = Array(this.length).fill('');
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    if (value) {
      this.digits = value.split('').slice(0, this.length);
      setTimeout(() => {
        this.updateInputValues();
      }, 0);
    } else {
      this.digits = Array(this.length).fill('');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.inputs?.forEach((input) => (input.nativeElement.disabled = isDisabled));
  }

  // Logic
  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    
    // Dacă am pus deja această valoare, skip (previne dublarea)
    if (value && this.digits[index] === value) {
      return;
    }

    // Ia doar ultima cifră dacă user-ul scrie mai multe
    const digit = value.slice(-1);
    
    // Actualizează digits array
    this.digits[index] = digit;
    
    // Forțează valoarea corectă în input
    input.value = digit;

    // Mută focus la următorul input dacă există cifră
    if (digit && index < this.length - 1) {
      setTimeout(() => {
        const next = this.inputs.toArray()[index + 1];
        next?.nativeElement.focus();
        next?.nativeElement.select();
      }, 0);
    }

    this.emitValue();
  }

  onFocus(event: Event) {
    const input = event.target as HTMLInputElement;
    // Selectează tot conținutul când dai focus
    setTimeout(() => input.select(), 0);
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    // Backspace - șterge și mergi înapoi
    if (event.key === 'Backspace') {
      event.preventDefault();
      
      if (input.value) {
        // Dacă există valoare, șterge-o
        this.digits[index] = '';
        input.value = '';
        this.emitValue();
      } else if (index > 0) {
        // Dacă nu există valoare, mergi la anteriorul și șterge
        const prevInput = this.inputs.toArray()[index - 1];
        if (prevInput) {
          prevInput.nativeElement.focus();
          this.digits[index - 1] = '';
          prevInput.nativeElement.value = '';
          this.emitValue();
        }
      }
    }

    // Arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.inputs.toArray()[index - 1].nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < this.length - 1) {
      event.preventDefault();
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '') || '';

    for (let i = 0; i < Math.min(pasted.length, this.length); i++) {
      this.digits[i] = pasted[i];
    }

    this.updateInputValues();
    this.emitValue();
    
    const focusIndex = Math.min(pasted.length, this.length - 1);
    setTimeout(() => this.inputs.toArray()[focusIndex]?.nativeElement.focus(), 0);
  }

  updateInputValues() {
    this.inputs?.forEach((input, i) => {
      input.nativeElement.value = this.digits[i] || '';
    });
  }

  emitValue() {
    const value = this.digits.join('');
    this.onChange(value);
    this.valueChange.emit(value);

    if (value.length === this.length) {
      this.complete.emit(value);
    }
  }
}