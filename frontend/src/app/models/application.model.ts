// Generated with AI assistance - Application model interface
import { User } from './user.model';
import { JobPost } from './job.model';

export interface Application {
  id: number;
  job_post: JobPost;
  applicant: User;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  notes?: string;
  submitted_at: string;
  updated_at: string;
}

export interface ApplicationCreate {
  cover_letter?: string;
  resume_url?: string;
}

export interface ApplicationUpdate {
  status: ApplicationStatus;
  notes?: string;
}

export interface ApplicationList {
  id: number;
  job_title: string;
  applicant_name: string;
  applicant_email: string;
  status: ApplicationStatus;
  submitted_at: string;
}

export type ApplicationStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'interviewed' 
  | 'accepted' 
  | 'rejected';

export const APPLICATION_STATUSES: { value: ApplicationStatus; label: string; severity: string }[] = [
  { value: 'pending', label: 'Pendiente', severity: 'info' },
  { value: 'reviewing', label: 'En Revisión', severity: 'warning' },
  { value: 'interviewed', label: 'Entrevistado', severity: 'help' },
  { value: 'accepted', label: 'Aceptado', severity: 'success' },
  { value: 'rejected', label: 'Rechazado', severity: 'danger' }
]; 