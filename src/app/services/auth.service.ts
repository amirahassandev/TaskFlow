// import { Injectable, signal } from '@angular/core';

// export type Role = 'admin' | 'user' | null;

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: Role;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   // Signal to store current user state
//   currentUser = signal<User | null>(null);

//   setRole(role: Role) {
//     if (role === null) {
//       this.currentUser.set(null);
//     } else {
//       this.currentUser.update(user => {
//         if (user) {
//           return { ...user, role };
//         }
//         return {
//           id: '1',
//           name: role === 'admin' ? 'Admin User' : 'Team Member',
//           email: 'demo@taskflow.com',
//           role
//         };
//       });
//     }
//   }

//   logout() {
//     this.currentUser.set(null);
//   }
// }



// auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'admin' | 'user' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals لإدارة الحالة
  private _userRole = signal<UserRole>(null);
  private _isAuthenticated = signal<boolean>(false);

  // Public Getters (Read-only)
  userRole = computed(() => this._userRole());
  isAuthenticated = computed(() => this._isAuthenticated());

  constructor() {
    // محاولة استرجاع البيانات من LocalStorage في حالة عمل Refresh
    const savedRole = localStorage.getItem('user_role') as UserRole;
    if (savedRole) {
      this._userRole.set(savedRole);
      this._isAuthenticated.set(true);
    }
  }

  setAuth(role: UserRole) {
    this._userRole.set(role);
    this._isAuthenticated.set(true);
    if (role) localStorage.setItem('user_role', role);
  }

  logout() {
    this._userRole.set(null);
    this._isAuthenticated.set(false);
    localStorage.removeItem('user_role');
  }
}