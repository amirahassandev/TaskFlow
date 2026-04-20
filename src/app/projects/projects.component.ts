import { Component, inject, signal, computed } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { ProjectService, Project } from '../services/project.service';
import { AuthService } from '../services/auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
  template: `
<div class="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
  
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div class="space-y-1">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Active Projects</h1>
      <p class="text-slate-500 dark:text-zinc-400 font-medium">Manage and track your portfolio performance.</p>
    </div>
    <button (click)="openModal()" class="btn-primary">
      New Initiative
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    @for (project of filteredProjects(); track project.id) {
      <div 
        class="glass-card p-8 border-2 group transition-all duration-500 hover:ring-8 hover:ring-indigo-500/5 relative"
        [ngClass]="project.status === 'Completed' ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-transparent'">
        
        @if (project.status === 'Completed') {
          <div class="absolute -top-4 -right-4 bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 z-10 animate-in bounce-in">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        }
        
        <div class="flex justify-between items-start mb-8">
          <div class="space-y-1">
            <p class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">{{ project.client }}</p>
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ project.title }}</h3>
          </div>
          
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            @if (authService.userRole() === 'admin' && project.status !== 'Completed') {
              <button (click)="markAsCompleted(project)" class="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            }
            <button (click)="manageProject(project.title)" class="p-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </button>
          </div>
        </div>
        
        <!-- Premium Progress Section -->
        <div class="space-y-4 py-6 border-y border-slate-50 dark:border-zinc-800/50">
          <div class="flex justify-between items-center px-1">
            <span class="text-xs font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Delivery Status</span>
            <div class="flex items-center gap-2">
              <button (click)="changeProgress(project, -10)" class="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-zinc-800 hover:bg-rose-500 hover:text-white rounded-lg transition-all font-bold shadow-sm">-</button>
              <span 
                class="font-black w-12 text-center text-lg tabular-nums"
                [ngClass]="{
                  'text-rose-500': project.progress < 30,
                  'text-amber-500': project.progress >= 30 && project.progress <= 70,
                  'text-emerald-500': project.progress > 70
                }">{{ project.progress }}%</span>
              <button (click)="changeProgress(project, 10)" class="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white rounded-lg transition-all font-bold shadow-sm">+</button>
            </div>
          </div>
          <div class="progress-thin h-3">
             <div 
              class="progress-bar-glow h-full rounded-full" 
              [ngClass]="{
                'bg-rose-500 shadow-rose-500/20': project.progress < 30,
                'bg-amber-500 shadow-amber-500/20': project.progress >= 30 && project.progress <= 70,
                'bg-emerald-500 shadow-emerald-500/20': project.progress > 70
              }"
              [style.width.%]="project.progress"></div>
          </div>
        </div>
        
        <div class="mt-8 flex items-center justify-between">
          <div class="flex items-center -space-x-2">
            <div class="w-10 h-10 rounded-2xl border-4 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 overflow-hidden shadow-lg transform transition-transform hover:scale-110 hover:z-10">
               <img [src]="project.ownerAvatar" alt="Owner" class="w-full h-full object-cover">
            </div>
            <div class="w-10 h-10 rounded-2xl border-4 border-white dark:border-zinc-900 bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 shadow-lg cursor-pointer hover:scale-110 hover:z-10 text-center">
              +3
            </div>
          </div>
          <div class="text-right">
             <span class="block text-xs font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Status</span>
             <span class="badge-soft shadow-inner" [ngClass]="{
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400': project.status === 'Completed' || project.status === 'On Track',
                'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400': project.status === 'Delayed' || project.status === 'In Risk',
                'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400': project.status === 'Active'
             }">{{ project.status }}</span>
          </div>
        </div>
      </div>
    }
  </div>
</div>

<!-- Modal Overhaul -->
@if (isModalOpen()) {
  <div class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-in fade-in duration-300">
    <div class="glass-card w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300">
       <div class="p-10 space-y-8">
          <div class="space-y-2">
             <h3 class="text-3xl font-extrabold dark:text-white tracking-tighter text-center">New Initiative</h3>
             <p class="text-slate-500 dark:text-zinc-500 font-medium text-center">Launch a new project stream.</p>
          </div>
          
          <div class="space-y-6">
             <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                <input type="text" [(ngModel)]="newProject.title" class="glass-input w-full !bg-slate-50 !pt-4 !pb-4 font-bold text-lg" placeholder="Enter title">
             </div>
             <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Client / Stakeholder</label>
                <input type="text" [(ngModel)]="newProject.client" class="glass-input w-full !bg-slate-50" placeholder="e.g. Acme Corp">
             </div>
          </div>

          <div class="flex gap-4 pt-6">
             <button (click)="isModalOpen.set(false)" class="flex-1 py-4 font-bold text-slate-500 bg-slate-50 dark:bg-zinc-800 rounded-2xl hover:bg-slate-100 transition-all">Discard</button>
             <button (click)="submitProject()" class="flex-1 btn-primary text-lg">Launch Project</button>
          </div>
       </div>
    </div>
  </div>
}
  `
})
export class ProjectsComponent {
  toastr = inject(ToastrService);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  authService = inject(AuthService);
  
  isModalOpen = signal(false);
  isSubmitting = signal(false);

  newProject = { title: '', client: '' };

  filteredProjects = computed(() => {
    const query = this.taskService.searchQuery().toLowerCase();
    const projects = this.projectService.projects();
    if (!query) return projects;
    return projects.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.client.toLowerCase().includes(query)
    );
  });

  manageProject(title: string) {
    this.toastr.info(`Managing ${title}...`, 'Manage Project');
  }

  openModal() {
    this.newProject = { title: '', client: '' };
    this.isModalOpen.set(true);
  }

  changeProgress(project: Project, delta: number) {
    this.projectService.updateProgress(project.id, delta);
  }

  markAsCompleted(project: Project) {
    this.projectService.updateProjectStatus(project.id, 'Completed');
    this.toastr.success(`${project.title} marked as completed!`, 'Project Updated');
  }

  submitProject() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.projectService.addProject({
        title: this.newProject.title,
        client: this.newProject.client
      });
      
      this.isSubmitting.set(false);
      this.isModalOpen.set(false);
      this.toastr.success('Project added successfully!', 'Success');
    }, 800);
  }
}
