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
  showAdminMenu = false;
  adminMenuItems: MenuItem[] = [];
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
    if (!target.closest('.user-menu-wrapper') && !target.closest('.admin-menu')) {
      this.showUserMenu = false;
      this.showAdminMenu = false;
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
    if (this.showUserMenu) {
      this.showAdminMenu = false; // Cerrar admin menu si está abierto
    }
  }

  toggleAdminMenu(event: Event): void {
    event.stopPropagation();
    this.showAdminMenu = !this.showAdminMenu;
    if (this.showAdminMenu) {
      this.showUserMenu = false; // Cerrar user menu si está abierto
    }
  }

  private setupMenuItems(): void {
    console.log('Setting up menu items for user:', this.currentUser);
    
    // No hay items en el menubar principal - todo se maneja en el template del lado derecho
    this.items = [];
    
    // Configurar items del menú admin
    if (this.authService.isAuthenticated() && this.currentUser?.role === 'admin') {
      this.adminMenuItems = [
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
      ];
    } else {
      this.adminMenuItems = [];
    }
    
    console.log('Final menu items:', this.items);
    console.log('Admin menu items:', this.adminMenuItems);
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

  navigateToAdminRoute(route: string): void {
    this.showAdminMenu = false;
    this.router.navigate([route]);
  }
} 