import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent }, // Add this route
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Optionally redirect root to dashboard
];
