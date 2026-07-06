import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtenderSesionModal } from './extender-sesion-modal';

describe('ExtenderSesionModal', () => {
  let component: ExtenderSesionModal;
  let fixture: ComponentFixture<ExtenderSesionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtenderSesionModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtenderSesionModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
