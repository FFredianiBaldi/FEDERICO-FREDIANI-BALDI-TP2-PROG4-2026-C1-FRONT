import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditarComentario } from './form-editar-comentario';

describe('FormEditarComentario', () => {
  let component: FormEditarComentario;
  let fixture: ComponentFixture<FormEditarComentario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEditarComentario],
    }).compileComponents();

    fixture = TestBed.createComponent(FormEditarComentario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
