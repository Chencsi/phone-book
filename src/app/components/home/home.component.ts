import { Component, inject } from '@angular/core';
import { DbService } from '../../db.service';
import { Contact } from '../../types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public db: DbService
  public contacts: Contact[];
  constructor(){
    this.db = inject(DbService);
    if (this.db.getContacts() === undefined) {
      this.db.onContactsLoaded.subscribe(() => {
        this.updateContacts();
      })
    }
    else {
      this.updateContacts();
    }
  }

  updateContacts() {
    this.contacts = this.db.getContacts();
  }
}
