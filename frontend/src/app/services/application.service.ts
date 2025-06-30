// Generated with AI assistance - Application service for job application management
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Application, ApplicationCreate, ApplicationUpdate, ApplicationList } from '../models/application.model';
import { PaginatedResponse } from './job.service';

export interface ApplicationFilters {
  status?: string;
  job_post?: number;
  ordering?: string;
  page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }

  /**
   * Apply to a job
   */
  applyToJob(jobId: number, applicationData: ApplicationCreate): Observable<any> {
    return this.http.post(`${environment.apiUrl}/jobs/${jobId}/apply/`, applicationData);
  }

  /**
   * Get user's applications
   */
  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${environment.apiUrl}/my-applications/`);
  }

  /**
   * Get all applications (admin view)
   */
  getApplications(filters?: ApplicationFilters): Observable<PaginatedResponse<ApplicationList>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.job_post) params = params.set('job_post', filters.job_post.toString());
      if (filters.ordering) params = params.set('ordering', filters.ordering);
      if (filters.page) params = params.set('page', filters.page.toString());
    }

    return this.http.get<PaginatedResponse<ApplicationList>>(`${environment.apiUrl}/applications/`, { params });
  }

  /**
   * Get application by ID
   */
  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`${environment.apiUrl}/applications/${id}/`);
  }

  /**
   * Update application status (admin only)
   */
  updateApplicationStatus(id: number, updateData: ApplicationUpdate): Observable<Application> {
    return this.http.patch<Application>(`${environment.apiUrl}/applications/${id}/update/`, updateData);
  }

  /**
   * Check if user has already applied to a job
   */
  hasAppliedToJob(jobId: number): Observable<boolean> {
    return new Observable(observer => {
      this.getMyApplications().subscribe({
        next: (applications) => {
          const hasApplied = applications.some(app => app.job_post.id === jobId);
          observer.next(hasApplied);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
} 