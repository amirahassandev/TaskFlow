import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-zinc-900">Analytics & Reports</h1>
        <button (click)="exportReport()" [disabled]="isExporting()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm flex items-center gap-2">
          @if(isExporting()) {
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          }
          Export PDF
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tasks Analytics Overview -->
        <div class="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm relative group">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-zinc-900">Tasks Completion (Weekly)</h2>
            <button (click)="editChart()" class="opacity-0 group-hover:opacity-100 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs px-2 py-1 rounded transition-all">Edit</button>
          </div>
          <div class="flex items-end gap-2 h-48 mt-6">
            @for (day of weeklyData; track day.label) {
              <div class="flex-1 flex flex-col items-center gap-2 group/bar">
                <div class="w-full bg-indigo-100 rounded-t-md relative flex items-end justify-center">
                  <div class="w-full bg-indigo-500 rounded-t-md transition-all group-hover/bar:bg-indigo-400" [style.height.%]="day.value"></div>
                </div>
                <span class="text-xs text-zinc-500 font-medium">{{ day.label }}</span>
              </div>
            }
          </div>
        </div>

        <!-- KPI Summary -->
        <div class="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col gap-4 relative group">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-bold text-zinc-900">Performance Summary</h2>
            <button (click)="configureKPIs()" class="opacity-0 group-hover:opacity-100 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs px-2 py-1 rounded transition-all">Configure</button>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-zinc-50 p-4 rounded-lg border border-zinc-100 overflow-hidden relative">
              <p class="text-sm text-zinc-500 relative z-10">Avg. Completion Time</p>
              <p class="text-2xl font-bold text-zinc-900 mt-1 relative z-10">2.4 <span class="text-sm font-medium text-zinc-500">days</span></p>
            </div>
            <div class="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <p class="text-sm text-emerald-600">Tasks On Time</p>
              <p class="text-2xl font-bold text-emerald-700 mt-1">94%</p>
            </div>
            <div class="bg-rose-50 p-4 rounded-lg border border-rose-100">
              <p class="text-sm text-rose-600">Overdue Rate</p>
              <p class="text-2xl font-bold text-rose-700 mt-1">6%</p>
            </div>
            <div class="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
              <p class="text-sm text-zinc-500">Total Hours Tracked</p>
              <p class="text-2xl font-bold text-zinc-900 mt-1">1,240 <span class="text-sm font-medium text-zinc-500">hrs</span></p>
            </div>
          </div>
        </div>
    </div>

    <!-- Configuration Modal -->
    @if(isModalOpen()) {
      <div class="fixed inset-0 bg-zinc-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <h3 class="text-lg font-bold text-zinc-900">Configure Dashboard</h3>
            <button (click)="isModalOpen.set(false)" class="text-zinc-400 hover:text-zinc-600 transition-colors">&times;</button>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-zinc-600">Select which analytics you want to prioritize in your overview.</p>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 border border-zinc-100 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors">
                <input type="checkbox" checked class="accent-indigo-600">
                <span class="text-sm font-medium">Weekly Task Completion</span>
              </label>
              <label class="flex items-center gap-3 p-3 border border-zinc-100 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors">
                <input type="checkbox" checked class="accent-indigo-600">
                <span class="text-sm font-medium">On-Time Performance Rate</span>
              </label>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
            <button (click)="isModalOpen.set(false)" class="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">Cancel</button>
            <button (click)="isModalOpen.set(false)" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">Save Setup</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ReportsComponent {
  toastr = inject(ToastrService);
  isExporting = signal(false);
  isModalOpen = signal(false);

  weeklyData = [
    { label: 'Mon', value: 40 },
    { label: 'Tue', value: 65 },
    { label: 'Wed', value: 30 },
    { label: 'Thu', value: 80 },
    { label: 'Fri', value: 55 },
    { label: 'Sat', value: 20 },
    { label: 'Sun', value: 10 },
  ];

  exportReport() {
    this.isExporting.set(true);
    setTimeout(() => {
      this.isExporting.set(false);
      this.toastr.success('Report exported to PDF', 'Success');
    }, 1500);
  }

  editChart() {
    this.isModalOpen.set(true);
  }

  configureKPIs() {
    this.isModalOpen.set(true);
  }
}
