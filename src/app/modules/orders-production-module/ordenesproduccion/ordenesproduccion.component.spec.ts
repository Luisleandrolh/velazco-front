import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesproduccionComponent } from './ordenesproduccion.component';

describe('OrdenesproduccionComponent', () => {
  let component: OrdenesproduccionComponent;
  let fixture: ComponentFixture<OrdenesproduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesproduccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesproduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
