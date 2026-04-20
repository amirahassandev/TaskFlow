import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';
import { ThemeService } from '../services/theme.service';
import {
  LucideAngularModule,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart2,
  Settings,
  Search,
  Bell,
  Menu,
  ChevronLeft,
  LogOut,
  Sun,
  Moon
} from 'lucide-angular';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, LucideAngularModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  isSidebarExpanded = signal<boolean>(true);
  
  private router = inject(Router);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);
  taskService = inject(TaskService);
  themeService = inject(ThemeService);

  toggleSidebar() {
    this.isSidebarExpanded.set(!this.isSidebarExpanded());
  }

  logout() {
    this.authService.logout();
    this.toastr.info('You have been logged out.', 'Goodbye!', { positionClass: 'toast-bottom-right' });
    this.router.navigate(['/login']);
  }

  // Icons used in template
  readonly icons = {
    dashboard: LayoutDashboard,
    projects: FolderKanban,
    tasks: CheckSquare,
    team: Users,
    reports: BarChart2,
    settings: Settings,
    search: Search,
    bell: Bell,
    menu: Menu,
    chevronLeft: ChevronLeft,
    logOut: LogOut,
    sun: Sun,
    moon: Moon
  };

  navItems = [
    { label: 'Dashboard', icon: this.icons.dashboard, route: '/dashboard' },
    { label: 'Projects', icon: this.icons.projects, route: '/projects' },
    { label: 'My Tasks', icon: this.icons.tasks, route: '/tasks' },
    { label: 'Team', icon: this.icons.team, route: '/team' },
    { label: 'Reports', icon: this.icons.reports, route: '/reports' },
    { label: 'Settings', icon: this.icons.settings, route: '/settings' }
  ];
}
