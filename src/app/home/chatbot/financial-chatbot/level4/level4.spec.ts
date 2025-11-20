import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level4 } from './level4';

describe('Level4', () => {
  let component: Level4;
  let fixture: ComponentFixture<Level4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
