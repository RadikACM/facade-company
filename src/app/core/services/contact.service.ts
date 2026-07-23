import { inject, Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, shareReplay } from 'rxjs';
import { ContactData } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly firestore = inject(Firestore);

  getContacts(): Observable<ContactData> {
    const ref = doc(this.firestore, 'settings', 'contacts') as any;
    const raw = docData<ContactData>(ref) as unknown as Observable<
      ContactData | undefined
    >;
    return raw.pipe(shareReplay(1)) as unknown as Observable<ContactData>;
  }

  // Обновляем или создаем документ, если его еще нет (setDoc с ключом merge)
  async saveContacts(contacts: ContactData): Promise<any> {
    const ref = doc(this.firestore, 'settings', 'contacts') as any;
    return await setDoc(ref, contacts, { merge: true });
  }
}
