import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TaskService, Task } from '../services/task.service';
import {
  LucideAngularModule,
  Plus,
  MoreHorizontal,
  Calendar,
  CheckSquare,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [NgClass, LucideAngularModule, FormsModule],
  templateUrl: './task-board.component.html'
})
export class TaskBoardComponent {
  taskService = inject(TaskService);
  toastr = inject(ToastrService);

  icons = {
    plus: Plus,
    more: MoreHorizontal,
    calendar: Calendar,
    checkSquare: CheckSquare,
    message: MessageSquare,
    arrowRight: ArrowRight,
    arrowLeft: ArrowLeft,
    loader: Loader2
  };

  isModalOpen = signal(false);
  isSubmitting = signal(false);

  newTask = {
    title: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    dueDate: ''
  };

  todoTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'in-progress'));
  doneTasks = computed(() => this.taskService.tasks().filter(t => t.status === 'done'));

  columns = computed(() => [
    { id: 'todo' as const, title: 'To Do', colorClass: 'bg-zinc-100', headerDotClass: 'bg-zinc-400', tasks: this.todoTasks() },
    { id: 'in-progress' as const, title: 'In Progress', colorClass: 'bg-indigo-50/50', headerDotClass: 'bg-indigo-500', tasks: this.inProgressTasks() },
    { id: 'done' as const, title: 'Done', colorClass: 'bg-emerald-50/50', headerDotClass: 'bg-emerald-500', tasks: this.doneTasks() }
  ]);

  getPriorityColor(priority: string): string {
    switch(priority) {
      case 'High': return 'bg-rose-100 text-rose-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Low': return 'bg-sky-100 text-sky-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  }

  moveTask(task: Task, direction: 'forward' | 'backward') {
    let newStatus: 'todo' | 'in-progress' | 'done' = task.status;
    
    if (task.status === 'todo' && direction === 'forward') newStatus = 'in-progress';
    else if (task.status === 'in-progress' && direction === 'forward') newStatus = 'done';
    else if (task.status === 'done' && direction === 'backward') newStatus = 'in-progress';
    else if (task.status === 'in-progress' && direction === 'backward') newStatus = 'todo';

    if (newStatus !== task.status) {
      this.taskService.updateTaskStatus(task.id, newStatus);
      this.toastr.success('Task moved successfully!', 'Task Updated', {
        positionClass: 'toast-bottom-right'
      });
    }
  }

  openModal() {
    this.isModalOpen.set(true);
    this.newTask = { title: '', priority: 'Medium', dueDate: '' };
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  submitTask() {
    if (!this.newTask.title) return;
    
    this.isSubmitting.set(true);
    
    // Simulate API delay
    setTimeout(() => {
      this.taskService.addTask({
        title: this.newTask.title,
        priority: this.newTask.priority,
        dueDate: this.newTask.dueDate || 'No Date',
        subtasks: { completed: 0, total: 0 },
        comments: 0,
        avatar: 'https://i.pravatar.cc/150?u=99',
        status: 'todo'
      });
      
      this.isSubmitting.set(false);
      this.closeModal();
      this.toastr.success('Task created successfully!', 'Task Added', {
        positionClass: 'toast-bottom-right'
      });
    }, 800);
  }
}
