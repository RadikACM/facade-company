import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../../core/models/project.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss', '../cards.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input({ required: true }) project!: Project;

  activeImage!: string;

  @Input() showFullDescription: boolean = false;

  ngOnInit(): void {
    // Устанавливаем стартовое изображение
    this.activeImage = this.project.imageUrl;
  }

  selectImage(imgUrl: string): void {
    this.activeImage = imgUrl;
  }

  switchDesc() {
    this.showFullDescription = !this.showFullDescription
  }
}
