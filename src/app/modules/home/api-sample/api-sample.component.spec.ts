import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSampleComponent } from './api-sample.component';

describe('ApiSampleComponent', () => {
  let component: ApiSampleComponent;
  let fixture: ComponentFixture<ApiSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiSampleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
