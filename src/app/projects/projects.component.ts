import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-zinc-900">Projects</h1>
        <button (click)="isModalOpen.set(true)" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm">
          New Project
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (project of projects(); track project.id) {
          <div class="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow relative group">
            
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-bold text-zinc-900">{{ project.title }}</h3>
                <p class="text-sm text-zinc-500 mt-1">{{ project.client }}</p>
              </div>
              <button (click)="manageProject(project.title)" class="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs px-2 py-1 rounded-md font-medium">
                Manage
              </button>
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
  
  isModalOpen = signal(false);
  isSubmitting = signal(false);

  newProject = { title: '', client: '' };

  projects = signal([
    { id: 1, title: 'Website Redesign', client: 'Acme Corp', progress: 75, ownerAvatar: 'https://i.pravatar.cc/150?u=12', tasksCompleted: 15, totalTasks: 20, status: 'Active' },
    { id: 2, title: 'Mobile App V2', client: 'TechFlow', progress: 45, ownerAvatar: 'https://i.pravatar.cc/150?u=13', tasksCompleted: 9, totalTasks: 20, status: 'In Risk' },
    { id: 3, title: 'Marketing Campaign', client: 'Global Media', progress: 90, ownerAvatar: 'https://i.pravatar.cc/150?u=14', tasksCompleted: 18, totalTasks: 20, status: 'On Track' },
    { id: 4, title: 'Backend Migration', client: 'Startup Inc', progress: 20, ownerAvatar: 'https://i.pravatar.cc/150?u=15', tasksCompleted: 10, totalTasks: 50, status: 'Delayed' }
  ]);

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

  submitProject() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.projects.update(p => [{
        id: Date.now(),
        title: this.newProject.title,
        client: this.newProject.client,
        progress: 0,
        ownerAvatar: 'https://i.pravatar.cc/150?u=99',
        tasksCompleted: 0,
        totalTasks: 0,
        status: 'Active'
      }, ...p]);
      
      this.isSubmitting.set(false);
      this.closeModal();
      this.toastr.success('Project added successfully!', 'Success');
    }, 800);
  }
}
