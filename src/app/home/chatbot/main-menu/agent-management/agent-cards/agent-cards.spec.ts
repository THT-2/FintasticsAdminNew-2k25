import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCards } from './agent-cards';

describe('AgentCards', () => {
  let component: AgentCards;
  let fixture: ComponentFixture<AgentCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
