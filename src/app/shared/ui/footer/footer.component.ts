import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  contactService = inject(ContactService);

  contacts$ = this.contactService.getContacts();

  getTelegramUrl(input: string | undefined): string {
    if (!input) return '';

    const trimmed = input.trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    const cleanUsername = trimmed.replace(/^@/, '');

    return `https://t.me/${cleanUsername}`;
  }
}
