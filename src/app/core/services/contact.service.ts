import { inject, Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, shareReplay } from 'rxjs';
import { ContactData } from '../models/contact.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly firestore = inject(Firestore);
  private readonly contactDocRef = doc(this.firestore, 'settings', 'contacts');

  readonly contacts$: Observable<ContactData> = docData(this.contactDocRef) as Observable<ContactData>;

  readonly contacts = toSignal(this.contacts$, { initialValue: null });

  getContacts(): Observable<ContactData> {
    return this.contacts$;
  }

  async saveContacts(contacts: ContactData): Promise<void> {
    return await setDoc(this.contactDocRef, contacts, { merge: true });
  }
}
