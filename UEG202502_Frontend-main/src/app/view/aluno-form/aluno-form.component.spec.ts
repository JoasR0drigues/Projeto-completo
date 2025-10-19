import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AlunoFormComponent } from './aluno-form.component';
import { AlunoService } from '../../service/aluno.service';
import { Aluno } from '../../model/aluno';

describe('AlunoFormComponent', () => {
  let component: AlunoFormComponent;
  let fixture: ComponentFixture<AlunoFormComponent>;
  let mockAlunoService: jasmine.SpyObj<AlunoService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const alunoServiceSpy = jasmine.createSpyObj('AlunoService', ['consultarAluno', 'inserirAluno', 'alterarAluno']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ AlunoFormComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: AlunoService, useValue: alunoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlunoFormComponent);
    component = fixture.componentInstance;
    mockAlunoService = TestBed.inject(AlunoService) as jasmine.SpyObj<AlunoService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    component.ngOnInit();
    expect(component.form.get('nome')?.value).toBe('');
    expect(component.form.get('curso')?.value).toBe('');
    expect(component.form.get('mensalidade')?.value).toBe(0);
    expect(component.form.get('bolsista')?.value).toBe(false);
    expect(component.form.get('semestre')?.value).toBe(1);
  });

  it('should load aluno data for editing', () => {
    const mockAluno: Aluno = {
      codigo: 1,
      nome: 'João Silva',
      curso: 'Ciência da Computação',
      dataMatricula: new Date('2024-01-15'),
      mensalidade: 1200,
      bolsista: true,
      semestre: 3
    };

    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    mockAlunoService.consultarAluno.and.returnValue(of(mockAluno));

    component.ngOnInit();

    expect(component.idEdicao).toBe(1);
    expect(component.titulo).toBe('Editar Aluno');
    expect(mockAlunoService.consultarAluno).toHaveBeenCalledWith(1);
  });

  it('should validate required fields', () => {
    component.ngOnInit();
    
    component.form.patchValue({
      nome: '',
      curso: '',
      dataMatricula: '',
      mensalidade: 0,
      semestre: 0
    });

    expect(component.form.invalid).toBeTruthy();
    expect(component.form.get('nome')?.hasError('required')).toBeTruthy();
    expect(component.form.get('curso')?.hasError('required')).toBeTruthy();
    expect(component.form.get('dataMatricula')?.hasError('required')).toBeTruthy();
  });

  it('should call incluir when creating new aluno', () => {
    const mockAluno: Aluno = {
      codigo: 0,
      nome: 'João Silva',
      curso: 'Ciência da Computação',
      dataMatricula: new Date('2024-01-15'),
      mensalidade: 1200,
      bolsista: true,
      semestre: 3
    };

    component.ngOnInit();
    component.form.patchValue({
      nome: 'João Silva',
      curso: 'Ciência da Computação',
      dataMatricula: '2024-01-15',
      mensalidade: 1200,
      bolsista: true,
      semestre: 3
    });

    mockAlunoService.inserirAluno.and.returnValue(of(mockAluno));

    component.salvar();

    expect(mockAlunoService.inserirAluno).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/alunos']);
  });

  it('should call alterar when editing existing aluno', () => {
    const mockAluno: Aluno = {
      codigo: 1,
      nome: 'João Silva',
      curso: 'Ciência da Computação',
      dataMatricula: new Date('2024-01-15'),
      mensalidade: 1200,
      bolsista: true,
      semestre: 3
    };

    component.idEdicao = 1;
    component.ngOnInit();
    component.form.patchValue({
      nome: 'João Silva Atualizado',
      curso: 'Ciência da Computação',
      dataMatricula: '2024-01-15',
      mensalidade: 1300,
      bolsista: true,
      semestre: 4
    });

    mockAlunoService.alterarAluno.and.returnValue(of(mockAluno));

    component.salvar();

    expect(mockAlunoService.alterarAluno).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/alunos']);
  });

  it('should handle save error', () => {
    component.ngOnInit();
    component.form.patchValue({
      nome: 'João Silva',
      curso: 'Ciência da Computação',
      dataMatricula: '2024-01-15',
      mensalidade: 1200,
      bolsista: true,
      semestre: 3
    });

    mockAlunoService.inserirAluno.and.returnValue(throwError(() => new Error('Erro de servidor')));

    component.salvar();

    expect(component.erro).toContain('Falha ao salvar');
    expect(component.salvando).toBeFalse();
  });

  it('should navigate to alunos list on cancel', () => {
    component.cancelar();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/alunos']);
  });
});
