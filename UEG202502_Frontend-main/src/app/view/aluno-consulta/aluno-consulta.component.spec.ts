import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoConsultaComponent } from './aluno-consulta.component';

describe('AlunoConsultaComponent', () => {
  let component: AlunoConsultaComponent;
  let fixture: ComponentFixture<AlunoConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlunoConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
