import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ServiceService } from '../../core/services/service.service';
import { ProjectService } from '../../core/services/project.service';
import { NewsService } from '../../core/services/news.service';
import { NewsCardComponent } from "../../shared/ui/cards/news-card/news-card.component";
import { ServiceCardComponent } from "../../shared/ui/cards/service-card/service-card.component";
import { AsyncPipe } from '@angular/common';
import { ProjectCardComponent } from "../../shared/ui/cards/project-card/project-card.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, NewsCardComponent, ServiceCardComponent, AsyncPipe, ProjectCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private serviceService = inject(ServiceService);
  private projectsService = inject(ProjectService);
  private newsService = inject(NewsService);

  services = this.serviceService.getServices();
  projects = this.projectsService.getProjects();
  news = this.newsService.getsPosts();
}
