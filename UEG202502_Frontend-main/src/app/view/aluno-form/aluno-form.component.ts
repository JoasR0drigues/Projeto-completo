import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno.service';
import { TurmaService } from '../../service/turma.service';
import { Turma } from '../../model/turma';
import { CURSOS_SUKATECH } from '../../shared/constants/cursos.const';

@Component({
  selector: 'app-aluno-form',
  templateUrl: './aluno-form.component.html',
  styleUrls: ['./aluno-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AlunoFormComponent implements OnInit {

  form!: FormGroup;
  titulo = 'Novo Aluno';
  idEdicao?: number;
  salvando = false;
  erro = '';
  readonly cursosDisponiveis = CURSOS_SUKATECH;
  
  // Lista de turmas disponíveis (anexadas pelo gestor)
  turmasDisponiveis: Turma[] = [];
  
  // Limite de alunos por turma
  readonly LIMITE_ALUNOS_POR_TURMA = 20;
  
  // Armazenar os cursos originais do aluno (com IDs) quando estiver editando
  private cursosOriginais: { id?: number; nome: string }[] = [];
  
  // Armazenar a turma original do aluno quando estiver editando
  private turmaOriginal?: { id?: number; turno: string };

  constructor(
    private fb: FormBuilder,
    private service: AlunoService,
    private turmaService: TurmaService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo: [{value: '', disabled: true}],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      curso: [''], // Campo opcional - não é mais obrigatório
      turmaId: ['', [Validators.required]], // Campo obrigatório para selecionar a turma anexada
      dataMatricula: ['', [Validators.required]],
      mensalidade: [0, [Validators.required, Validators.min(0.01)]],
      bolsista: [false],
      semestre: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    // Carregar turmas disponíveis
    this.carregarTurmas();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idEdicao = +id;
      this.titulo = 'Editar Aluno';
      this.service.consultarAluno(this.idEdicao).subscribe({
        next: (data) => {
          // Salvar os cursos originais (com IDs) para usar ao salvar
          this.cursosOriginais = data.cursos ? [...data.cursos] : [];
          
          // Salvar a turma original (com ID) para usar ao salvar
          if (data.turma) {
            this.turmaOriginal = { id: data.turma.id, turno: data.turma.turno };
          }
          
          // Converter data para o formato esperado pelo input date
          if (data.dataMatricula) {
            const dataFormatada = new Date(data.dataMatricula).toISOString().split('T')[0];
            this.form.patchValue({
              ...data,
              // usa o primeiro curso da lista como curso principal no formulário
              curso: data.cursos && data.cursos.length > 0 ? data.cursos[0].nome : '',
              // preenche o ID da turma se existir
              turmaId: data.turma?.id || '',
              dataMatricula: dataFormatada
            });
          } else {
            this.form.patchValue({
              ...data,
              curso: data.cursos && data.cursos.length > 0 ? data.cursos[0].nome : '',
              turmaId: data.turma?.id || ''
            });
          }
        },
        error: () => this.erro = 'Não foi possível carregar o registro.'
      });
    }
  }

  salvar(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    
    // VALIDAÇÃO: Verificar limite de 20 alunos por turma antes de salvar
    if (formValue.turmaId && !this.idEdicao) {
      // Ao criar novo aluno, verificar se a turma já está no limite
      this.service.listarAlunos().subscribe({
        next: (alunos) => {
          const turmaSelecionada = this.turmasDisponiveis.find(t => t.id === Number(formValue.turmaId));
          const alunosNaTurma = alunos.filter(a => 
            a.turma?.id === Number(formValue.turmaId)
          );
          
          if (alunosNaTurma.length >= this.LIMITE_ALUNOS_POR_TURMA) {
            const nomeTurma = turmaSelecionada 
              ? `${turmaSelecionada.curso?.nome || 'Curso'} - ${turmaSelecionada.turno}`
              : 'turma selecionada';
            this.erro = `Erro: A turma ${nomeTurma} já atingiu o limite de ${this.LIMITE_ALUNOS_POR_TURMA} alunos. Não é possível inscrever mais alunos.`;
            this.salvando = false;
            return;
          }
          
          // Se passou na validação, continuar com o salvamento
          this.processarSalvamento(formValue);
        },
        error: () => {
          // Se não conseguir verificar, permitir salvar (backend vai validar)
          this.processarSalvamento(formValue);
        }
      });
    } else {
      // Ao editar ou sem turma, salvar diretamente
      this.processarSalvamento(formValue);
    }
  }

  private processarSalvamento(formValue: any): void {
    this.salvando = true;
    this.erro = '';

    // SOLUÇÃO: Enviar array vazio de cursos ao criar novo aluno
    // O backend deve ter um endpoint separado para criar a associação curso-aluno
    // OU o backend deve criar os cursos automaticamente se não existirem
    // Ao editar, manter os cursos originais (que já têm IDs válidos)
    let cursosParaEnviar: { id?: number; nome: string }[] = [];
    
    if (this.idEdicao && this.cursosOriginais.length > 0) {
      // Ao editar: manter os cursos originais (já têm IDs válidos do banco)
      cursosParaEnviar = this.cursosOriginais;
    } else {
      // Ao criar novo: enviar array vazio
      // NOTA: O backend precisa criar a associação curso-aluno via outro endpoint
      // ou você precisa ter os cursos já cadastrados no banco antes de criar alunos
      cursosParaEnviar = [];
    }
    
    // Construir objeto turma para enviar ao backend
    // IMPORTANTE: O backend espera que a Turma já exista no banco (tenha ID)
    // Agora usamos o ID da turma selecionada (que foi anexada pelo gestor)
    let turmaParaEnviar: Turma | undefined;
    if (formValue.turmaId) {
      const turmaId = Number(formValue.turmaId);
      const turmaSelecionada = this.turmasDisponiveis.find(t => t.id === turmaId);
      
      if (turmaSelecionada && turmaSelecionada.id && turmaSelecionada.turno) {
        // Enviar a turma com ID (já existe no banco, foi anexada pelo gestor)
        turmaParaEnviar = {
          id: turmaSelecionada.id,
          turno: turmaSelecionada.turno
        };
      } else if (this.idEdicao && this.turmaOriginal && this.turmaOriginal.turno) {
        // Ao editar: manter a turma original (já tem ID válido do banco)
        turmaParaEnviar = {
          id: this.turmaOriginal.id,
          turno: this.turmaOriginal.turno
        };
      }
    }
    
    const payload: Aluno = {
      // demais campos básicos
      codigo: this.idEdicao ? Number(this.idEdicao) : undefined,
      nome: formValue.nome,
      dataMatricula: new Date(formValue.dataMatricula),
      mensalidade: formValue.mensalidade,
      bolsista: Boolean(formValue.bolsista),
      semestre: formValue.semestre,
      // compatibilidade com getter/setter curso no model
      curso: formValue.curso,
      // Enviar array vazio ao criar, ou cursos originais ao editar
      cursos: cursosParaEnviar,
      // Enviar turma (com ID se estiver editando, ou apenas turno se for novo)
      turma: turmaParaEnviar
    };

    const req = this.idEdicao
      ? this.service.alterarAluno(this.idEdicao, payload)
      : this.service.inserirAluno(payload);

    req.subscribe({
      next: () => this.router.navigate(['/alunos']),
      error: (error) => { 
        this.erro = 'Falha ao salvar: ' + (error.error?.message || 'Erro desconhecido');
        this.salvando = false; 
      }
    });
  }

  cancelar(){
    this.router.navigate(['/alunos']);
  }

  // Método para verificar se um campo tem erro
  temErro(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  // Método para obter mensagem de erro específica
  getMensagemErro(campo: string): string {
    const control = this.form.get(campo);
    if (control?.errors) {
      if (control.errors['required']) return `${campo} é obrigatório`;
      if (control.errors['minlength']) return `${campo} deve ter pelo menos ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['maxlength']) return `${campo} deve ter no máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      if (control.errors['min']) return `${campo} deve ser maior que ${control.errors['min'].min}`;
      if (control.errors['max']) return `${campo} deve ser menor que ${control.errors['max'].max}`;
    }
    return '';
  }

  /**
   * Carrega as turmas disponíveis (anexadas pelo gestor)
   */
  carregarTurmas(): void {
    this.turmaService.listarTurmas().subscribe({
      next: (turmas) => {
        this.turmasDisponiveis = turmas;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        // Se não conseguir carregar, deixa array vazio
        this.turmasDisponiveis = [];
      }
    });
  }

  /**
   * Retorna a descrição formatada de uma turma para exibição no select
   */
  getDescricaoTurma(turma: Turma): string {
    const cursoNome = turma.curso?.nome || 'Curso não definido';
    const dataInicio = turma.dataInicio ? new Date(turma.dataInicio).toLocaleDateString('pt-BR') : '';
    const dataFim = turma.dataFim ? new Date(turma.dataFim).toLocaleDateString('pt-BR') : '';
    
    if (dataInicio && dataFim) {
      return `${cursoNome} - ${turma.turno} (${dataInicio} a ${dataFim})`;
    } else if (dataInicio) {
      return `${cursoNome} - ${turma.turno} (Início: ${dataInicio})`;
    }
    return `${cursoNome} - ${turma.turno}`;
  }

  /**
   * Verifica se uma turma está no limite de alunos
   */
  isTurmaNoLimite(turmaId?: number): boolean {
    if (!turmaId) return false;
    // Esta validação será feita antes de salvar, aqui apenas para exibição
    return false;
  }
}
