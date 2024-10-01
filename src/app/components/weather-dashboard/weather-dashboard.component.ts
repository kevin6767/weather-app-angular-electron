import { Component, inject } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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

  private weatherService = inject(WeatherService);

  constructor(private fb: FormBuilder) {
    this.weatherForm = this.fb.group({
      input: [''],
    });
  }

  getWeather() {
    const input = this.weatherForm.get('input')?.value;
    this.errorMessage = null;
    this.data$ = this.weatherService.fetchWeather(input);

    this.data$.subscribe({
      next: (data) => {
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
