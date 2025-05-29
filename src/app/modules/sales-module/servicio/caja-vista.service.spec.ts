import { TestBed } from '@angular/core/testing';

import { CajaVistaService } from './caja-vista.service';

describe('CajaVistaService', () => {
  let service: CajaVistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CajaVistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
