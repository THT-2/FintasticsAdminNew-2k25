import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpInventory } from './sp-inventory';

describe('SpInventory', () => {
  let component: SpInventory;
  let fixture: ComponentFixture<SpInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
