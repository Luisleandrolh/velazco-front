import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoDialogComponent } from './metodo-pago-dialog.component';

describe('MetodoPagoDialogComponent', () => {
  let component: MetodoPagoDialogComponent;
  let fixture: ComponentFixture<MetodoPagoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetodoPagoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodoPagoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
