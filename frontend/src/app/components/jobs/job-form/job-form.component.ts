// Generated with AI assistance - Job form component for create/edit operations
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { JobService } from '../../../services/job.service';
import { JobPost, JobPostCreate, JOB_CATEGORIES, JobCategory } from '../../../models/job.model';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  loading = false;
  isEditMode = false;
  jobId?: number;
  categories = JOB_CATEGORIES;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.jobForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.jobId = +params['id'];
        this.loadJob();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      salary_min: [null, [Validators.min(0)]],
      salary_max: [null, [Validators.min(0)]],
      requirements: [''],
      benefits: [''],
      is_active: [true]
    }, { validators: this.salaryValidator });
  }

  private salaryValidator(group: FormGroup) {
    const salaryMin = group.get('salary_min')?.value;
    const salaryMax = group.get('salary_max')?.value;
    
    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      return { salaryRange: true };
    }
    return null;
  }

  private loadJob(): void {
    if (!this.jobId) return;
    
    this.loading = true;
    this.jobService.getJob(this.jobId).subscribe({
      next: (job: JobPost) => {
        this.jobForm.patchValue({
          title: job.title,
          description: job.description,
          location: job.location,
          category: job.category,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          requirements: job.requirements,
          benefits: job.benefits,
          is_active: job.is_active
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el trabajo'
        });
        this.router.navigate(['/admin/jobs']);
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.loading = true;
      const jobData: JobPostCreate = this.jobForm.value;

      const operation = this.isEditMode 
        ? this.jobService.updateJob(this.jobId!, jobData)
        : this.jobService.createJob(jobData);

      operation.subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: this.isEditMode ? 'Trabajo actualizado correctamente' : 'Trabajo creado correctamente'
          });
          this.router.navigate(['/admin/jobs']);
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al guardar el trabajo'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/jobs']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.jobForm.controls).forEach(key => {
      this.jobForm.get(key)?.markAsTouched();
    });
  }

  // Getters for form validation
  get title() { return this.jobForm.get('title'); }
  get description() { return this.jobForm.get('description'); }
  get location() { return this.jobForm.get('location'); }
  get category() { return this.jobForm.get('category'); }
  get salary_min() { return this.jobForm.get('salary_min'); }
  get salary_max() { return this.jobForm.get('salary_max'); }
  get requirements() { return this.jobForm.get('requirements'); }
  get benefits() { return this.jobForm.get('benefits'); }
  get is_active() { return this.jobForm.get('is_active'); }
}
