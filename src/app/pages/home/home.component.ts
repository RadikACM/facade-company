import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ServiceService } from '../../core/services/service.service';
import { ProjectService } from '../../core/services/project.service';
import { NewsService } from '../../core/services/news.service';
import { NewsCardComponent } from "../../shared/ui/cards/news-card/news-card.component";
import { ServiceCardComponent } from "../../shared/ui/cards/service-card/service-card.component";
import { ProjectCardComponent } from "../../shared/ui/cards/project-card/project-card.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { ReviewService } from '../../core/services/reviews.service';
import { ReviewCardComponent } from "../../shared/ui/cards/review-card/review-card.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, NewsCardComponent, ServiceCardComponent, ProjectCardComponent, ReviewCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private serviceService = inject(ServiceService);
  private projectsService = inject(ProjectService);
  private newsService = inject(NewsService);
  private reviewsService = inject(ReviewService);

  services = toSignal(this.serviceService.getServices(), { initialValue: [] });
  projects = toSignal(this.projectsService.getProjects(), { initialValue: [] });
  news = toSignal(this.newsService.getsPosts(), { initialValue: [] });
  reviews = toSignal(this.reviewsService.getReviews(), { initialValue: [] });
}
