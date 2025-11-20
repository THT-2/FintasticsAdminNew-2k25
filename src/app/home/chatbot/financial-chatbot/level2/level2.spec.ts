import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level2 } from './level2';

describe('Level2', () => {
  let component: Level2;
  let fixture: ComponentFixture<Level2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
