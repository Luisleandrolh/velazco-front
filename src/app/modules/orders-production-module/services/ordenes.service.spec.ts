import { TestBed } from '@angular/core/testing';

import { OrdenProduccionService } from './ordenes.service';

describe('OrdenesService', () => {
  let service: OrdenProduccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenProduccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
