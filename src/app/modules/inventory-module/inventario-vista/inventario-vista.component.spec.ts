import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioVistaComponent } from './inventario-vista.component';

describe('InventarioVistaComponent', () => {
  let component: InventarioVistaComponent;
  let fixture: ComponentFixture<InventarioVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioVistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
