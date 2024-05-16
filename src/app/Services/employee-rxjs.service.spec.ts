import { TestBed } from '@angular/core/testing';

import { EmployeeRxjsService } from './employee-rxjs.service';

describe('EmployeeRxjsService', () => {
  let service: EmployeeRxjsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRxjsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
