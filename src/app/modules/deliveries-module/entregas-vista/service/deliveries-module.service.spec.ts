import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeliveriesModuleService } from './deliveries-module.service';

describe('DeliveriesModuleService', () => {
  let service: DeliveriesModuleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveriesModuleService]
    });
    service = TestBed.inject(DeliveriesModuleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería obtener pedidos por estado', () => {
    const estado = 'PAGADO';
    const mockResponse = { content: [] };

    service.obtenerPedidosPorEstado(estado).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`https://velazco-backend-develop.up.railway.app/api/orders/status/${estado}?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
