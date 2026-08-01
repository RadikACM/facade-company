import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../core/services/reviews.service';
import { AsyncPipe } from '@angular/common';
import { ReviewCardComponent } from "../../shared/ui/cards/review-card/review-card.component";

@Component({
  selector: 'app-reviews',
  imports: [RouterLink, AsyncPipe, ReviewCardComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {
  readonly reviewService = inject(ReviewService);

  reviews = this.reviewService.getReviews();
}
