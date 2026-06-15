import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidosCliente } from './partidos-cliente';

describe('PartidosCliente', () => {
  let component: PartidosCliente;
  let fixture: ComponentFixture<PartidosCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidosCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidosCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
