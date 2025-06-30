// Generated with AI assistance - Job management component for admin CRUD operations
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JobService, JobFilters } from '../../../services/job.service';
import { JobPost, JOB_CATEGORIES } from '../../../models/job.model';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.scss']
})
export class JobManagementComponent implements OnInit {
  jobs: JobPost[] = [];
  loading = false;
  totalRecords = 0;
  rows = 10;
  first = 0;
  
  // Filtros
  categories = [{ label: 'Todas las categorías', value: '' }, ...JOB_CATEGORIES];
  selectedCategory = '';
  searchText = '';
  
  // Columnas de la tabla
  cols = [
    { field: 'title', header: 'Título' },
    { field: 'category', header: 'Categoría' },
    { field: 'location', header: 'Ubicación' },
    { field: 'is_active', header: 'Estado' },
    { field: 'applications_count', header: 'Aplicaciones' },
    { field: 'created_at', header: 'Fecha Creación' },
    { field: 'actions', header: 'Acciones' }
  ];

  constructor(
    private jobService: JobService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(event?: any): void {
    this.loading = true;
    
    const filters: JobFilters = {
      page: event ? Math.floor(event.first / event.rows) + 1 : 1,
      category: this.selectedCategory || undefined,
      search: this.searchText || undefined,
      ordering: '-created_at'
    };

    this.jobService.getAdminJobs(filters).subscribe({
      next: (response) => {
        this.jobs = response.results;
        this.totalRecords = response.count;
        this.loading = false;
        
        if (event) {
          this.first = event.first;
          this.rows = event.rows;
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los trabajos'
        });
      }
    });
  }

  onFilterChange(): void {
    this.first = 0;
    this.loadJobs();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchText = '';
    this.onFilterChange();
  }

  createJob(): void {
    this.router.navigate(['/admin/jobs/new']);
  }

  editJob(job: JobPost): void {
    this.router.navigate(['/admin/jobs', job.id, 'edit']);
  }

  confirmDelete(job: JobPost): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el trabajo "${job.title}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteJob(job);
      }
    });
  }

  private deleteJob(job: JobPost): void {
    this.jobService.deleteJob(job.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Trabajo eliminado correctamente'
        });
        this.loadJobs();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el trabajo'
        });
      }
    });
  }

  toggleJobStatus(job: JobPost): void {
    const newStatus = !job.is_active;
    this.jobService.toggleJobStatus(job.id).subscribe({
      next: () => {
        job.is_active = newStatus;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Trabajo ${newStatus ? 'activado' : 'desactivado'} correctamente`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cambiar el estado del trabajo'
        });
      }
    });
  }

  viewApplications(job: JobPost): void {
    this.router.navigate(['/admin/jobs', job.id, 'applications']);
  }

  getCategoryLabel(category: string): string {
    const cat = JOB_CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  getStatusSeverity(isActive: boolean): string {
    return isActive ? 'success' : 'warning';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Activo' : 'Inactivo';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }
}
