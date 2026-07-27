import { Routes } from "@angular/router";
import { authGuard } from "../core/guards/auth.guard";

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('../layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'contacts',
                loadComponent: () => import('./pages/admin-contacts/admin-contacts.component').then(m => m.AdminContactsComponent)
            },
            {
                path: 'services',
                loadComponent: () => import('./pages/admin-services/admin-services.component').then(m => m.AdminServicesComponent)
            },
            {
                path: 'projects',
                loadComponent: () => import('./pages/admin-projects/admin-projects.component').then(m => m.AdminProjectsComponent)
            },
            {
                path: 'news',
                loadComponent: () => import('./pages/admin-news/admin-news.component').then(m => m.AdminNewsComponent)
            }
        ]
    }
]