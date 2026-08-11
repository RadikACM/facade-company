import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss', '../cards.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input({ required: true }) project!: Project;

  @Output() projectClick = new EventEmitter<Project>();

  openProject(): void {
    this.projectClick.emit(this.project);
  }

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
