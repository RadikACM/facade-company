import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly error = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  async onSubmit(): Promise<void> {
    this.error.set(null);
    this.isSubmitting.set(true);

    try {
      await this.authService.login(this.email.trim(), this.password);
      const isAllowedAdmin = await this.authService.checkIsAdminNow(); 

      if (!isAllowedAdmin) {
        await this.authService.logout();
        this.error.set('У вас нет прав администратора.');
        return;
      }

      await this.router.navigate(['/admin']);
    } catch (err: any) {
      this.error.set('Неверный email или пароль.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}