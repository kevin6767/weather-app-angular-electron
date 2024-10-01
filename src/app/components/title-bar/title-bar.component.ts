import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  RouterModule,
} from '@angular/router';
import { AuthGoogleService } from '../../services/auth-google/auth-google.service';
import { Observable } from 'rxjs';
import { selectIsLoggedIn } from '../../state/selector/auth.selectors';
import { Store } from '@ngrx/store';
import { logout, login } from '../../state/actions/auth/auth.actions';
import { clearUser } from '../../state/actions/user/user.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css'],
})
export class TitleBarComponent {
  isLoggedIn: boolean = false;
  private ipcRenderer = (window as any).electron?.ipcRenderer;
  private store = inject(Store);
  private authService = inject(AuthGoogleService);

  constructor(private router: Router) {
    this.store.select(selectIsLoggedIn).subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  navigateTo(route: string) {
    console.log(`Navigating to: ${route}`);
    this.router.navigate([route]);
  }

  handleLogin() {
    this.authService.login();
  }

  handleLogout() {
    this.authService.logout();
    this.store.dispatch(logout());
    this.store.dispatch(clearUser());
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
