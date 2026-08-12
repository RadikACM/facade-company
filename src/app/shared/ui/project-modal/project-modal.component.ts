import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Project } from '../../../core/models/project.model';
import { Review } from '../../../core/models/review.model';
import { ReviewService } from '../../../core/services/reviews.service';
import { ReviewCardComponent } from '../cards/review-card/review-card.component';
import { ProjectCardComponent } from "../cards/project-card/project-card.component";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-project-modal',
  imports: [MatDialogClose, ReviewCardComponent, ProjectCardComponent],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent {
  readonly project = inject<Project>(MAT_DIALOG_DATA);
  private readonly reviewService = inject(ReviewService);

  readonly review = signal<Review | null>(null);
  readonly reviews = this.reviewService.reviews;

  readonly reviewLoading = signal(false);
  readonly reviewError = signal(false);
 
  loadReview(): void {

    this.reviewService
      .getReviewByProjectId(this.project.id)
      .pipe(take(1))
      .subscribe({
        next: (review) => {
          this.review.set(review ?? null);
        },
        error: () => {
          this.reviewError.set(true);
          this.reviewLoading.set(false);
        },
      });
  };

  constructor() {
    this.reviewService.getReviews();
  }
}
