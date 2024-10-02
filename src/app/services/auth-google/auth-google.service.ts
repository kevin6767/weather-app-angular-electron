import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { login } from '../../state/actions/auth/auth.actions';
import { setUser } from '../../state/actions/user/user.actions';
import { UserService } from '../user/user.service';
import { DatabaseService } from '../database/database.service';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { SuccessHandlerService } from '../success-handler/success-handler.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private userService = inject(UserService);
  private dbService = inject(DatabaseService);
  private errorHandlingService = inject(ErrorHandlingService);
  private sucessHandlingService = inject(SuccessHandlerService);
  private store = inject(Store);
  private url = '';

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
    this.sucessHandlingService.showSuccess('Logged out successfully');
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
      this.errorHandlingService.handleError(
        'Electron IPCRenderer is not available',
      );
    }
  }

  private async loginViaElectron(): Promise<void> {
    if (window.electron && window.electron.ipcRenderer) {
      try {
        const query = 'SELECT * FROM weather_app_data';
        const result = await this.dbService.queryDatabase(query);
        if (result && result.length > 0) {
          window.electron.ipcRenderer.send(
            'open-oauth-window',
            result[0].oauth_key,
          );
        } else {
          this.errorHandlingService.handleError(
            'No API keys found in the database.',
          );
        }
      } catch (error) {
        this.errorHandlingService.handleError(
          'Failed to fetch data from the database',
        );
      }
    } else {
      this.errorHandlingService.handleError(
        'Failed to initialize Electron IPCRenderer',
      );
    }
  }

  private fetchUserProfile(token: string): void {
    this.userService.fetchUserProfile(token).subscribe({
      next: async (profile) => {
        this.store.dispatch(setUser({ user: profile }));
        this.store.dispatch(login());
        this.sucessHandlingService.showSuccess('User logged in successfully');
        const exists = await this.dbService.userExists(profile.email);
        if (!exists) {
          await this.dbService.addUser({
            name: profile.name,
            email: profile.email,
          });
          this.sucessHandlingService.showSuccess(
            'User added to the database successfully',
          );
        } else {
          console.log('User already exists in the database');
        }
      },
      error: (err) => {
        this.errorHandlingService.handleError(err);
      },
    });
  }
}
