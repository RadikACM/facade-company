import { Component, inject, signal } from '@angular/core';
import { ServiceService } from '../../../core/services/service.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Service } from '../../../core/models/service.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-services',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.scss'
})
export class AdminServicesComponent {
  private serviceService = inject(ServiceService);

  readonly isModalOpen = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly editingServiceId = signal<string | null>(null);

  readonly services = this.serviceService.services;

  readonly serviceForm = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    slug: new FormControl('', { nonNullable: true }),
    shortDescription: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true }),
    order: new FormControl(0, { nonNullable: true }),
    isPublished: new FormControl(false, { nonNullable: true }),
    deliveryWeeks: new FormControl(0, { nonNullable: true }),
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
    this.serviceForm.reset(this.emptyFormValue)
  }

  async submitForm(): Promise<void> {
  if (this.serviceForm.invalid) return;

  const raw = this.serviceForm.getRawValue();

  // Формируем payload без `id`
  const servicePayload: Omit<Service, 'id'> = {
    title: raw.title,
    slug: raw.slug,
    shortDescription: raw.shortDescription,
    description: raw.description,
    imageUrl: raw.imageUrl,
    order: raw.order,
    isPublished: raw.isPublished,
    deliveryWeeks: raw.deliveryWeeks,
  };

  try {
    if (this.isEditing() && this.editingServiceId()) {
      await this.serviceService.updateService(this.editingServiceId()!, servicePayload);
    } else {
      await this.serviceService.createService(servicePayload as Service);
    }
    
    this.closeModal();
  } catch (err) {
    console.error('Failed to save service', err);
  }
}

async deleteService(serviceId: string): Promise<void> {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        await firstValueFrom(this.serviceService.deleteService(serviceId));
      } catch (err) {
        console.error('Failed to delete service', err);
      }
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
