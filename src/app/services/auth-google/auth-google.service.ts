import { Injectable, inject } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../enviroment/enviroment.localhost';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { setUser } from '../../state/actions/user/user.actions';
import { login, logout } from '../../state/actions/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private userService = inject(UserService);
  private store = inject(Store);
  private url = environment.OAUTH_KEY;

  constructor() {
    this.initConfiguration();
    this.setupIpcListeners();
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: this.url,
      redirectUri: 'https://localhost:4200/oauth/callback',
      scope: 'openid profile email',
    };

    console.log('Initializing AuthGoogleService');
    console.log('Client ID:', this.url);

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login(): void {
    this.loginViaElectron();
    this.store.dispatch(login());
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
  }

  // IPC listeners setup on construction to handle OAuth token received from main process
  private setupIpcListeners() {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.on('oauth-token', (token) => {
        console.log('Received OAuth token from main process:', token);
        this.oAuthService.tryLogin({
          customHashFragment: `access_token=${token}`,
        });
        this.fetchUserProfile(token);
      });
    } else {
      console.error('ipcRenderer is not available');
    }
  }

  private loginViaElectron(): void {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('open-oauth-window');
    } else {
      console.error('Electron is not available or ipcRenderer is not defined');
    }
  }

  private fetchUserProfile(token: string): void {
    this.userService.fetchUserProfile(token).subscribe({
      next: (profile) => {
        this.store.dispatch(setUser({ user: profile }));
      },
      error: (err) => {
        console.error('Failed to fetch user profile:', err);
      },
    });
  }
}
