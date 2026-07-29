import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NewsService } from '../../core/services/news.service';
import { NewsCardComponent } from "../../shared/ui/cards/news-card/news-card.component";

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [AsyncPipe, NewsCardComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  private readonly newsService = inject(NewsService);
  posts$ = this.newsService.getsPosts();
}