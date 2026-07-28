import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private readonly contactService = inject(ContactService);

  readonly isSidebarOpen = signal<boolean>(false);

  email = this.contactService.getContacts()
  readonly contacts = toSignal(this.contactService.getContacts());

  toggleSidebar(): void {
    this.isSidebarOpen.update(state => !state);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
