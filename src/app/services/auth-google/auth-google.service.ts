import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { login } from '../../state/actions/auth/auth.actions';
import { setUser } from '../../state/actions/user/user.actions';
import { DatabaseService } from '../database/database.service';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { SuccessHandlerService } from '../success-handler/success-handler.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  constructor(
    private oAuthService: OAuthService,
    private dbService: DatabaseService,
    private userService: UserService,
    private errorHandlingService: ErrorHandlingService,
    private sucessHandlingService: SuccessHandlerService,
    private store: Store,
  ) {
    this.setupIpcListeners();
  }

  login(): Promise<any> {
    return this.loginViaElectron();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.sucessHandlingService.showSuccess('Logged out successfully');
  }

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
