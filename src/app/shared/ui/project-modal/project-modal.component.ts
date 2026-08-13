import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { Project } from '../../../core/models/project.model';
import { ReviewService } from '../../../core/services/reviews.service';
import { ReviewCardComponent } from '../cards/review-card/review-card.component';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [MatDialogClose, ReviewCardComponent],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent implements OnInit {
  readonly project = inject<Project>(MAT_DIALOG_DATA);
  private readonly reviewService = inject(ReviewService);

  readonly reviews = this.reviewService.reviews;
  activeImage = '';

  ngOnInit(): void {
    if (this.project?.imageUrl) {
      this.activeImage = this.project.imageUrl;
    }

    // Если в объекте проекта нет встроенного отзыва, запрашиваем из сервиса
    if (!this.project?.clientReview && this.project?.id) {
      this.reviewService.getReviewByProjectId(this.project.id);
    }
  }

  selectImage(imgUrl: string): void {
    this.activeImage = imgUrl;
  }
}