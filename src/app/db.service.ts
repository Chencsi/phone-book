import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from './types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DbService {

  baseUrl = "http://localhost:3000/";
  contacts: Contact[];
  onContactsLoaded: Subject<boolean> = new Subject<boolean>;

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  async getContacts(): Promise<Contact[]> {
    if (this.contacts !== undefined) {
      return this.contacts;
    }
    await new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}contacts`).subscribe((resp) => {
        this.contacts = resp as Contact[];
        this.onContactsLoaded.next(true);
        resolve(null);
      });
    });
    return this.contacts;
  }

  loadBook() {
    let data: any = localStorage.getItem('contacts');
    if (data !== null) {
      this.contacts = JSON.parse(data);
    }
  }

  saveBook() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  addContact(contact: Contact) {
    this.contacts.push(contact)
    this.saveBook();
  }

  removeContact(id: number) {
    const index = this.contacts.findIndex((contact) => contact.id === id);
    this.contacts.splice(index, 1);
    this.saveBook();
  }
}
