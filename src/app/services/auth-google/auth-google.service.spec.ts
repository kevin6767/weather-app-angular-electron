import { TestBed } from '@angular/core/testing';

import { AuthGoogleServiceService } from './auth-google.service';

describe('AuthGoogleServiceService', () => {
  let service: AuthGoogleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGoogleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
