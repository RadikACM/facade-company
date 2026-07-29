import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss', '../cards.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input({ required: true }) project!: Project;

  activeImage!: string;

  ngOnInit(): void {
    // Устанавливаем стартовое изображение
    this.activeImage = this.project.imageUrl;
  }

  selectImage(imgUrl: string): void {
    this.activeImage = imgUrl;
  }
}
