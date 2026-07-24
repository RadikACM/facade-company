import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  private readonly contactService = inject(ContactService);
  contacts$ = this.contactService.getContacts();
}