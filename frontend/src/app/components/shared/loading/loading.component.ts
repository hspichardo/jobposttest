// Generated with AI assistance - Modern loading component
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container">
      <div class="loading-spinner">
        <p-progressSpinner 
          [style]="{'width': '50px', 'height': '50px'}"
          strokeWidth="4"
          animationDuration="1s">
        </p-progressSpinner>
      </div>
      <div class="loading-text">
        <span>Cargando...</span>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      gap: 1.5rem;
    }
    .loading-text span {
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
    }
  `]
})
export class LoadingComponent {
  constructor() { }
} 