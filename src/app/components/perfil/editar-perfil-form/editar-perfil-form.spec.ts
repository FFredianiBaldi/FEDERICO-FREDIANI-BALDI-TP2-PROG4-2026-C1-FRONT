import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPerfilForm } from './editar-perfil-form';

describe('EditarPerfilForm', () => {
  let component: EditarPerfilForm;
  let fixture: ComponentFixture<EditarPerfilForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPerfilForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
