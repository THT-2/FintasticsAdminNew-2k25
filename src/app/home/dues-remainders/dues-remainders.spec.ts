import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuesRemainders } from './dues-remainders';

describe('DuesRemainders', () => {
  let component: DuesRemainders;
  let fixture: ComponentFixture<DuesRemainders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuesRemainders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuesRemainders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
