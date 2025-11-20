import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Push } from './push';

describe('Push', () => {
  let component: Push;
  let fixture: ComponentFixture<Push>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Push]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Push);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
