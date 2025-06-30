// Generated with AI assistance - Navigation bar component with authentication
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  currentUser$: Observable<User | null>;
  showUserMenu = false;
  private userSubscription?: Subscription;
  private currentUser: User | null = null;

  constructor(
    public authService: AuthService,  // Made public for template access
    public router: Router  // Made public for template access
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.showUserMenu = false;
    }
  }

  ngOnInit(): void {
    // Update menu when user authentication state changes
    this.userSubscription = this.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Navbar: User changed, updating menu:', user);
      this.setupMenuItems();
    });
    
    // Initial setup
    this.setupMenuItems();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  private setupMenuItems(): void {
    console.log('Setting up menu items for user:', this.currentUser);
    
    // Base items for everyone
    this.items = [
      {
        label: 'Trabajos',
        icon: 'pi pi-briefcase',
        routerLink: '/jobs'
      }
    ];

    // Check if user is authenticated and has valid user data
    if (this.authService.isAuthenticated() && this.currentUser) {
      console.log('User is authenticated, role:', this.currentUser.role);
      
      // Items for applicants
      if (this.currentUser.role === 'applicant') {
        this.items.push({
          label: 'Mis Aplicaciones',
          icon: 'pi pi-file-o',
          routerLink: '/my-applications'
        });
      }

      // Items for admin users
      if (this.currentUser.role === 'admin') {
        console.log('Adding admin menu items');
        this.items.push({
          label: 'Admin',
          icon: 'pi pi-cog',
          items: [
            {
              label: 'Gestión de Trabajos',
              icon: 'pi pi-briefcase',
              routerLink: '/admin/jobs'
            },
            {
              label: 'Crear Trabajo',
              icon: 'pi pi-plus',
              routerLink: '/admin/jobs/new'
            }
          ]
        });
      }

      // NO agregamos el menú de usuario aquí - se maneja en el template
    } else {
      console.log('User not authenticated, showing login/register options');
      // Items for non-authenticated users - también manejados en template
    }
    
    console.log('Final menu items:', this.items);
  }

  logout(): void {
    console.log('Logging out...');
    this.showUserMenu = false; // Cerrar menú
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails, navigate to home page
        // The authService.logout() already clears local session
        this.router.navigate(['/']);
      }
    });
  }
} 