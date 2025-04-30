import { TestBed } from '@angular/core/testing';

import { InventarioServiceService } from './inventario-service.service';

describe('InventarioServiceService', () => {
  let service: InventarioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
