import { TestBed } from '@angular/core/testing';

import { FtrOj1ServicesService } from './ftr-oj1-services.service';

describe('FtrOj1ServicesService', () => {
  let service: FtrOj1ServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FtrOj1ServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
