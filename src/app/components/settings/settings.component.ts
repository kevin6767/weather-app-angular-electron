import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private ipcRenderer = (window as any).electron?.ipcRenderer;

  ngOnInit() {
    this.queryDatabase('SELECT * FROM weather_app_data');
  }
  async queryDatabase(query: string) {
    console.log('Query Database Method Called');
    try {
      const result = await this.ipcRenderer.dbQuery(query);
      console.log('Query Result:', result);
    } catch (error) {
      console.error('Database query error:', error);
    }
  }
}
