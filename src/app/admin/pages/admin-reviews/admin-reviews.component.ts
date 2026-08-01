import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../../core/services/reviews.service';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.scss',
})
export class AdminReviewsComponent {
  readonly reviewService = inject(ReviewService);
  private fb = inject(FormBuilder);

  isModalOpen = signal(false);
  editingReviewId = signal<string | null>(null);

  form = this.fb.group({
    authorName: ['', [Validators.required, Validators.minLength(2)]],
    authorRole: [''],
    objectType: ['Частный дом / Коттедж'],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    text: ['', [Validators.required, Validators.minLength(5)]],
  });

  openCreateModal(): void {
    this.editingReviewId.set(null);
    this.form.reset({ rating: 5, objectType: 'Частный дом / Коттедж' });
    this.isModalOpen.set(true);
  }

  openEditModal(review: Review): void {
    this.editingReviewId.set(review.id || null);
    this.form.patchValue({
      authorName: review.authorName,
      authorRole: review.authorRole || '',
      objectType: review.objectType || 'Частный дом / Коттедж',
      rating: review.rating,
      text: review.text,
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingReviewId.set(null);
  }

  setRating(rating: number): void {
    this.form.patchValue({ rating });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const val = this.form.value;
    const reviewData = {
      authorName: val.authorName!,
      authorRole: val.authorRole || '',
      objectType: val.objectType || '',
      rating: Number(val.rating),
      text: val.text!,
    };

    const reviewId = this.editingReviewId();

    if (reviewId) {
      this.reviewService.updateReview(reviewId, reviewData).subscribe(() => {
        this.closeModal();
      });
    } else {
      this.reviewService.addReview(reviewData).subscribe(() => {
        this.closeModal();
      });
    }
  }

  onDelete(id: string): void {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      this.reviewService.deleteReview(id).subscribe();
    }
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
}