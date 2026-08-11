import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Project } from '../../../core/models/project.model';
import { Review } from '../../../core/models/review.model';
import { ReviewService } from '../../../core/services/reviews.service';
import { ReviewCardComponent } from '../cards/review-card/review-card.component';

@Component({
  selector: 'app-project-modal',
  imports: [MatDialogClose, ReviewCardComponent],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent {
  readonly project = inject<Project>(MAT_DIALOG_DATA);
  private readonly reviewService = inject(ReviewService);

  readonly review = signal<Review | null>(null);
  readonly reviewRequested = signal(false);
  readonly reviewLoading = signal(false);
  readonly reviewError = signal(false);

  loadReview(): void {
    if (this.reviewRequested()) {
      return;
    }

    this.reviewRequested.set(true);
    this.reviewLoading.set(true);

    this.reviewService
      .getReviewByProjectId(this.project.id)
      .pipe(take(1))
      .subscribe({
        next: (review) => {
          this.review.set(review ?? null);
          this.reviewLoading.set(false);
        },
        error: () => {
          this.reviewError.set(true);
          this.reviewLoading.set(false);
        },
      });
  }
}
