import { TestBed } from '@angular/core/testing';

import { Landingredirectguard } from './landingredirectguard';

describe('Landingredirectguard', () => {
  let service: Landingredirectguard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Landingredirectguard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
