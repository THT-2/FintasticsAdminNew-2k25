import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpOrdercards } from './sp-ordercards';

describe('SpOrdercards', () => {
  let component: SpOrdercards;
  let fixture: ComponentFixture<SpOrdercards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpOrdercards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpOrdercards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
