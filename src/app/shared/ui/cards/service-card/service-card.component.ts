import { Component, Input } from '@angular/core';
import { Service } from '../../../../core/models/service.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-card',
  imports: [RouterLink],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss', '../cards.scss']
})
export class ServiceCardComponent {
  @Input({ required: true }) card!: Service;
  @Input() showFullDescription: boolean = false;
  @Input() index: number = 1;
}
