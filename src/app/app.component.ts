import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBarComponent } from './components/title-bar/title-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TitleBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private token: string | null = null;

  ngOnInit() {
    // Listen for the 'oauth-token' event
    (window as any).electron.receive('oauth-token', (token: any) => {
      this.token = token; // Save the token in a class property or handle it as needed
      console.log('Received Access Token:', this.token);

      // You can now use the token for further API calls or store it
      // Example: localStorage.setItem('access_token', this.token);
    });
  }
}
