import { Injectable } from '@angular/core';
import { ErrorHandlingService } from '../error-handling/error-handling.service';
import { UserProfile } from '../user/user.service';
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private ipcRenderer = (window as any).electron?.ipcRenderer;

  constructor(private errorHandlingService: ErrorHandlingService) {}
  async queryDatabase(query: string) {
    try {
      const result = await this.ipcRenderer.dbQuery(query);
      return result;
    } catch (error) {
      this.errorHandlingService.handleError(error);
      throw error;
    }
  }

  async updateDatabase(query: string, params?: any[]) {
    try {
      const result = await this.ipcRenderer.dbUpdate(query, params);
      return result;
    } catch (error) {
      this.errorHandlingService.handleError(error);
      throw error;
    }
  }

  async userExists(email: string): Promise<boolean> {
    const query = `SELECT COUNT(*) as count FROM users WHERE email = '${email}'`;
    const result = await this.queryDatabase(query);
    return result[0].count > 0;
  }

  async addUser(user: UserProfile): Promise<void> {
    const query = `INSERT INTO users (name, email) VALUES ('${user.name}', '${user.email}')`;
    await this.updateDatabase(query);
  }

  async createInitialRecord() {
    const insertQuery = `INSERT INTO weather_app_data (weather_key, oauth_key) VALUES (?, ?)`;
    await this.updateDatabase(insertQuery);
  }
}
