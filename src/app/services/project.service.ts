import { Injectable, signal } from '@angular/core';

export interface Project {
  id: number;
  title: string;
  client: string;
  progress: number;
  ownerAvatar: string;
  tasksCompleted: number;
  totalTasks: number;
  status: 'Active' | 'In Risk' | 'On Track' | 'Delayed' | 'Completed';
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects = signal<Project[]>([
    { id: 1, title: 'Website Redesign', client: 'Acme Corp', progress: 75, ownerAvatar: 'https://i.pravatar.cc/150?u=12', tasksCompleted: 15, totalTasks: 20, status: 'Active' },
    { id: 2, title: 'Mobile App V2', client: 'TechFlow', progress: 45, ownerAvatar: 'https://i.pravatar.cc/150?u=13', tasksCompleted: 9, totalTasks: 20, status: 'In Risk' },
    { id: 3, title: 'Marketing Campaign', client: 'Global Media', progress: 90, ownerAvatar: 'https://i.pravatar.cc/150?u=14', tasksCompleted: 18, totalTasks: 20, status: 'On Track' },
    { id: 4, title: 'Backend Migration', client: 'Startup Inc', progress: 20, ownerAvatar: 'https://i.pravatar.cc/150?u=15', tasksCompleted: 10, totalTasks: 50, status: 'Delayed' }
  ]);

  updateProjectStatus(id: number, status: Project['status']) {
    this.projects.update(projects => 
      projects.map(p => p.id === id ? { ...p, status, progress: status === 'Completed' ? 100 : p.progress } : p)
    );
  }

  addProject(project: Omit<Project, 'id' | 'progress' | 'tasksCompleted' | 'totalTasks' | 'status' | 'ownerAvatar'>) {
    const newProject: Project = {
      ...project,
      id: Date.now(),
      progress: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      status: 'Active',
      ownerAvatar: 'https://i.pravatar.cc/150?u=99'
    };
    this.projects.update(p => [newProject, ...p]);
  }
}
