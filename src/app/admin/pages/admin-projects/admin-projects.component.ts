import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  readonly isModalOpen = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly editingProjectId = signal<string | null>(null);
  readonly isUploading = signal<boolean>(false);

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
    galery: new FormArray([new FormControl('', { nonNullable: true })]),
    category: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
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
    this.galleryArray.push(new FormControl('', { nonNullable: true }));

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
    if (galleryItems.length > 0) {
      galleryItems.forEach((url) => {
        this.galleryArray.push(new FormControl(url, { nonNullable: true }));
      });
    } else {
      this.galleryArray.push(new FormControl('', { nonNullable: true }));
    }

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
    this.galleryArray.push(new FormControl('', { nonNullable: true }));
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
      } catch (err) {
        console.error('Failed to delete project', err);
      }
      this._snackbar.open('Проект удален', 'ok', { duration: 3000 });
    }
  }

  addGalleryImage(): void {
    this.galleryArray.push(new FormControl('', { nonNullable: true }));
  }

  removeGalleryImage(index: number): void {
    if (this.galleryArray.length > 1) {
      this.galleryArray.removeAt(index);
    } else {
      this.galleryArray.at(0).setValue('');
    }
  }
}