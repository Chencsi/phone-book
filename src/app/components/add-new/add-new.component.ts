import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DbService } from '../../db.service';
import { Contact } from '../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new',
  standalone: true,
  imports: [ReactiveFormsModule],
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
    const contact = {
      id: this.db.nexId,
      name: value.name as string,
      phone: value.phone as string,
      email: value.email as string
    }
    this.db.addContact(contact)
  }
}
