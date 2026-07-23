import { Component, inject } from '@angular/core';
import { NewsService } from '../../core/services/news.service';
import { Post } from '../../core/models/news.model';

@Component({
  selector: 'app-news',
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {

  private readonly newsService = inject(NewsService);

  addPost(): void {
    const newPost: Omit<Post, 'id'> = {
      title: 'New Post Title',
      excerpt: 'This is a short excerpt of the new post.',
      content: 'This is the full content of the new post.',
      publishedAt: new Date().toISOString(),
    };
    this.newsService.addPost(newPost);
  }
  
}
