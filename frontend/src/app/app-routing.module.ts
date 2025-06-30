// Generated with AI assistance - Application routing with guards and lazy loading
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// Components
import { LoginComponent } from './components/auth/login/login.component';
import { JobListComponent } from './components/jobs/job-list/job-list.component';
import { JobFormComponent } from './components/jobs/job-form/job-form.component';
import { JobManagementComponent } from './components/admin/job-management/job-management.component';
import { MyApplicationsComponent } from './components/jobs/my-applications/my-applications.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobListComponent },
  
  // Auth routes
  { path: 'login', component: LoginComponent },
  
  // Applicant routes (require authentication)
  { 
    path: 'my-applications', 
    component: MyApplicationsComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Admin routes (require admin role)
  { 
    path: 'admin/jobs', 
    component: JobManagementComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'admin/jobs/new', 
    component: JobFormComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'admin/jobs/:id/edit', 
    component: JobFormComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  
  // Fallback route
  { path: '**', redirectTo: '/jobs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 