import { Injectable, inject } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { environment } from '../../enviroment/enviroment.localhost'; // Ensure this path is correct

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);
  private url = environment.OAUTH_KEY;

  constructor() {
    this.initConfiguration();
    this.setupIpcListeners(); // Setup IPC listeners on construction
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: this.url,
      redirectUri: this.isElectronApp()
        ? 'https://yourapp.com/oauth/callback' // Set redirect URI for Electron
        : 'http://localhost:4200/oauth/redirect', // Normal localhost redirect for web
      scope: 'openid profile email',
    };

    console.log('Initializing AuthGoogleService');
    console.log('Is Electron App:', this.isElectronApp());
    console.log('Client ID:', this.url);

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login(): void {
    this.loginViaElectron();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
  }

  getProfile() {
    const profile = this.oAuthService.getIdentityClaims();
    return profile;
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }

  private isElectronApp(): boolean {
    return !!(window && window.process && window.process.type);
  }

  private setupIpcListeners() {
    // Listen for the access token sent back from the main process
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.on('oauth-token', (token) => {
        console.log('Received OAuth token from main process:', token);
        this.oAuthService.tryLogin({
          customHashFragment: `access_token=${token}`,
        });
      });
    } else {
      console.error('ipcRenderer is not available');
    }
  }

  private loginViaElectron(): void {
    // Ensure window.electron is defined before using it
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('open-oauth-window'); // Send a message to the main process
    } else {
      console.error('Electron is not available or ipcRenderer is not defined');
    }
  }
}
