import { Component, inject, signal, computed } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { ProjectService, Project } from '../services/project.service';
import { AuthService } from '../services/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, NgClass],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-zinc-900">Projects</h1>
        <button (click)="isModalOpen.set(true)" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm">
          New Project
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (project of filteredProjects(); track project.id) {
          <div 
            class="bg-white p-5 rounded-xl border-2 shadow-sm transition-all relative group"
            [ngClass]="project.status === 'Completed' ? 'border-emerald-500 shadow-emerald-50' : 'border-zinc-200 hover:shadow-md'">
            
            @if (project.status === 'Completed') {
              <div class="absolute -top-3 -right-3 bg-emerald-500 text-white p-1 rounded-full shadow-lg z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            }
            
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-bold text-zinc-900">{{ project.title }}</h3>
                <p class="text-sm text-zinc-500 mt-1">{{ project.client }}</p>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                @if (authService.userRole() === 'admin' && project.status !== 'Completed') {
                  <button (click)="markAsCompleted(project)" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2 py-1 rounded-md font-medium">
                    Complete
                  </button>
                }
                <button (click)="manageProject(project.title)" class="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs px-2 py-1 rounded-md font-medium">
                  Manage
                </button>
              </div>
            </div>
            
            <div class="mt-4">
              <div class="flex justify-between text-xs mb-1">
                <span class="font-medium text-zinc-600">Progress</span>
                <span class="font-bold text-indigo-600">{{ project.progress }}%</span>
              </div>
              <div class="w-full bg-zinc-100 rounded-full h-2">
                <div class="bg-indigo-600 h-2 rounded-full transition-all" [style.width.%]="project.progress"></div>
              </div>
            </div>
            
            <div class="mt-5 flex items-center justify-between pt-4 border-t border-zinc-100 text-sm text-zinc-500">
              <div class="flex items-center gap-2">
                <span class="font-medium text-zinc-900">{{ project.tasksCompleted }}/{{ project.totalTasks }}</span> tasks
              </div>
              <div class="px-2 py-1 bg-zinc-100 rounded-md text-xs font-semibold text-zinc-700">
                {{ project.status }}
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Add Project Modal -->
    @if(isModalOpen()) {
      <div class="fixed inset-0 bg-zinc-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h3 class="text-lg font-bold text-zinc-900">Add New Project</h3>
            <button (click)="isModalOpen.set(false)" class="text-zinc-400 hover:text-zinc-600 transition-colors">&times;</button>
          </div>
          <div class="p-6 flex-1 overflow-y-auto space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Project Title</label>
              <input type="text" [(ngModel)]="newProject.title" class="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Client Name</label>
              <input type="text" [(ngModel)]="newProject.client" class="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>
          <div class="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
            <button (click)="isModalOpen.set(false)" class="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
            <button (click)="submitProject()" [disabled]="isSubmitting() || !newProject.title || !newProject.client" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
              @if(isSubmitting()) {
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              }
              Save Project
            </button>
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

  closeModal() {
    this.isModalOpen.set(false);
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
