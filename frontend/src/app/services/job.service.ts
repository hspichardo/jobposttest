// Generated with AI assistance - Job service for CRUD operations and job management
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobPost, JobPostCreate, JobPostList } from '../models/job.model';

export interface JobFilters {
  category?: string;
  location?: string;
  search?: string;
  ordering?: string;
  page?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }

  /**
   * Get all jobs (public access)
   */
  getJobs(filters?: JobFilters): Observable<PaginatedResponse<JobPostList>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.ordering) params = params.set('ordering', filters.ordering);
      if (filters.page) params = params.set('page', filters.page.toString());
    }

    return this.http.get<PaginatedResponse<JobPostList>>(`${environment.apiUrl}/jobs/`, { params });
  }

  /**
   * Get job by ID (public access)
   */
  getJobById(id: number): Observable<JobPost> {
    return this.http.get<JobPost>(`${environment.apiUrl}/jobs/${id}/`);
  }

  /**
   * Get job by ID for admin (includes all details for editing)
   */
  getJob(id: number): Observable<JobPost> {
    return this.http.get<JobPost>(`${environment.apiUrl}/admin/jobs/${id}/`);
  }

  /**
   * Get all jobs for admin
   */
  getAdminJobs(filters?: JobFilters): Observable<PaginatedResponse<JobPost>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.ordering) params = params.set('ordering', filters.ordering);
      if (filters.page) params = params.set('page', filters.page.toString());
    }

    return this.http.get<PaginatedResponse<JobPost>>(`${environment.apiUrl}/admin/jobs/`, { params });
  }

  /**
   * Create new job (admin only)
   */
  createJob(jobData: JobPostCreate): Observable<JobPost> {
    return this.http.post<JobPost>(`${environment.apiUrl}/admin/jobs/create/`, jobData);
  }

  /**
   * Update job (admin only)
   */
  updateJob(id: number, jobData: Partial<JobPostCreate>): Observable<JobPost> {
    return this.http.put<JobPost>(`${environment.apiUrl}/admin/jobs/${id}/update/`, jobData);
  }

  /**
   * Delete job (admin only)
   */
  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/jobs/${id}/delete/`);
  }

  /**
   * Get applications for a specific job (admin only)
   */
  getJobApplications(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/jobs/${jobId}/applications/`);
  }

  /**
   * Get unique job locations for filtering
   */
  getJobLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/jobs/locations/`);
  }
} 