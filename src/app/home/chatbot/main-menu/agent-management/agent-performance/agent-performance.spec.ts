import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPerformance } from './agent-performance';

describe('AgentPerformance', () => {
  let component: AgentPerformance;
  let fixture: ComponentFixture<AgentPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPerformance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentPerformance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
