import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SuccessHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000) {
    console.log('Success:', message);
    this.snackBar.open(message, 'Close', {
      duration,
    });
  }
}
