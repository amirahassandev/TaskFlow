import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'projects', 
        loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent)
      },
      { 
        path: 'tasks', 
        loadComponent: () => import('./task-board/task-board.component').then(m => m.TaskBoardComponent)
      },
      { 
        path: 'team', 
        canActivate: [adminGuard],
        loadComponent: () => import('./team/team.component').then(m => m.TeamComponent)
      },
      { 
        path: 'reports', 
        canActivate: [adminGuard],
        loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];