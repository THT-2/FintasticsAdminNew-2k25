import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolSuite } from './tool-suite';

describe('ToolSuite', () => {
  let component: ToolSuite;
  let fixture: ComponentFixture<ToolSuite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolSuite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolSuite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
