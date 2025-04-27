import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosVistaComponent } from './pedidos-vista.component';

describe('PedidosVistaComponent', () => {
  let component: PedidosVistaComponent;
  let fixture: ComponentFixture<PedidosVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosVistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
