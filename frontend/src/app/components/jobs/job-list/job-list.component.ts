// Generated with AI assistance - Job list component with modern filters and cards
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { JobService } from '../../../services/job.service';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { JobPostList, JobCategory, JOB_CATEGORIES } from '../../../models/job.model';
import { ApplicationCreate } from '../../../models/application.model';

interface JobFilters {
  search?: string;
  category?: JobCategory;
  location?: string;
  page?: number;
}

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: JobPostList[] = [];
  loading = true;
  totalRecords = 0;
  rows = 10;
  first = 0;
  
  // Filters
  searchTerm = '';
  selectedCategory: { value: JobCategory; label: string } | null = null;
  selectedLocation = '';
  categories = JOB_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }));
  
  // Application Modal
  showApplicationModal = false;
  selectedJob: JobPostList | null = null;
  
  // Job Detail Modal
  showJobDetailModal = false;
  selectedJobForDetail: JobPostList | null = null;

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    public authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    
    const filters: JobFilters = {
      page: (this.first / this.rows) + 1
    };
    
    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }
    
    if (this.selectedCategory) {
      filters.category = this.selectedCategory.value;
    }
    
    if (this.selectedLocation) {
      filters.location = this.selectedLocation;
    }

    this.jobService.getJobs(filters).subscribe({
      next: (response) => {
        this.jobs = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las ofertas de trabajo'
        });
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.first = 0;
    this.loadJobs();
  }

  onFilterChange(): void {
    this.first = 0;
    this.loadJobs();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.selectedLocation = '';
    this.first = 0;
    this.loadJobs();
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadJobs();
  }

  applyToJob(job: JobPostList, event: Event): void {
    event.stopPropagation();
    
    if (!this.authService.isAuthenticated()) {
      this.navigateToLogin();
      return;
    }

    if (!this.canApply()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acceso Denegado',
        detail: 'Solo los candidatos pueden aplicar a trabajos'
      });
      return;
    }

    this.selectedJob = job;
    this.showApplicationModal = true;
  }

  onApplicationSubmitted(): void {
    this.loadJobs(); // Refresh the job list to update application counts
  }

  viewJobDetail(job: JobPostList): void {
    this.selectedJobForDetail = job;
    this.showJobDetailModal = true;
  }

  onJobDetailApply(job: JobPostList): void {
    this.selectedJob = job;
    this.showApplicationModal = true;
  }

  canApply(): boolean {
    return this.authService.isAuthenticated() && this.authService.isApplicant();
  }

  isAdmin(): boolean {
    return this.authService.isAuthenticated() && this.authService.isAdmin();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  getCategoryLabel(category: JobCategory): string {
    const cat = JOB_CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
} 