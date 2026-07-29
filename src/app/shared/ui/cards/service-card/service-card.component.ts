import { Component, Input } from '@angular/core';
import { Service } from '../../../../core/models/service.model';

@Component({
  selector: 'app-service-card',
  imports: [],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss', '../cards.scss']
})
export class ServiceCardComponent {
@Input({ required: true }) card!: Service;
}
