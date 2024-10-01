import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '2a506d2e46d387eea39270737e6b3d9d';

  constructor(private http: HttpClient) {}

  fetchWeather(query: string): Observable<WeatherData> {
    const baseURL = `http://api.weatherstack.com/current?access_key=${this.apiKey}&query=${query}`;
    return this.http.get<WeatherData>(baseURL).pipe(
      retry(3),
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        if (error.error && error.error.info) {
          console.error('Error Info:', error.error.info);
        }
        return throwError(
          () =>
            new Error(
              error.error.info ||
                'An error occurred while fetching weather data.',
            ),
        );
      }),
    );
  }
}
