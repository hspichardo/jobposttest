// Generated with AI assistance - Login component with reactive forms
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.redirectUser();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: response.message
          });
          
          // Wait a bit for the user to be loaded asynchronously
          setTimeout(() => {
            this.redirectUser();
            this.loading = false;
          }, 500);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al iniciar sesión'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private redirectUser(): void {
    // Subscribe to current user to get the latest state
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      console.log('Redirecting user:', user);
      if (user?.role === 'admin') {
        this.router.navigate(['/admin/jobs']);
      } else {
        this.router.navigate(['/jobs']);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
} 