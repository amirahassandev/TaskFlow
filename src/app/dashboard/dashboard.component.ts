import { Component, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskBoardComponent } from '../task-board/task-board.component';
import {
  LucideAngularModule,
  Plus,
  Briefcase,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, LucideAngularModule, TaskBoardComponent, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  toastr = inject(ToastrService);
  icons = {
    plus: Plus,
    projects: Briefcase,
    completed: CheckCircle2,
    overdue: Clock,
    trending: TrendingUp,
    activity: Activity
  };
  
  isModalOpen = signal(false);
  isSubmitting = signal(false);

  newTask = {
    title: '',
    priority: 'Medium'
  };

  openModal() {
    this.isModalOpen.set(true);
    this.newTask = { title: '', priority: 'Medium' };
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  submitQuickTask() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.closeModal();
      this.toastr.success('Task added successfully!', 'Quick Add');
    }, 800);
  }

  kpiStats = [
    { label: 'Active Projects', value: '12', icon: this.icons.projects, trend: '+12%', colorClass: 'text-indigo-600', bgClass: 'bg-indigo-50' },
    { label: 'Total Tasks', value: '148', icon: this.icons.activity, trend: '+5%', colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
    { label: 'Done this week', value: '34', icon: this.icons.completed, trend: '+18%', colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
    { label: 'Overdue Tasks', value: '3', icon: this.icons.overdue, trend: '-2%', colorClass: 'text-rose-600', bgClass: 'bg-rose-50' },
  ];

  projectProgress = [
    { name: 'Website Redesign', progress: 75, color: 'bg-indigo-500' },
    { name: 'Mobile App V2', progress: 45, color: 'bg-violet-500' },
    { name: 'Marketing Campaign', progress: 90, color: 'bg-emerald-500' },
  ];

  recentActivities = [
    { user: 'Sarah Connor', action: 'completed task', target: 'Update user flow', time: '2 hours ago', avatar: 'https://i.pravatar.cc/150?u=1' },
    { user: 'John Smith', action: 'commented on', target: 'Homepage design', time: '4 hours ago', avatar: 'https://i.pravatar.cc/150?u=2' },
    { user: 'Mike Johnson', action: 'uploaded file', target: 'Q3_Report.pdf', time: 'Yesterday', avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  upcomingDeadlines = [
    { task: 'Submit App to Store', project: 'Mobile App V2', date: 'Tomorrow', priority: 'High' },
    { task: 'Team Retrospective', project: 'General', date: 'Oct 24', priority: 'Medium' },
    { task: 'Finalize copy', project: 'Website Redesign', date: 'Oct 26', priority: 'Low' }
  ];
}
