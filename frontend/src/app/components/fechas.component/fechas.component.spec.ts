import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechasComponent } from './fechas.component';

describe('FechasComponent', () => {
  let component: FechasComponent;
  let fixture: ComponentFixture<FechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FechasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FechasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
