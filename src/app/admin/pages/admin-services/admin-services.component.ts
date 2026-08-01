import { Component, inject, signal } from '@angular/core';
import { ServiceService } from '../../../core/services/service.service';
import { Service } from '../../../core/models/service.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.scss'
})
export class AdminServicesComponent {
  private serviceService = inject(ServiceService);
  private storage = inject(Storage);
  private _snackbar = inject(MatSnackBar);

  readonly isModalOpen = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly editingServiceId = signal<string | null>(null);
  readonly isUploading = signal<boolean>(false);

  readonly services = this.serviceService.services;

  readonly serviceForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    slug: new FormControl('', { nonNullable: true }),
    shortDescription: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true }),
    order: new FormControl(0, { nonNullable: true }),
    isPublished: new FormControl(false, { nonNullable: true }),
    deliveryWeeks: new FormControl(4, { nonNullable: true }),
  });

  private readonly emptyFormValue = {
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    imageUrl: '',
    order: 0,
    isPublished: false,
    deliveryWeeks: 4
  };

  openModal(): void {
    this.isEditing.set(false);
    this.editingServiceId.set(null);
    this.serviceForm.reset(this.emptyFormValue);
    this.isModalOpen.set(true);
  }

  openEditModal(service: Service): void {
    this.isEditing.set(true);
    this.editingServiceId.set(service.id);
    this.serviceForm.reset({
      title: service.title ?? '',
      slug: service.slug ?? '',
      shortDescription: service.shortDescription ?? '',
      description: service.description ?? '',
      imageUrl: service.imageUrl ?? '',
      order: service.order ?? 0,
      isPublished: service.isPublished ?? false,
      deliveryWeeks: service.deliveryWeeks ?? 4
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.isEditing.set(false);
    this.editingServiceId.set(null);
    this.serviceForm.reset(this.emptyFormValue);
  }

  async submitForm(): Promise<void> {
    if (this.serviceForm.invalid) return;

    const raw = this.serviceForm.getRawValue();

    const servicePayload: Omit<Service, 'id'> = {
      title: raw.title,
      slug: raw.slug || this.buildSlug(raw.title),
      shortDescription: raw.shortDescription,
      description: raw.description,
      imageUrl: raw.imageUrl,
      order: Number(raw.order),
      isPublished: raw.isPublished,
      deliveryWeeks: Number(raw.deliveryWeeks),
    };

    try {
      if (this.isEditing() && this.editingServiceId()) {
        await this.serviceService.updateService(this.editingServiceId()!, servicePayload);
        this._snackbar.open('Услуга обновлена', 'OK', { duration: 2500 });
      } else {
        await this.serviceService.createService(servicePayload as Service);
        this._snackbar.open('Услуга создана', 'OK', { duration: 2500 });
      }
      
      this.closeModal();
    } catch (err) {
      console.error('Failed to save service', err);
      this._snackbar.open('Ошибка при сохранении услуги', 'Упс');
    }
  }

  async deleteService(serviceId: string): Promise<void> {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        await firstValueFrom(this.serviceService.deleteService(serviceId));
        this._snackbar.open('Услуга удалена', 'OK', { duration: 2500 });
      } catch (err) {
        console.error('Failed to delete service', err);
      }
    }
  }

  // Загрузка главной обложки услуги в Firebase Storage
  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.isUploading.set(true);

    try {
      const filePath = `services/${Date.now()}_${file.name}`;
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      this.serviceForm.patchValue({ imageUrl: url });
      this._snackbar.open('Изображение загружено!', 'OK', { duration: 2000 });
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      this._snackbar.open('Ошибка при загрузке файла', 'Упс');
    } finally {
      this.isUploading.set(false);
      input.value = '';
    }
  }

  private buildSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-яё]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}