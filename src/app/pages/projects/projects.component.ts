import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  private readonly projectService = inject(ProjectService);
  private _snackBar = inject(MatSnackBar);

  addProject(): void {
    const newProject = {
      title: 'New Project',
      description: 'Description of the new project',
      fullDescription: 'Full description of the new project',
      category: 'Category of the new project',
      client: 'Client of the new project',
      year: 2024,
      createdAt: new Date().toISOString(),
      imageUrl: 'https://example.com/image.jpg',
      gallery: ['https://example.com/gallery1.jpg', 'https://example.com/gallery2.jpg'],
    };
    this.projectService.addProject(newProject);
  }
}
