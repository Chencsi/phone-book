import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneInput]',
  standalone: true
})
export class PhoneInputDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target;
    const value = input.value;
    const newValue = value.split('');
    let lastChar = newValue[newValue.length - 1];
    lastChar = parseInt(lastChar);
    
    if (Number.isNaN(lastChar) || value.length > 11) {
      newValue[newValue.length - 1] = '';
    }

    input.value = newValue.join('');
  }

}
