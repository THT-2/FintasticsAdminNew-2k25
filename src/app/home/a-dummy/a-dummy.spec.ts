import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADummy } from './a-dummy';

describe('ADummy', () => {
  let component: ADummy;
  let fixture: ComponentFixture<ADummy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ADummy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ADummy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
