import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesRemainingDashboardComponent } from './leaves-remaining-dashboard.component';

describe('LeavesRemainingDashboardComponent', () => {
  let component: LeavesRemainingDashboardComponent;
  let fixture: ComponentFixture<LeavesRemainingDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesRemainingDashboardComponent]
    });
    fixture = TestBed.createComponent(LeavesRemainingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
