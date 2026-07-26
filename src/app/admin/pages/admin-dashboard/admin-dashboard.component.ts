import { Component, computed, inject } from '@angular/core';
import { NewsService } from '../../../core/services/news.service';
import { ProjectService } from '../../../core/services/project.service';
import { ServiceService } from '../../../core/services/service.service';
import { ContactService } from '../../../core/services/contact.service';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
private readonly newsService = inject(NewsService);
  private readonly projectsService = inject(ProjectService);
  private readonly servicesService = inject(ServiceService);
  private readonly contactsService = inject(ContactService);

  // 1. Получаем реактивные данные из сервисов (со списком по умолчанию [])
  readonly news = toSignal(this.newsService.getsPosts(), { initialValue: [] });
  readonly projects = toSignal(this.projectsService.getProjects(), { initialValue: [] });
  readonly services = this.servicesService.services

  // 2. Вычисляем количество через computed
  readonly countNews = computed(() => this.news().length);
  readonly countProjects = computed(() => this.projects().length);
  readonly countServices = computed(() => this.services().length);
}
