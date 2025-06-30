// Generated with AI assistance - Job Application Form Modal Component
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApplicationService } from '../../../services/application.service';
import { JobPostList } from '../../../models/job.model';
import { ApplicationCreate } from '../../../models/application.model';

@Component({
  selector: 'app-job-application-form',
  templateUrl: './job-application-form.component.html',
  styleUrls: ['./job-application-form.component.scss']
})
export class JobApplicationFormComponent implements OnInit {
  @Input() visible = false;
  @Input() job: JobPostList | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() applicationSubmitted = new EventEmitter<void>();

  applicationForm!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      cover_letter: ['', [Validators.maxLength(2000)]],
      resume_url: ['', [Validators.pattern(/^https?:\/\/.+/)]]
    });
  }

  onDialogHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm(): void {
    this.applicationForm.reset();
    this.submitting = false;
  }

  onSubmit(): void {
    if (this.applicationForm.valid && this.job) {
      this.submitting = true;
      
      const applicationData: ApplicationCreate = {
        cover_letter: this.applicationForm.get('cover_letter')?.value || undefined,
        resume_url: this.applicationForm.get('resume_url')?.value || undefined
      };

      this.applicationService.applyToJob(this.job.id, applicationData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Aplicación Enviada!',
            detail: 'Tu aplicación ha sido enviada correctamente'
          });
          this.applicationSubmitted.emit();
          this.onDialogHide();
        },
        error: (error) => {
          console.error('Error submitting application:', error);
          let errorMessage = 'Error al enviar la aplicación';
          
          if (error.error?.detail) {
            errorMessage = error.error.detail;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.applicationForm.controls).forEach(key => {
      const control = this.applicationForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.applicationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.applicationForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return 'Debe ser una URL válida (http:// o https://)';
      }
    }
    return '';
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