import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  // Получаем контакты из Firestore в виде Сигнала
  readonly contacts = toSignal(this.contactService.getContacts(), { initialValue: null });

  // Форма для сборки параметров
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    objectType: ['Частный дом / Коттедж', [Validators.required]],
    area: ['', [Validators.required, Validators.min(1)]],
    comment: ['']
  });

  // Функция очистки номера от лишних символов для wa.me ссылки
  getCleanNumber(phone: string | undefined): string {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.contacts();
    const rawWaNumber = data?.phoneWp || data?.phone || '';
    const cleanNumber = this.getCleanNumber(rawWaNumber);

    if (!cleanNumber) {
      alert('Номер WhatsApp не настроен!');
      return;
    }

    const { name, objectType, area, comment } = this.form.value;

    let text = `Здравствуйте! Меня зовут *${name}*.\n`;
    text += `Интересует расчёт фасада:\n`;
    text += `• *Тип объекта:* ${objectType}\n`;
    text += `• *Площадь:* ${area} м²\n`;

    if (comment) {
      text += `• *Примечание:* ${comment}\n`;
    }

    text += `\nПодскажите ориентировочную стоимость и сроки?`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  }
}