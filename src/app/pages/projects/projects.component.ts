import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { ProjectCardComponent } from "../../shared/ui/cards/project-card/project-card.component";
import { ReviewService } from '../../core/services/reviews.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [AsyncPipe, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private readonly projectService = inject(ProjectService);
  projects$ = this.projectService.getProjects();

  private readonly reviewService = inject(ReviewService);

  readonly reviewRequested = signal(false);
  readonly reviewLoading = signal(false);
  readonly reviewError = signal(false);
}