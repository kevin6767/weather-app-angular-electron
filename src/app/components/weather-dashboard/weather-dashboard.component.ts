import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { WeatherService } from '../../services/weather/weather.service';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../../selectors/auth.selectors';
import { UserProfile } from '../../services/user/user.service';

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

  private weatherService = inject(WeatherService);

  isLoading = false;

  constructor(
    private store: Store<{ user: any; auth: { isLoggedIn: boolean } }>,
    private fb: FormBuilder,
  ) {
    this.user$ = this.store.select((state) => state.user.user);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.weatherForm = this.fb.group({
      input: [''],
    });
  }

  getWeather() {
    this.isLoading = true;
    const input = this.weatherForm.get('input')?.value;
    this.errorMessage = null;
    this.data$ = this.weatherService.fetchWeather(input);

    this.data$.subscribe({
      next: (data) => {
        this.isLoading = false;
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
