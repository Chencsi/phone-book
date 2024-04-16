import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from './types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private baseUrl = "http://localhost:3000/";
  private contacts: Contact[];
  public onContactsLoaded: Subject<boolean> = new Subject<boolean>;
  public onContactsChanged: Subject<boolean> = new Subject<boolean>;
  constructor(private http: HttpClient) {
    this.fetchContacts();
    const ls = localStorage.getItem('contacts');
    if (ls !== null) {
      this.contacts = JSON.parse(ls);
    }
  }

  async fetchContacts(): Promise<Contact[]> {
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

  getContacts() : Contact[] {
    return this.contacts;
  }

  loadBook() : void {
    let data: any = localStorage.getItem('contacts');
    if (data !== null) {
      this.contacts = JSON.parse(data);
    }
  }

  saveBook() : void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  addContact(contact: Contact) : void {
    this.contacts.push(contact)
    this.saveBook();
  }

  removeContact(id: number) : void {
    const index = this.contacts.findIndex((contact) => contact.id === id);
    this.contacts.splice(index, 1);
    this.saveBook();
  }
}
