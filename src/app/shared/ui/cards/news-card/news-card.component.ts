import { Component, Input } from '@angular/core';
import { Post } from '../../../../core/models/news.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss', '../cards.scss']
})
export class NewsCardComponent {
@Input({ required: true }) post!: Post;
}
