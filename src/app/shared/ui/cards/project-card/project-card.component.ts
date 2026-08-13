import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Project } from '../../../../core/models/project.model';
import { ReviewCardComponent } from '../review-card/review-card.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [ReviewCardComponent],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss', '../cards.scss']
})
export class ProjectCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) project!: Project;
  
  // Начальные флаги можно переопределить через @Input
  @Input() initialShowFullDescription = false;
  @Input() initialShowReview = false;

  @Output() projectClick = new EventEmitter<Project>();

  activeImage: string = '';
  showFullDescription = false;
  showReview = false;

  ngOnInit(): void {
    this.showFullDescription = this.initialShowFullDescription;
    this.showReview = this.initialShowReview;
    this.initActiveImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && !changes['project'].isFirstChange()) {
      this.initActiveImage();
    }
  }

  private initActiveImage(): void {
    if (this.project?.imageUrl) {
      this.activeImage = this.project.imageUrl;
    }
  }

  openProject(): void {
    this.projectClick.emit(this.project);
  }

  selectImage(imgUrl: string): void {
    this.activeImage = imgUrl;
  }

  toggleDesc(): void {
    this.showFullDescription = !this.showFullDescription;
  }

  toggleReview(): void {
    this.showReview = !this.showReview;
  }
}