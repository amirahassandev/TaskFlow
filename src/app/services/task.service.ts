import { Injectable, signal } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  subtasks: { completed: number; total: number };
  comments: number;
  avatar: string;
  status: 'todo' | 'in-progress' | 'done';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private initialTasks: Task[] = [
    { id: 1, title: 'Design System Update', priority: 'High', dueDate: 'Oct 24', subtasks: { completed: 2, total: 5 }, comments: 3, avatar: 'https://i.pravatar.cc/150?u=12', status: 'todo' },
    { id: 2, title: 'Draft Q4 Marketing Copy', priority: 'Medium', dueDate: 'Oct 26', subtasks: { completed: 0, total: 3 }, comments: 0, avatar: 'https://i.pravatar.cc/150?u=13', status: 'todo' },
    { id: 3, title: 'Develop Navigation Component', priority: 'High', dueDate: 'Tomorrow', subtasks: { completed: 4, total: 5 }, comments: 8, avatar: 'https://i.pravatar.cc/150?u=14', status: 'in-progress' },
    { id: 4, title: 'User Testing Interviews', priority: 'Low', dueDate: 'Next Week', subtasks: { completed: 1, total: 2 }, comments: 2, avatar: 'https://i.pravatar.cc/150?u=15', status: 'in-progress' },
    { id: 5, title: 'Initial Wireframes', priority: 'Medium', dueDate: 'Yesterday', subtasks: { completed: 3, total: 3 }, comments: 12, avatar: 'https://i.pravatar.cc/150?u=16', status: 'done' },
    { id: 6, title: 'SEO Audit', priority: 'High', dueDate: 'Oct 25', subtasks: { completed: 1, total: 4 }, comments: 5, avatar: 'https://i.pravatar.cc/150?u=17', status: 'todo' },
    { id: 7, title: 'Performance Metrics', priority: 'Medium', dueDate: 'Nov 1', subtasks: { completed: 0, total: 2 }, comments: 1, avatar: 'https://i.pravatar.cc/150?u=18', status: 'todo' },
    { id: 8, title: 'Client Feedback Sync', priority: 'High', dueDate: 'Today', subtasks: { completed: 1, total: 1 }, comments: 4, avatar: 'https://i.pravatar.cc/150?u=19', status: 'in-progress' },
    { id: 9, title: 'API Integration', priority: 'High', dueDate: 'Nov 5', subtasks: { completed: 2, total: 10 }, comments: 15, avatar: 'https://i.pravatar.cc/150?u=20', status: 'todo' },
    { id: 10, title: 'Styleguide Documentation', priority: 'Low', dueDate: 'Nov 10', subtasks: { completed: 5, total: 5 }, comments: 2, avatar: 'https://i.pravatar.cc/150?u=21', status: 'done' }
  ];

  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.tasks.set([...this.initialTasks]);
      this.isLoading.set(false);
    }, 1000);
  }

  updateTaskStatus(taskId: number, newStatus: 'todo' | 'in-progress' | 'done') {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );
  }

  addTask(task: Omit<Task, 'id'>) {
    const newTask: Task = {
      ...task,
      id: Math.max(...this.tasks().map(t => t.id), 0) + 1
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }
}
