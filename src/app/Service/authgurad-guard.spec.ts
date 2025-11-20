import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authguradGuard } from './authgurad-guard';

describe('authguradGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authguradGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
