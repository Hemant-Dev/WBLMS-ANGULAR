import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestsTableComponent } from './leave-requests-table.component';

describe('LeaveRequestsTableComponent', () => {
  let component: LeaveRequestsTableComponent;
  let fixture: ComponentFixture<LeaveRequestsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveRequestsTableComponent]
    });
    fixture = TestBed.createComponent(LeaveRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
