import { Component, inject } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  private readonly firestore = inject(Firestore);
  private _snackBar = inject(MatSnackBar);

  saveContacts(): void {
    const contactsData = {
      email: '',
      phone: '',
      address: '',
    };

    const ref = doc(this.firestore, 'settings', 'contacts') as any;
    setDoc(ref, contactsData, { merge: true })
      .then(() => {
        this._snackBar.open('Contacts saved successfully.', 'Close', {
          duration: 3000,
        });
      })
      .catch((error) => {
        this._snackBar.open('Error saving contacts.', 'Close', {
          duration: 3000,
        });
        console.error('Error saving contacts:', error);
      });
  }
}
