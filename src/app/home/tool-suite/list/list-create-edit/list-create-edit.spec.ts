import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreateEdit } from './list-create-edit';

describe('ListCreateEdit', () => {
  let component: ListCreateEdit;
  let fixture: ComponentFixture<ListCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
