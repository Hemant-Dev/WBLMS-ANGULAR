import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaveRequestsTableComponent } from './team-leave-requests-table.component';

describe('TeamLeaveRequestsTableComponent', () => {
  let component: TeamLeaveRequestsTableComponent;
  let fixture: ComponentFixture<TeamLeaveRequestsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamLeaveRequestsTableComponent]
    });
    fixture = TestBed.createComponent(TeamLeaveRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
