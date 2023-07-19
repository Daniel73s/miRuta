import { TestBed } from '@angular/core/testing';

import { ExportxtService } from './exportxt.service';

describe('ExportxtService', () => {
  let service: ExportxtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportxtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
