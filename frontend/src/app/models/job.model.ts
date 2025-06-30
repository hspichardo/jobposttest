// Generated with AI assistance - Job model interface
import { User } from './user.model';

export interface JobPost {
  id: number;
  title: string;
  description: string;
  location: string;
  category: JobCategory;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  benefits?: string;
  is_active: boolean;
  created_by: User;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export interface JobPostCreate {
  title: string;
  description: string;
  location: string;
  category: JobCategory;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  benefits?: string;
  is_active?: boolean;
}

export interface JobPostList {
  id: number;
  title: string;
  description: string;
  location: string;
  category: JobCategory;
  salary_min?: number;
  salary_max?: number;
  created_by_name: string;
  applications_count: number;
  created_at: string;
}

export type JobCategory = 
  | 'technology' 
  | 'marketing' 
  | 'sales' 
  | 'design' 
  | 'finance' 
  | 'human_resources' 
  | 'customer_service' 
  | 'operations' 
  | 'other';

export const JOB_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: 'technology', label: 'Tecnología' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Ventas' },
  { value: 'design', label: 'Diseño' },
  { value: 'finance', label: 'Finanzas' },
  { value: 'human_resources', label: 'Recursos Humanos' },
  { value: 'customer_service', label: 'Atención al Cliente' },
  { value: 'operations', label: 'Operaciones' },
  { value: 'other', label: 'Otro' }
]; 