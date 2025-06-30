// Generated with AI assistance - My Applications component for applicants
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../models/application.model';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  
  constructor(
    private applicationService: ApplicationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyApplications();
  }

  loadMyApplications(): void {
    this.loading = true;
    this.applicationService.getMyApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las aplicaciones'
        });
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'interviewed':
        return 'info';
      case 'reviewing':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'reviewing':
        return 'En Revisión';
      case 'interviewed':
        return 'Entrevistado';
      case 'accepted':
        return 'Aceptado';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  }

  viewJobDetails(application: Application): void {
    // Navegar a los detalles del trabajo
    this.router.navigate(['/jobs'], { 
      queryParams: { 
        highlight: application.job_post.id 
      } 
    });
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
} 