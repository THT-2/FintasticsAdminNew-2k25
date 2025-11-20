import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { chatBlockGuard } from './chat-block-guard';

describe('chatBlockGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => chatBlockGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
