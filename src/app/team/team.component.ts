import { Component, inject, signal, computed } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-2xl font-bold text-zinc-900">Team Members</h1>
        
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search members..." class="w-full sm:w-64 px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <button (click)="isModalOpen.set(true)" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm whitespace-nowrap">
            Invite Member
          </button>
        </div>
      </div>

      <div class="bg-white shadow-sm rounded-xl border border-zinc-200 overflow-x-auto">
        <table class="min-w-full divide-y divide-zinc-200">
          <thead class="bg-zinc-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Member</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="relative px-6 py-3"><span class="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-zinc-200">
            @for (member of filteredTeam(); track member.id) {
              <tr class="hover:bg-zinc-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" [src]="member.avatar" alt="">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-zinc-900">{{ member.name }}</div>
                      <div class="text-sm text-zinc-500">{{ member.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-zinc-900">{{ member.role }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full hover:opacity-80 transition-opacity cursor-pointer"
                    (click)="toggleStatus(member)"
                    [class.bg-emerald-100]="member.status === 'Active'"
                    [class.text-emerald-800]="member.status === 'Active'"
                    [class.bg-rose-100]="member.status === 'Inactive'"
                    [class.text-rose-800]="member.status === 'Inactive'">
                    {{ member.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button (click)="editMember(member)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if(filteredTeam().length === 0) {
          <div class="p-8 text-center text-zinc-500">No members found matching your search.</div>
        }
      </div>
    </div>

    <!-- Invite Member Modal -->
    @if(isModalOpen()) {
      <div class="fixed inset-0 bg-zinc-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h3 class="text-lg font-bold text-zinc-900">Invite Team Member</h3>
            <button (click)="isModalOpen.set(false)" class="text-zinc-400 hover:text-zinc-600 transition-colors">&times;</button>
          </div>
          <div class="p-6 flex-1 space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
              <input type="email" [(ngModel)]="newMember.email" placeholder="email@example.com" class="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Role</label>
              <select [(ngModel)]="newMember.role" class="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                <option value="Frontend Dev">Frontend Dev</option>
                <option value="Backend Dev">Backend Dev</option>
                <option value="Designer">Designer</option>
                <option value="Project Manager">Project Manager</option>
              </select>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
            <button (click)="isModalOpen.set(false)" class="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
            <button (click)="submitInvite()" [disabled]="isSubmitting() || !newMember.email" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
              @if(isSubmitting()) {
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              }
              Send Invite
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Edit Member Modal -->
    @if(isEditModalOpen()) {
      <div class="fixed inset-0 bg-zinc-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h3 class="text-lg font-bold text-zinc-900">Edit Member</h3>
            <button (click)="isEditModalOpen.set(false)" class="text-zinc-400 hover:text-zinc-600 transition-colors">&times;</button>
          </div>
          <div class="p-6 flex-1 space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
              <input type="text" [(ngModel)]="selectedMember.name" class="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-700 mb-1">Role</label>
              <input type="text" [(ngModel)]="selectedMember.role" class="w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>
          <div class="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
            <button (click)="isEditModalOpen.set(false)" class="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
            <button (click)="saveMember()" [disabled]="isSubmitting()" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
              @if(isSubmitting()) {
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              }
              Save Changes
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class TeamComponent {
  toastr = inject(ToastrService);

  searchQuery = signal('');
  isModalOpen = signal(false);
  isEditModalOpen = signal(false);
  isSubmitting = signal(false);

  newMember = { email: '', role: 'Frontend Dev' };
  selectedMember = { id: 0, name: '', role: '' };

  team = signal([
    { id: 1, name: 'Alex Morrison', email: 'alex@taskflow.com', role: 'Project Manager', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=21' },
    { id: 2, name: 'Sarah Connor', email: 'sarah@taskflow.com', role: 'Lead Designer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=22' },
    { id: 3, name: 'John Smith', email: 'john@taskflow.com', role: 'Frontend Dev', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=23' },
    { id: 4, name: 'Emily Davis', email: 'emily@taskflow.com', role: 'Backend Dev', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=24' },
  ]);

  filteredTeam = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.team().filter(m => m.name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query) || m.role.toLowerCase().includes(query));
  });

  openModal() {
    this.newMember = { email: '', role: 'Frontend Dev' };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  submitInvite() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.team.update(t => [...t, {
        id: Date.now(),
        name: 'Pending Invite',
        email: this.newMember.email,
        role: this.newMember.role,
        status: 'Inactive',
        avatar: 'https://i.pravatar.cc/150?u=99'
      }]);
      this.isSubmitting.set(false);
      this.closeModal();
      this.toastr.success('Invitation sent!', 'Success');
    }, 800);
  }

  editMember(member: any) {
    this.selectedMember = { ...member };
    this.isEditModalOpen.set(true);
  }

  saveMember() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.team.update(teams => teams.map(t => t.id === this.selectedMember.id ? { ...t, name: this.selectedMember.name, role: this.selectedMember.role } : t));
      this.isSubmitting.set(false);
      this.isEditModalOpen.set(false);
      this.toastr.success('Member details updated!', 'Success');
    }, 800);
  }

  toggleStatus(member: any) {
    const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
    this.team.update(teams => teams.map(t => t.id === member.id ? { ...t, status: newStatus } : t));
    this.toastr.success(`Status changed to ${newStatus}`, 'Updated');
  }
}
