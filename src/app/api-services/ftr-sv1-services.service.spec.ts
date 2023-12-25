import { TestBed } from '@angular/core/testing';

import { FtrSv1ServicesService } from './ftr-sv1-services.service';

describe('FtrSv1ServicesService', () => {
  let service: FtrSv1ServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FtrSv1ServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
