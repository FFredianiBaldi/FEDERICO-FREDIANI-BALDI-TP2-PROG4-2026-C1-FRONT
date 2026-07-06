import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPublicacion } from './modal-publicacion';

describe('ModalPublicacion', () => {
  let component: ModalPublicacion;
  let fixture: ComponentFixture<ModalPublicacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPublicacion],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPublicacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
