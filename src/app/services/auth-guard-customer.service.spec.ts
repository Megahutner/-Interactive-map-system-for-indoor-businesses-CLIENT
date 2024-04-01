import { TestBed } from '@angular/core/testing';

import { AuthGuardCustomerService } from './auth-guard-customer.service';

describe('AuthGuardCustomerService', () => {
  let service: AuthGuardCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
