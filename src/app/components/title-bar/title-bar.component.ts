import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../../selectors/auth.selectors';
import { AuthGoogleService } from '../../services/auth-google/auth-google.service';
import { logout } from '../../state/actions/auth/auth.actions';
import { clearUser } from '../../state/actions/user/user.actions';

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
  processWorker = false;
  private ipcRenderer = (window as any).electron?.ipcRenderer;
  private store = inject(Store);
  private authService = inject(AuthGoogleService);

  constructor(private router: Router) {
    this.store.select(selectIsLoggedIn).subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  handleLogin() {
    this.processWorker = true;
    this.authService.login().then(() => {
      this.processWorker = false;
    });
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
