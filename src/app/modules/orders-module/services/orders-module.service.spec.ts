import { TestBed } from '@angular/core/testing';

import { OrdersModuleService } from './orders-module.service';

describe('OrdersModuleService', () => {
  let service: OrdersModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
