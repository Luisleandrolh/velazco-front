import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionComponent } from './ordenesproduccion.component';

describe('OrdenesproduccionComponent', () => {
  let component: ProductionComponent;
  let fixture: ComponentFixture<ProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
