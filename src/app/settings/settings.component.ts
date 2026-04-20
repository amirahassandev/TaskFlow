import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { NgClass } from '@angular/common';

type Tab = 'overview' | 'security' | 'preferences';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 pb-12">
      
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-zinc-200">
        <!-- Cover Image -->
        <div class="h-32 bg-gradient-to-r from-indigo-500 to-violet-600 w-full relative">
           <button class="absolute bottom-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg transition-colors border border-white/20">
             Change Cover
           </button>
        </div>
        
        <div class="px-6 sm:px-10 pb-6 relative">
          <!-- Avatar -->
          <div class="flex items-end -mt-12 mb-4 justify-between">
            <div class="flex items-end gap-5">
              <div class="w-24 h-24 rounded-full border-4 border-white shadow-md bg-zinc-200 overflow-hidden relative group">
                <img src="https://i.pravatar.cc/150?u=993" alt="Avatar" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                  <span class="text-white text-xs font-medium">Edit</span>
                </div>
              </div>
              <div class="pb-2">
                <h1 class="text-2xl font-bold text-zinc-900">{{ userName() }}</h1>
                <div class="flex items-center gap-2 mt-1">
                  <span 
                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    [ngClass]="{
                      'bg-rose-100 text-rose-700': userRole() === 'admin',
                      'bg-indigo-100 text-indigo-700': userRole() === 'user'
                    }">
                    {{ userRole() === 'admin' ? 'Project Manager' : 'Team Member' }}
                  </span>
                  <span class="text-sm text-zinc-500">demo&#64;taskflow.com</span>
                </div>
              </div>
            </div>
            
            <div class="pb-2 hidden sm:block">
              <button (click)="saveChanges()" [disabled]="isSaving()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all text-sm flex items-center gap-2 disabled:opacity-70">
                @if(isSaving()) {
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                }
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="border-t border-zinc-200 px-6 sm:px-10">
          <nav class="flex gap-6">
            <button 
              (click)="activeTab.set('overview')" 
              class="py-4 text-sm font-medium border-b-2 transition-colors"
              [ngClass]="activeTab() === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'">
              Overview
            </button>
            <button 
              (click)="activeTab.set('security')" 
              class="py-4 text-sm font-medium border-b-2 transition-colors"
              [ngClass]="activeTab() === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'">
              Security
            </button>
            <button 
              (click)="activeTab.set('preferences')" 
              class="py-4 text-sm font-medium border-b-2 transition-colors"
              [ngClass]="activeTab() === 'preferences' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'">
              Preferences
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 sm:p-10">
        
        <!-- Overview Tab -->
        @if (activeTab() === 'overview') {
          <div class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            <h2 class="text-xl font-bold text-zinc-900">Dashboard Overview</h2>
            
            @if (userRole() === 'admin') {
              <!-- Admin Overview -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Stats Cards -->
                <div class="bg-zinc-50 p-5 rounded-xl border border-zinc-100 flex flex-col justify-center">
                  <p class="text-sm text-zinc-500 font-medium tracking-wide">Teams Managed</p>
                  <p class="text-3xl font-bold text-indigo-600 mt-2">4</p>
                </div>
                <div class="bg-zinc-50 p-5 rounded-xl border border-zinc-100 flex flex-col justify-center">
                  <p class="text-sm text-zinc-500 font-medium tracking-wide">Total Projects</p>
                  <p class="text-3xl font-bold text-zinc-900 mt-2">12</p>
                </div>
                <div class="bg-zinc-50 p-5 rounded-xl border border-zinc-100 flex flex-col justify-center">
                  <p class="text-sm text-zinc-500 font-medium tracking-wide">Company Tasks</p>
                  <p class="text-3xl font-bold text-emerald-600 mt-2">342</p>
                </div>
              </div>
              
              <div class="mt-8 border-t border-zinc-200 pt-8">
                <h3 class="text-lg font-bold text-zinc-800 mb-4">Quick Actions</h3>
                <div class="flex flex-wrap gap-4">
                  <button class="bg-white border border-zinc-300 hover:border-indigo-500 hover:text-indigo-600 text-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm">
                    Manage Team Members
                  </button>
                  <button class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors border border-indigo-100">
                    Export Company Reports
                  </button>
                </div>
              </div>
            } @else {
              <!-- User Overview -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Stats Cards -->
                <div class="bg-zinc-50 p-5 rounded-xl border border-zinc-100 flex flex-col justify-center">
                  <p class="text-sm text-zinc-500 font-medium tracking-wide">Tasks Completed</p>
                  <p class="text-3xl font-bold text-indigo-600 mt-2">45</p>
                </div>
                <div class="bg-zinc-50 p-5 rounded-xl border border-zinc-100 flex flex-col justify-center">
                  <p class="text-sm text-zinc-500 font-medium tracking-wide">Active Tasks</p>
                  <p class="text-3xl font-bold text-zinc-900 mt-2">4</p>
                </div>
                <div class="bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col justify-center">
                  <p class="text-sm text-emerald-600 font-medium tracking-wide">Reliability Score</p>
                  <p class="text-3xl font-bold text-emerald-700 mt-2">98%</p>
                </div>
              </div>
              
              <div class="mt-8 border-t border-zinc-200 pt-8">
                <h3 class="text-lg font-bold text-zinc-800 mb-4">Recent Activity</h3>
                <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                  <ul class="divide-y divide-zinc-100">
                    @for (task of recentTasks; track task.id) {
                      <li class="px-6 py-4 hover:bg-zinc-50 transition-colors flex justify-between items-center">
                        <div>
                          <p class="text-sm font-medium text-zinc-900">{{ task.title }}</p>
                          <p class="text-xs text-zinc-500 mt-1">{{ task.date }} IN {{ task.project }}</p>
                        </div>
                        <span class="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-md">
                          {{ task.status }}
                        </span>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            }
          </div>
        }

        <!-- Security Tab -->
        @if (activeTab() === 'security') {
          <div class="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg">
            <h2 class="text-xl font-bold text-zinc-900 mb-6">Change Password</h2>
            
            <form [formGroup]="securityForm" (ngSubmit)="saveChanges()" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-1">Current Password</label>
                <input type="password" formControlName="currentPassword" class="w-full px-4 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-1">New Password</label>
                <input type="password" formControlName="newPassword" class="w-full px-4 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium text-zinc-700 mb-1">Confirm New Password</label>
                <input type="password" formControlName="confirmPassword" class="w-full px-4 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm">
                
                @if (securityForm.hasError('mismatch') && securityForm.get('confirmPassword')?.touched) {
                  <p class="text-rose-500 text-xs mt-2">Passwords do not match.</p>
                }
              </div>
            </form>
          </div>
        }

        <!-- Preferences Tab -->
        @if (activeTab() === 'preferences') {
          <div class="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl">
            <h2 class="text-xl font-bold text-zinc-900 mb-6">Application Preferences</h2>
            
            <div class="space-y-6">
              <!-- Toggle 1 -->
              <div class="flex items-center justify-between py-3 border-b border-zinc-100">
                <div>
                  <h4 class="text-sm font-medium text-zinc-900">Email Notifications</h4>
                  <p class="text-sm text-zinc-500 mt-0.5">Receive daily summaries and mention alerts via email.</p>
                </div>
                <button 
                  (click)="prefs.email = !prefs.email"
                  [ngClass]="prefs.email ? 'bg-indigo-600' : 'bg-zinc-200'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
                  <span 
                    [ngClass]="prefs.email ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>

              <!-- Toggle 2 -->
              <div class="flex items-center justify-between py-3 border-b border-zinc-100">
                <div>
                  <h4 class="text-sm font-medium text-zinc-900">Desktop Alerts</h4>
                  <p class="text-sm text-zinc-500 mt-0.5">Get push notifications for priority tasks and messages.</p>
                </div>
                <button 
                  (click)="prefs.desktop = !prefs.desktop"
                  [ngClass]="prefs.desktop ? 'bg-indigo-600' : 'bg-zinc-200'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
                  <span 
                    [ngClass]="prefs.desktop ? 'translate-x-5' : 'translate-x-0'"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>

              <!-- Theme Selection -->
              <div class="py-3">
                <h4 class="text-sm font-medium text-zinc-900 mb-3">Interface Theme</h4>
                <div class="flex gap-4">
                  <button 
                    (click)="prefs.theme = 'light'"
                    [ngClass]="prefs.theme === 'light' ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-zinc-200'"
                    class="border rounded-xl p-4 flex flex-col items-center gap-3 bg-white w-32 hover:border-indigo-300 transition-all">
                    <div class="w-full h-16 bg-zinc-50 rounded-lg border border-zinc-200 flex flex-col gap-2 p-2">
                      <div class="h-2 w-full bg-white rounded shadow-sm"></div>
                      <div class="h-2 w-2/3 bg-zinc-200 rounded"></div>
                    </div>
                    <span class="text-sm font-medium text-zinc-700">Light</span>
                  </button>
                  
                  <button 
                    (click)="prefs.theme = 'dark'"
                    [ngClass]="prefs.theme === 'dark' ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-zinc-200'"
                    class="border rounded-xl p-4 flex flex-col items-center gap-3 bg-white w-32 hover:border-indigo-300 transition-all">
                    <div class="w-full h-16 bg-zinc-900 rounded-lg border border-zinc-700 flex flex-col gap-2 p-2">
                      <div class="h-2 w-full bg-zinc-800 rounded shadow-sm"></div>
                      <div class="h-2 w-2/3 bg-zinc-700 rounded"></div>
                    </div>
                    <span class="text-sm font-medium text-zinc-700">Dark</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

      </div>

      <!-- Mobile Save Button -->
      <div class="sm:hidden block">
        <button (click)="saveChanges()" [disabled]="isSaving()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition-all flex justify-center items-center gap-2">
            @if(isSaving()) {
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            }
            Save Changes
        </button>
      </div>

    </div>
  `
})
export class SettingsComponent {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);

  activeTab = signal<Tab>('overview');
  isSaving = signal(false);

  userRole = computed(() => this.authService.userRole());
  userName = computed(() => this.userRole() === 'admin' ? 'Sarah Connor' : 'Alex Morrison');

  prefs = {
    email: true,
    desktop: false,
    theme: 'light'
  };

  recentTasks = [
    { id: 1, title: 'Update homepage copy', project: 'Website Redesign', date: '2 hours ago', status: 'Done' },
    { id: 2, title: 'Fix mobile navigation bug', project: 'Mobile App V2', date: 'Yesterday', status: 'In Progress' },
    { id: 3, title: 'Draft Q3 Marketing Plan', project: 'Marketing Campaign', date: '2 days ago', status: 'Done' },
    { id: 4, title: 'API Integration testing', project: 'Backend Migration', date: '3 days ago', status: 'To Do' },
    { id: 5, title: 'Client presentation slides', project: 'Acme Corp Pitch', date: 'Last week', status: 'Done' }
  ];

  securityForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  saveChanges() {
    if (this.activeTab() === 'security' && this.securityForm.invalid) {
      this.toastr.error('Please fix the errors in the security form.', 'Form Invalid');
      return;
    }

    this.isSaving.set(true);
    
    setTimeout(() => {
      this.isSaving.set(false);
      
      if (this.activeTab() === 'security') {
        this.toastr.success('Password updated successfully!', 'Security Saved');
        this.securityForm.reset();
      } else {
        this.toastr.success('Profile preferences updated.', 'Settings Saved');
      }
    }, 1500);
  }
}
