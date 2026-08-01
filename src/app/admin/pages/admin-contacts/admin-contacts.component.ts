import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ContactData } from '../../../core/models/contact.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-admin-contacts',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-contacts.component.html',
  styleUrl: './admin-contacts.component.scss'
})
export class AdminContactsComponent implements OnInit, OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();

  isLoading = true;

  form = this.fb.group({
    phone: ['', Validators.required],
    phoneWp: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    adressUrl: ['', Validators.required],
    workingHours: ['', Validators.required],
    instagramUrl: [''],
    telegramUrl: [''],
  });

  ngOnInit(): void {
    // Получаем текущие контакты из базы и заполняем форму
    this.contactService.getContacts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.form.patchValue(data);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки контактов:', err);
          this.isLoading = false;
        }
      });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      const updatedContacts = this.form.getRawValue() as ContactData;
      await this.contactService.saveContacts(updatedContacts);
      this.snackBar.open('Контакты сохранены', 'OK', { duration: 3000 });
    } catch (error) {
      console.error(error);
      this.snackBar.open('Ошибка', 'Упс');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
