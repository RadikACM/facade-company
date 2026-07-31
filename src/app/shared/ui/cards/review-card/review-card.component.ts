import { Component, Input } from '@angular/core';
import { Review } from '../../../../core/models/review.model';

@Component({
  selector: 'app-review-card',
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss'
})
export class ReviewCardComponent {
  @Input({ required: true }) review!: Review;

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
