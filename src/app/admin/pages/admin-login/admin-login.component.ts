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
      // 1. Входим и получаем объект UserCredential
      const userCredential = await this.authService.login(this.email.trim().toLowerCase(), this.password);

      // 2. Проверяем email пользователя напрямую из ответа Firebase
      const isAllowedAdmin = this.authService.isUserAdmin(userCredential.user);

      if (!isAllowedAdmin) {
        await this.authService.logout();
        this.error.set('У вас нет прав администратора.');
        return;
      }

      await this.router.navigate(['/admin']);
    } catch (err: any) {
      console.error('Login error:', err);
      // Обработка конкретных ошибок Firebase (опционально)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        this.error.set('Неверный email или пароль.');
      } else {
        this.error.set('Произошла ошибка при входе. Попробуйте снова.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}