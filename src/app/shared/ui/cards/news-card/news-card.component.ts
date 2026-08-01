import { Component, Input } from '@angular/core';
import { Post } from '../../../../core/models/news.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-news-card',
  imports: [DatePipe, RouterLink, MarkdownModule, AsyncPipe],
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss', '../cards.scss']
})
export class NewsCardComponent {
@Input({ required: true }) post!: Post;
@Input() showFullContent: boolean = false;
}
