import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabeAgents } from './availabe-agents';

describe('AvailabeAgents', () => {
  let component: AvailabeAgents;
  let fixture: ComponentFixture<AvailabeAgents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabeAgents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabeAgents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
