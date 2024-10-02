import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DatabaseService } from '../database/database.service';
import { ErrorHandlingService } from '../error-handling/error-handling.service';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey: string = '';

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    private dbService: DatabaseService,
  ) {
    this.loadApiKey();
  }

  private async loadApiKey(): Promise<void> {
    try {
      const dbQuery = 'SELECT * FROM weather_app_data';
      const result = await this.dbService.queryDatabase(dbQuery);
      if (result && result.length > 0) {
        this.apiKey = result[0].weather_key;
      } else {
        this.errorHandlingService.handleError(
          'API key not found in the database. Please add it.',
        );
      }
    } catch (error) {
      this.errorHandlingService.handleError(error);
    }
  }

  async fetchWeather(location: string): Promise<Observable<WeatherData>> {
    await this.loadApiKey();
    if (!this.apiKey) {
      return throwError(() => new Error('API key is empty'));
    }

    const baseURL = `http://api.weatherstack.com/current?access_key=${this.apiKey}&query=${location}`;
    return this.http.get<WeatherData>(baseURL).pipe(
      retry(3),
      catchError((error) => {
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
