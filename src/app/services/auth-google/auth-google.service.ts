import { Injectable, inject } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { environment } from '../../enviroment/enviroment.localhost';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService); // Assume OAuthService is injected as a dependency
  private router = inject(Router);
  private url = environment.OAUTH_KEY;

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: this.url,
      redirectUri: window.location.origin + '/dashboard',
      scope: 'openid profile email',
    };
    console.log(window.location.origin);
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  login(): void {
    this.oAuthService.initCodeFlow();
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
}
