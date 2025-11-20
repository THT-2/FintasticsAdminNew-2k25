import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hometronics } from './hometronics';

describe('Hometronics', () => {
  let component: Hometronics;
  let fixture: ComponentFixture<Hometronics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hometronics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hometronics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
