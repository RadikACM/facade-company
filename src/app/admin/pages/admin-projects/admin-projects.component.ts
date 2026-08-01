import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CommonModule],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss',
})
export class AdminProjectsComponent {
  private readonly projectsService = inject(ProjectService);
  private readonly _snackbar = inject(MatSnackBar);
  private readonly storage = inject(Storage);
  private readonly fb = inject(FormBuilder);

  readonly isModalOpen = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly editingProjectId = signal<string | null>(null);
  readonly isUploading = signal<boolean>(false);
  readonly isGalleryUploading = signal<boolean>(false);

  readonly projects = toSignal(this.projectsService.getProjects(), {
    initialValue: [] as Project[],
  });

  readonly projectForm = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    fullDescription: new FormControl('', { nonNullable: true }),
    client: new FormControl('', { nonNullable: true }),
    year: new FormControl(new Date().getFullYear(), { nonNullable: true }),
    createdAt: new FormControl(new Date().toISOString()),
    imageUrl: new FormControl('', { nonNullable: true }),
    galery: this.fb.array<FormControl<string>>([]),
    category: new FormControl('', { nonNullable: true }),
  });

  private readonly emptyFormValue = {
    title: '',
    description: '',
    fullDescription: '',
    client: '',
    year: new Date().getFullYear(),
    createdAt: new Date().toISOString(),
    imageUrl: '',
    category: '',
  };

  get galleryArray(): FormArray<FormControl<string>> {
    return this.projectForm.controls.galery as FormArray<FormControl<string>>;
  }

  openModal(): void {
    this.isEditing.set(false);
    this.editingProjectId.set(null);

    this.galleryArray.clear();

    this.projectForm.reset({
      ...this.emptyFormValue,
      year: new Date().getFullYear(),
      createdAt: new Date().toISOString(),
    });
    this.isModalOpen.set(true);
  }

  openEditModal(project: Project): void {
    this.isEditing.set(true);
    this.editingProjectId.set(project.id);

    this.galleryArray.clear();
    const galleryItems = project.gallery ?? [];
    galleryItems.forEach((url) => {
      this.galleryArray.push(new FormControl(url, { nonNullable: true }));
    });

    this.projectForm.patchValue({
      title: project.title ?? '',
      description: project.description ?? '',
      fullDescription: project.fullDescription ?? '',
      client: project.client ?? '',
      year: project.year ?? new Date().getFullYear(),
      createdAt: project.createdAt ?? new Date().toISOString(),
      imageUrl: project.imageUrl ?? '',
      category: project.category ?? '',
    });

    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.isEditing.set(false);
    this.editingProjectId.set(null);

    this.galleryArray.clear();
    this.projectForm.reset(this.emptyFormValue);
  }

  async onSubmit(): Promise<void> {
    if (this.projectForm.invalid) return;

    const raw = this.projectForm.getRawValue();

    // Фильтруем пустые строки из галереи
    const cleanGallery = (raw.galery || []).filter((url) => url.trim() !== '');

    const projectPayload: Omit<Project, 'id'> = {
      title: raw.title,
      description: raw.description,
      fullDescription: raw.fullDescription,
      client: raw.client,
      year: Number(raw.year),
      createdAt: raw.createdAt ?? new Date().toISOString(),
      imageUrl: raw.imageUrl,
      gallery: cleanGallery,
      category: raw.category
    };

    try {
      if (this.isEditing() && this.editingProjectId()) {
        await this.projectsService.updateProject(
          this.editingProjectId()!,
          projectPayload,
        );
        this._snackbar.open('Проект отредактирован', 'ok', { duration: 3000 });
      } else {
        await this.projectsService.addProject(projectPayload as Project);
        this._snackbar.open('Проект добавлен', 'ok', { duration: 3000 });
      }

      this.closeModal();
    } catch (err) {
      console.error('Failed to save project', err);
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        await this.projectsService.deleteProject(projectId);
        this._snackbar.open('Проект удален', 'ok', { duration: 3000 });
      } catch (err) {
        console.error('Failed to delete project', err);
      }
    }
  }

  // Общий метод для загрузки файла в Firebase Storage
  private async uploadFileToStorage(file: File): Promise<string> {
    const filePath = `projects/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  // Загрузка обложки проекта
  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.isUploading.set(true);

    try {
      const url = await this.uploadFileToStorage(file);
      this.projectForm.patchValue({ imageUrl: url });
      this._snackbar.open('Изображение обложки загружено!', 'OK', { duration: 2000 });
    } catch (error) {
      console.error('Ошибка при загрузке обложки:', error);
      this._snackbar.open('Ошибка при загрузке фото', 'Упс');
    } finally {
      this.isUploading.set(false);
      input.value = '';
    }
  }

  // Загрузка нескольких файлов для галереи
  async onGalleryFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.isGalleryUploading.set(true);

    try {
      const files = Array.from(input.files);

      for (const file of files) {
        const uploadedUrl = await this.uploadFileToStorage(file);
        this.galleryArray.push(new FormControl(uploadedUrl, { nonNullable: true }));
      }
      
      this._snackbar.open('Галерея обновлена!', 'OK', { duration: 2000 });
    } catch (error) {
      console.error('Ошибка при загрузке галереи:', error);
      this._snackbar.open('Ошибка при загрузке файлов галереи', 'Упс');
    } finally {
      this.isGalleryUploading.set(false);
      input.value = '';
    }
  }

  // Удаление фото из галереи по индексу
  removeGalleryImage(index: number): void {
    this.galleryArray.removeAt(index);
  }
}