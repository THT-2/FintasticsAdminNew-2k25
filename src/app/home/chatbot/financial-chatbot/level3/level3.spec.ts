import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level3 } from './level3';

describe('Level3', () => {
  let component: Level3;
  let fixture: ComponentFixture<Level3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
