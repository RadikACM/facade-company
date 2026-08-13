import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'about',
                loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
            },
            {
                path: 'reviews',
                loadComponent: () => import('./pages/reviews/reviews.component').then(m => m.ReviewsComponent) 
            },
            {
                path: 'contacts',
                loadComponent: () => import('./pages/contacts/contacts.component').then(m => m.ContactsComponent)
            },
            {
                path: 'services',
                loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
            },
            {
                path: 'projects',
                loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
            },
            {
                path: 'news',
                loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent)
            }
        ]
    },
    {
      path: 'login',
      loadComponent: () => import('./admin/pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
    },
    {
      path: 'admin',
      loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
