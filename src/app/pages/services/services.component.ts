import { Component, inject } from '@angular/core';
import { ServiceService } from '../../core/services/service.service';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

  private readonly serviceService = inject(ServiceService);

  createService(): void {
    const newService = {
      name: 'New Service',
      description: 'Description of the new service',
      price: 100,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deliveryWeeks: 2, // Example value for delivery time in weeks
    };
  }
}
