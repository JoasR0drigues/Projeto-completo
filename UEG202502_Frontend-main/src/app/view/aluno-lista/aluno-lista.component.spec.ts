import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { AlunoListaComponent } from './aluno-lista.component';
import { AlunoService } from '../../service/aluno.service';
import { Aluno } from '../../model/aluno';

describe('AlunoListaComponent', () => {
  let component: AlunoListaComponent;
  let fixture: ComponentFixture<AlunoListaComponent>;
  let mockAlunoService: jasmine.SpyObj<AlunoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockAlunos: Aluno[] = [
    {
      codigo: 1,
      nome: 'João Silva',
      curso: 'Ciência da Computação',
      dataMatricula: new Date('2024-01-15'),
      mensalidade: 1200,
      bolsista: true,
      semestre: 3
    },
    {
      codigo: 2,
      nome: 'Maria Santos',
      curso: 'Engenharia',
      dataMatricula: new Date('2024-02-20'),
      mensalidade: 1500,
      bolsista: false,
      semestre: 5
    },
    {
      codigo: 3,
      nome: 'Pedro Costa',
      curso: 'Ciência da Computação',
      dataMatricula: new Date('2024-03-10'),
      mensalidade: 1000,
      bolsista: true,
      semestre: 1
    }
  ];

  beforeEach(async () => {
    const alunoServiceSpy = jasmine.createSpyObj('AlunoService', ['listarAlunos', 'excluirAluno']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AlunoListaComponent, FormsModule],
      providers: [
        { provide: AlunoService, useValue: alunoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoListaComponent);
    component = fixture.componentInstance;
    mockAlunoService = TestBed.inject(AlunoService) as jasmine.SpyObj<AlunoService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load alunos on init', () => {
    mockAlunoService.listarAlunos.and.returnValue(of(mockAlunos));

    component.ngOnInit();

    expect(component.alunos).toEqual(mockAlunos);
    expect(component.alunosFiltrados).toEqual(mockAlunos);
    expect(component.carregando).toBeFalse();
    expect(component.erro).toBe('');
  });

  it('should handle error when loading alunos', () => {
    mockAlunoService.listarAlunos.and.returnValue(throwError(() => new Error('Server error')));

    component.ngOnInit();

    expect(component.erro).toBe('Falha ao carregar os dados dos alunos');
    expect(component.carregando).toBeFalse();
  });

  it('should extract unique cursos', () => {
    component.alunos = mockAlunos;
    component.extrairCursos();

    expect(component.cursos).toEqual(['Ciência da Computação', 'Engenharia']);
  });

  it('should filter alunos by name', () => {
    component.alunos = mockAlunos;
    component.alunosFiltrados = [...mockAlunos];
    component.filtroNome = 'João';

    component.aplicarFiltros();

    expect(component.alunosFiltrados.length).toBe(1);
    expect(component.alunosFiltrados[0].nome).toBe('João Silva');
  });

  it('should filter alunos by curso', () => {
    component.alunos = mockAlunos;
    component.alunosFiltrados = [...mockAlunos];
    component.filtroCurso = 'Ciência da Computação';

    component.aplicarFiltros();

    expect(component.alunosFiltrados.length).toBe(2);
    expect(component.alunosFiltrados.every(a => a.curso === 'Ciência da Computação')).toBeTrue();
  });

  it('should filter alunos by semestre', () => {
    component.alunos = mockAlunos;
    component.alunosFiltrados = [...mockAlunos];
    component.filtroSemestre = '3';

    component.aplicarFiltros();

    expect(component.alunosFiltrados.length).toBe(1);
    expect(component.alunosFiltrados[0].semestre).toBe(3);
  });

  it('should filter alunos by bolsista status', () => {
    component.alunos = mockAlunos;
    component.alunosFiltrados = [...mockAlunos];
    component.filtroBolsista = 'true';

    component.aplicarFiltros();

    expect(component.alunosFiltrados.length).toBe(2);
    expect(component.alunosFiltrados.every(a => a.bolsista)).toBeTrue();
  });

  it('should clear all filters', () => {
    component.filtroNome = 'test';
    component.filtroCurso = 'test';
    component.filtroSemestre = '1';
    component.filtroBolsista = 'true';

    component.limparFiltros();

    expect(component.filtroNome).toBe('');
    expect(component.filtroCurso).toBe('');
    expect(component.filtroSemestre).toBe('');
    expect(component.filtroBolsista).toBe('');
  });

  it('should navigate to new aluno page', () => {
    component.novo();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/alunos/novo']);
  });

  it('should navigate to edit aluno page', () => {
    component.editar(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/alunos/editar', 1]);
  });

  it('should not navigate when editar is called without id', () => {
    component.editar();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should delete aluno after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockAlunoService.excluirAluno.and.returnValue(of({}));
    component.alunos = mockAlunos;

    component.excluir(1);

    expect(mockAlunoService.excluirAluno).toHaveBeenCalledWith(1);
  });

  it('should not delete aluno when confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.excluir(1);

    expect(mockAlunoService.excluirAluno).not.toHaveBeenCalled();
  });

  it('should not delete when no id is provided', () => {
    component.excluir();

    expect(mockAlunoService.excluirAluno).not.toHaveBeenCalled();
  });

  it('should calculate bolsistas count correctly', () => {
    component.alunos = mockAlunos;

    expect(component.alunosBolsistas).toBe(2);
  });

  it('should calculate unique cursos count correctly', () => {
    component.alunos = mockAlunos;

    expect(component.cursosUnicos).toBe(2);
  });

  it('should calculate average mensalidade correctly', () => {
    component.alunos = mockAlunos;

    expect(component.mensalidadeMedia).toBe((1200 + 1500 + 1000) / 3);
  });

  it('should return 0 for average mensalidade when no alunos', () => {
    component.alunos = [];

    expect(component.mensalidadeMedia).toBe(0);
  });

  it('should get correct status for aluno based on semestre', () => {
    expect(component.getStatusAluno(1)).toBe('Iniciante');
    expect(component.getStatusAluno(3)).toBe('Intermediário');
    expect(component.getStatusAluno(5)).toBe('Avançado');
    expect(component.getStatusAluno(8)).toBe('Finalista');
  });

  it('should check if aluno is active correctly', () => {
    const recentDate = new Date();
    recentDate.setMonth(recentDate.getMonth() - 6); // 6 months ago

    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 3); // 3 years ago

    expect(component.isAlunoAtivo(recentDate)).toBeTrue();
    expect(component.isAlunoAtivo(oldDate)).toBeFalse();
  });

  it('should calculate mensalidade with discount for bolsistas', () => {
    const aluno: Aluno = {
      codigo: 1,
      nome: 'Test',
      curso: 'Test',
      dataMatricula: new Date(),
      mensalidade: 1000,
      bolsista: true,
      semestre: 1
    };

    const result = component.calcularMensalidadeComDesconto(aluno, 0.5);
    expect(result).toBe(500);
  });

  it('should not apply discount for non-bolsistas', () => {
    const aluno: Aluno = {
      codigo: 1,
      nome: 'Test',
      curso: 'Test',
      dataMatricula: new Date(),
      mensalidade: 1000,
      bolsista: false,
      semestre: 1
    };

    const result = component.calcularMensalidadeComDesconto(aluno, 0.5);
    expect(result).toBe(1000);
  });
});