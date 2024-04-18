import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DbService } from '../../db.service';
import { Contact } from '../../types';
import { Router } from '@angular/router';
import { PhoneInputDirective } from '../../phone-input.directive';

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [ReactiveFormsModule, PhoneInputDirective],
  templateUrl: './add-new.component.html',
  styleUrl: './add-new.component.scss'
})
export class AddNewComponent {
  public db: DbService;
  public router: Router;
  contactForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ])
  });
  constructor() {
    this.db = inject(DbService);
    this.router = inject(Router);
    this.db.onNewContactAdded.subscribe(() => {
      this.router.navigate(['home'])
    })
  }

  onSubmit(): void {
    const value = this.contactForm.value;
    const phone = value.phone as string;

    const newValue = phone.replace('06', '+36').split('');
    let hyphenatedValue = '';

    newValue.splice(3, 0, "-")
    newValue.splice(6, 0, "-")
    newValue.splice(10, 0, "-")
    newValue.splice(13, 0, "-")

    for (let i = 0; i < newValue.length; i++) {
      const char = newValue[i];
      hyphenatedValue += char;
    }

    const contact = {
      id: this.db.nexId,
      name: value.name as string,
      phone: hyphenatedValue as string,
      email: value.email as string
    }
    this.db.addContact(contact)
  }
}
