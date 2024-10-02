import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database/database.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';
import { ErrorHandlingService } from '../../services/error-handling/error-handling.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dbService: DatabaseService,
    private successHandlerService: SuccessHandlerService,
    private errorhandlerService: ErrorHandlingService,
  ) {
    this.settingsForm = this.fb.group({
      weatherAPIKey: [''],
      regularAPIKey: [''],
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    const query = 'SELECT * FROM weather_app_data';
    const result = await this.dbService.queryDatabase(query);
    if (result && result.length > 0) {
      this.settingsForm.patchValue({
        weatherAPIKey: result[0].weather_key || '',
        regularAPIKey: result[0].oauth_key || '',
      });
    } else {
      await this.dbService.createInitialRecord();
      this.loadSettings();
    }
  }

  async updateDatabase() {
    const { weatherAPIKey, regularAPIKey } = this.settingsForm.value;
    const updateQuery = `UPDATE weather_app_data SET weather_key = ?, oauth_key = ? WHERE id = ?`;
    const result = await this.dbService.updateDatabase(updateQuery, [
      weatherAPIKey,
      regularAPIKey,
      1,
    ]);
    if (result.changes === 0) {
      this.errorhandlerService.handleError(
        'Failed to update settings API, check if the entry exists.',
      );
      return;
    } else {
      this.successHandlerService.showSuccess('Settings updated successfully');
    }
  }
}
