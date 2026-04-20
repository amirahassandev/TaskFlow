import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center flex-row items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shrink-0">TF</div>
          <h2 class="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">TaskFlow</h2>
        </div>
        <h2 class="mt-6 text-center text-2xl font-bold text-zinc-900">Sign in to your account</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-zinc-200">
          <form class="space-y-6" [formGroup]="loginForm" (ngSubmit)="onLogin()">
            <div>
              <label for="email" class="block text-sm font-medium text-zinc-700">Email address</label>
              <div class="mt-1">
                <input id="email" type="email" formControlName="email" class="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-zinc-700">Password</label>
              <div class="mt-1">
                <input id="password" type="password" formControlName="password" class="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-zinc-700">Sign in as Role</label>
              <div class="mt-1">
                <select id="role" formControlName="role" class="block w-full pl-3 pr-10 py-2 text-base border-zinc-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border bg-white">
                  <option value="" disabled selected>Select a role to test</option>
                  <option value="admin">Project Manager (Admin)</option>
                  <option value="user">Team Member (User)</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-zinc-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-zinc-900">Remember me</label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loginForm.invalid || isSubmitting()" class="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                @if(isSubmitting()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                }
                Sign in
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-zinc-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-zinc-500">Or</span>
              </div>
            </div>
            <div class="mt-6 text-center text-sm text-zinc-600">
              Don't have an account? <a routerLink="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = signal(false);

  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  // onLogin() {
  //   if (this.loginForm.valid) {
  //     this.isSubmitting.set(true);
  //     setTimeout(() => {
  //       const selectedRole: UserRole = this.loginForm.value.role;
  //       this.authService.setAuth(selectedRole);
  //       this.toastr.success(`Successfully logged in as ${selectedRole}!`, 'Welcome Back', { positionClass: 'toast-bottom-right' });
        
  //       if (selectedRole === 'admin') {
  //         this.router.navigate(['/dashboard']);
  //       } else {
  //         this.router.navigate(['/tasks']);
  //       }
        
  //       this.isSubmitting.set(false);
  //     }, 1000);
  //   }
  // }

  // داخل login.component.ts أو register.component.ts
onLogin() {
  if (this.loginForm.valid) {
    const role = this.loginForm.value.role; // 'admin' أو 'user'
    
    // 1. حفظ الصلاحية في الـ Service
    this.authService.setAuth(role);
    
    this.toastr.success(`Welcome back! Logged in as ${role}`);

    // 2. التوجيه بناءً على الصلاحية
    if (role === 'admin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
}
