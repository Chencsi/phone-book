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
  public nexId: number = 0;
  public onContactsLoaded: Subject<boolean> = new Subject<boolean>;
  public onContactsChanged: Subject<boolean> = new Subject<boolean>;
  public onNewContactAdded: Subject<boolean> = new Subject<boolean>;
  constructor(private http: HttpClient) {
    this.fetchContacts();
    const ls = localStorage.getItem('contacts');
    if (ls !== null) {
      this.contacts = JSON.parse(ls);
    }
  }

  async fetchContacts(): Promise<Contact[]> {
    // If contacts are already loaded, return them
    if (this.contacts !== undefined) {
      return this.contacts;
    }
    // Fetch contacts from the server
    await new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}contacts`).subscribe((resp) => {
        this.contacts = resp as Contact[];
        // Finding missing ids in the contacts array
        for (let i = 0; i < this.contacts.length; i++) {
          const contact = this.contacts[i];
          if (contact.id-1 !== i) {
            this.nexId = i;
          }          
        }
        if (this.nexId === 0) {
          this.nexId = this.contacts.length + 1;
        }
        this.onContactsLoaded.next(true);
        resolve(null);
      });
    });
    return this.contacts;
  }

  getContacts(): Contact[] {
    return this.contacts;
  }

  // Get contacts from localStorage
  loadBook(): void {
    let data: any = localStorage.getItem('contacts');
    if (data !== null) {
      this.contacts = JSON.parse(data);
    }
  }

  saveBook(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  async addContact(contact: { id: number, name: string, phone: string, email: string }) {
    await new Promise((resolve, reject) => {
      this.http.post(`${this.baseUrl}contacts`, contact).subscribe((resp) => {
        this.contacts.push(resp as Contact);
        this.onNewContactAdded.next(true);
        resolve(null);
      });
    });
    this.saveBook();
  }

  removeContact(id: number): void {
    const index = this.contacts.findIndex((contact) => contact.id === id);
    this.contacts.splice(index, 1);
    this.saveBook();
  }
}
