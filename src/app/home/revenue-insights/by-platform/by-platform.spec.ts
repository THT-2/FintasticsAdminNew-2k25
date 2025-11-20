import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByPlatform } from './by-platform';

describe('ByPlatform', () => {
  let component: ByPlatform;
  let fixture: ComponentFixture<ByPlatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByPlatform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByPlatform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
