import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ServiceService } from '../../core/services/service.service';
import { ServiceCardComponent } from '../../shared/ui/cards/service-card/service-card.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ServiceCardComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  private readonly serviceService = inject(ServiceService);

  readonly services$ = this.serviceService.getServices().pipe(
    map((services) => services.filter((service) => service.isPublished))
  );
}
