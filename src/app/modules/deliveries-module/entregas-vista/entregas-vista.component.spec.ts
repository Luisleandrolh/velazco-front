import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasVistaComponent } from './entregas-vista.component';

describe('EntregasVistaComponent', () => {
  let component: EntregasVistaComponent;
  let fixture: ComponentFixture<EntregasVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregasVistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
