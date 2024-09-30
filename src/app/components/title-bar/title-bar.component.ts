import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  RouterModule,
} from '@angular/router'; // Import RouterModule
import { AuthGoogleService } from '../../services/auth-google/auth-google.service';

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
    RouterModule, // Add RouterModule here
  ],
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css'],
})
export class TitleBarComponent {
  ipcRenderer: any;
  private authService = inject(AuthGoogleService);

  constructor(private router: Router) {
    this.ipcRenderer = (window as any).electron?.ipcRenderer;
    console.log('IPCRenderer:', this.ipcRenderer);
    console.log((window as any).electron);
  }

  navigateTo(route: string) {
    console.log(`Navigating to: ${route}`);
    this.router.navigate([route]);
  }

  handleLogin() {
    this.authService.login();
  }

  minimizeWindow() {
    if (this.ipcRenderer) {
      this.ipcRenderer.send('minimize-window');
    }
  }

  maximizeWindow() {
    if (this.ipcRenderer) {
      this.ipcRenderer.send('maximize-window');
    }
  }

  closeWindow() {
    if (this.ipcRenderer) {
      this.ipcRenderer.send('close-window');
    }
  }
}
