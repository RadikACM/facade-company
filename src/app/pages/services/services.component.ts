import { Component, inject } from '@angular/core';
import { ServiceService } from '../../core/services/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  private readonly serviceService = inject(ServiceService);
  
  // Достаем сигнал услуг
  services = this.serviceService.services;
}