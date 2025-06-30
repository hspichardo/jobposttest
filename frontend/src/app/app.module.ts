// Generated with AI assistance - Main Angular application module with PrimeNG integration
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';

// Application Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { JobListComponent } from './components/jobs/job-list/job-list.component';
import { JobFormComponent } from './components/jobs/job-form/job-form.component';
import { JobManagementComponent } from './components/admin/job-management/job-management.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { MyApplicationsComponent } from './components/jobs/my-applications/my-applications.component';
import { JobApplicationFormComponent } from './components/jobs/job-application-form/job-application-form.component';

// Services and Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MessageService, ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    JobListComponent,
    JobFormComponent,
    JobManagementComponent,
    NavbarComponent,
    LoadingComponent,
    MyApplicationsComponent,
    JobApplicationFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    // PrimeNG Modules
    MenubarModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    CheckboxModule,
    DropdownModule,
    TableModule,
    PaginatorModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ChipModule,
    BadgeModule,
    DividerModule,
    FieldsetModule,
    TagModule,
    ToolbarModule,
    PanelModule,
    TooltipModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 