// Generated with AI assistance - User model interface
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'admin' | 'applicant';
  is_active: boolean;
  date_joined: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'admin' | 'applicant';
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  message: string;
  tokens: {
    access: string;
    refresh: string;
    user: User;
  };
} 