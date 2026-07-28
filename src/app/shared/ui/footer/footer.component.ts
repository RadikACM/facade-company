import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ContactService } from '../../../core/services/contact.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  contactService = inject(ContactService);

  contacts$ = this.contactService.getContacts()

}
