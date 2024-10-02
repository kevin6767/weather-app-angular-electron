import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs';

export interface UserProfile {
  email: string;
  name: string;
  picture?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(private http: HttpClient) {}

  fetchUserProfile(token: string): Observable<UserProfile> {
    return this.http
      .get<UserProfile>(this.apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    return throwError(
      () => new Error('Unable to fetch user profile; please try again later.'),
    );
  }
}
