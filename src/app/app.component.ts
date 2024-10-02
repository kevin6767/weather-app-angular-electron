import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TitleBarComponent, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private token: string | null = null;
  private ipcRenderer = (window as any).electron?.ipcRenderer;

  ngOnInit() {
    this.ipcRenderer.on('oauth-token', (token: any) => {
      this.token = token;
      localStorage.setItem('oauth-token', token);
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('oauth-token');
  }
}
