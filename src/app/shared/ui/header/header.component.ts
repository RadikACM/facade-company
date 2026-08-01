import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  readonly isAdmin = this.authService.isAdmin;
  isMenuOpen = signal<boolean>(false);

  toggleMenu() {
    this.isMenuOpen.update((prev) => !prev);
    this.updateBodyScroll();
  }

  closeMenu() {
    this.isMenuOpen.set(false);
    this.updateBodyScroll();
  }

  private updateBodyScroll() {
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
