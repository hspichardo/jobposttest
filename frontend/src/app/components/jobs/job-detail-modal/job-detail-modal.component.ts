// Generated with AI assistance - Job Detail Modal Component
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { JobPostList, JobCategory, JOB_CATEGORIES } from '../../../models/job.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-job-detail-modal',
  templateUrl: './job-detail-modal.component.html',
  styleUrls: ['./job-detail-modal.component.scss']
})
export class JobDetailModalComponent {
  @Input() visible = false;
  @Input() job: JobPostList | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() applyToJob = new EventEmitter<JobPostList>();

  constructor(public authService: AuthService) {}

  onDialogHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onApplyClick(): void {
    if (this.job) {
      this.applyToJob.emit(this.job);
      this.onDialogHide();
    }
  }

  getCategoryLabel(category: JobCategory): string {
    const cat = JOB_CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatSalary(min?: number, max?: number): string {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()} USD`;
    } else if (min) {
      return `Desde $${min.toLocaleString()} USD`;
    } else if (max) {
      return `Hasta $${max.toLocaleString()} USD`;
    }
    return 'Salario a negociar';
  }

  canApply(): boolean {
    return this.authService.isAuthenticated() && this.authService.isApplicant();
  }

  isAdmin(): boolean {
    return this.authService.isAuthenticated() && this.authService.isAdmin();
  }
} 