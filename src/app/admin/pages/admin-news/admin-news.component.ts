import { Component, inject, signal } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Post } from '../../../core/models/news.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, MarkdownComponent, CommonModule],
  templateUrl: './admin-news.component.html',
  styleUrl: './admin-news.component.scss',
})
export class AdminNewsComponent {
  private newsService = inject(NewsService);

  readonly isModalOpen = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly editingPostId = signal<string | null>(null);
  readonly isUploading = signal<boolean>(false);

  readonly posts = toSignal(this.newsService.getsPosts(), {
    initialValue: [] as Post[],
  });

  readonly blogForm = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    excerpt: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    content: new FormControl('', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true }),
    url: new FormControl('', { nonNullable: true }),
    publishedAt: new FormControl(new Date().toISOString()),
  });

  private readonly emptyFormValue = {
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    url: '',
    publishedAt: new Date().toISOString(),
  };

  openModal(): void {
    this.isEditing.set(false);
    this.editingPostId.set(null);
    this.blogForm.reset({
      ...this.emptyFormValue,
      publishedAt: new Date().toISOString(),
    });
    this.isModalOpen.set(true);
  }

  openEditModal(post: Post): void {
    this.isEditing.set(true);
    this.editingPostId.set(post.id);
    this.blogForm.reset({
      title: post.title ?? '',
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      imageUrl: post.imageUrl ?? '',
      url: post.url ?? '',
      publishedAt: post.publishedAt ?? new Date().toISOString(),
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.isEditing.set(false);
    this.editingPostId.set(null);
    this.blogForm.reset(this.emptyFormValue);
  }

  async onSubmit(): Promise<void> {
    if (this.blogForm.invalid) return;

    const raw = this.blogForm.getRawValue();

    const postPayload: Omit<Post, 'id'> = {
      title: raw.title,
      excerpt: raw.excerpt,
      content: raw.content,
      publishedAt: raw.publishedAt ?? new Date().toISOString(),
      ...(raw.imageUrl ? { imageUrl: raw.imageUrl } : {}),
      ...(raw.url ? { url: raw.url } : {}),
    };

    try {
      if (this.isEditing() && this.editingPostId()) {
        await this.newsService.updatePost(this.editingPostId()!, postPayload);
      } else {
        await this.newsService.addPost(postPayload as Post);
      }
      this.closeModal();
    } catch (err) {
      console.error('Failed to save post', err);
    }
  }

  async deletePost(postId: string): Promise<void> {
    if (confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        await this.newsService.deletePost(postId);
      } catch (err) {
        console.error('Failed to delete post', err);
      }
    }
  }

  get currentContent(): string {
    return this.blogForm.get('content')?.value ?? '';
  }

  onBlogFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.isUploading.set(true);

    this.readFileAsDataUrl(file)
      .then((url) => {
        this.blogForm.patchValue({ imageUrl: url });
      })
      .finally(() => {
        this.isUploading.set(false);
        input.value = '';
      });
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}