import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoggedIn } from '../../selectors/auth.selectors';
import { UserProfile } from '../../services/user/user.service';
import { WeatherService } from '../../services/weather/weather.service';
import { celsiusToFahrenheit } from './utils/weather-dashboard-util';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './weather-dashboard.component.html',
  styleUrl: './weather-dashboard.component.css',
})
export class WeatherDashboardComponent {
  weatherForm: FormGroup;
  data$: Observable<any> | null = null;
  errorMessage: string | null = null;
  user$: Observable<UserProfile>;
  isLoggedIn$: Observable<boolean>;
  weatherTemp: number | null = null;

  isLoading = false;

  constructor(
    private store: Store<{ user: any; auth: { isLoggedIn: boolean } }>,
    private fb: FormBuilder,
    private weatherService: WeatherService,
  ) {
    this.user$ = this.store.select((state) => state.user.user);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.weatherForm = this.fb.group({
      input: [''],
    });
  }

  async getWeather() {
    const input = this.weatherForm.get('input')?.value;
    this.isLoading = true;
    this.errorMessage = null;
    this.data$ = await this.weatherService.fetchWeather(input);

    this.data$.subscribe({
      next: (data) => {
        this.isLoading = false;
        this.weatherTemp =
          celsiusToFahrenheit(data?.current?.temperature) || null;
        if (data.error) {
          this.errorMessage = data.error.info;
          return;
        }
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }
}
