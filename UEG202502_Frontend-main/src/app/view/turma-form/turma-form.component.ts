import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Turma } from '../../model/turma';
import { TurmaService } from '../../service/turma.service';
import { CURSOS_INFO, CursoInfo } from '../../shared/constants/cursos-info';

@Component({
  selector: 'app-turma-form',
  templateUrl: './turma-form.component.html',
  styleUrls: ['./turma-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TurmaFormComponent implements OnInit {

  form!: FormGroup;
  titulo = 'Anexar Turma';
  idEdicao?: number;
  salvando = false;
  erro = '';
  
  readonly turnosDisponiveis = ['Matutino', 'Vespertino', 'Noturno'];
  readonly cursosDisponiveis = CURSOS_INFO;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private turmaService: TurmaService
  ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      turno: ['', [Validators.required]],
      cursoSlug: ['', [Validators.required]],
      dataInicio: ['', [Validators.required]],
      dataFim: [{value: '', disabled: true}] // Campo calculado automaticamente
    });

    // Calcular data de fim quando curso, data de início ou turno mudarem
    this.form.get('cursoSlug')?.valueChanges.subscribe(() => this.calcularDataFim());
    this.form.get('dataInicio')?.valueChanges.subscribe(() => this.calcularDataFim());
    this.form.get('turno')?.valueChanges.subscribe(() => this.calcularDataFim());

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idEdicao = +id;
      this.titulo = 'Editar Turma';
      this.turmaService.consultarTurma(this.idEdicao).subscribe({
        next: (turma) => {
          // Pegar o primeiro curso da lista (já que o formulário permite selecionar apenas um)
          const primeiroCurso = turma.cursos && turma.cursos.length > 0 ? turma.cursos[0] : null;
          const cursoSlug = primeiroCurso?.nome ? this.encontrarSlugPorNome(primeiroCurso.nome) : 
                           (turma.curso?.nome ? this.encontrarSlugPorNome(turma.curso.nome) : '');
          
          if (turma.dataInicio) {
            const dataInicioFormatada = new Date(turma.dataInicio).toISOString().split('T')[0];
            const dataFimFormatada = turma.dataFim ? new Date(turma.dataFim).toISOString().split('T')[0] : '';
            this.form.patchValue({
              turno: turma.turno,
              cursoSlug: cursoSlug,
              dataInicio: dataInicioFormatada,
              dataFim: dataFimFormatada
            });
          } else {
            this.form.patchValue({
              turno: turma.turno,
              cursoSlug: cursoSlug
            });
          }
        },
        error: () => {
          this.erro = 'Não foi possível carregar os dados da turma.';
        }
      });
    }
  }

  encontrarSlugPorNome(nomeCurso: string): string {
    const curso = this.cursosDisponiveis.find(c => c.titulo === nomeCurso);
    return curso?.slug || '';
  }

  /**
   * Calcula a data de fim da turma baseado na carga horária do curso selecionado.
   * Considera:
   * - Matutino: 4 horas por dia
   * - Vespertino: 4 horas por dia
   * - Noturno: 3 horas por dia
   */
  calcularDataFim(): void {
    const cursoSlug = this.form.get('cursoSlug')?.value;
    const dataInicio = this.form.get('dataInicio')?.value;
    const turno = this.form.get('turno')?.value;

    if (!cursoSlug || !dataInicio || !turno) {
      this.form.patchValue({ dataFim: '' }, { emitEvent: false });
      return;
    }

    const curso = this.cursosDisponiveis.find(c => c.slug === cursoSlug);
    if (!curso) {
      this.form.patchValue({ dataFim: '' }, { emitEvent: false });
      return;
    }

    // Extrair carga horária (ex: "120 horas" -> 120)
    const cargaHorariaMatch = curso.cargaHoraria.match(/(\d+)/);
    if (!cargaHorariaMatch) {
      this.form.patchValue({ dataFim: '' }, { emitEvent: false });
      return;
    }

    const cargaHoraria = parseInt(cargaHorariaMatch[1], 10);
    
    // Horas por dia baseado no turno
    let horasPorDia = 4; // Matutino e Vespertino
    if (turno === 'Noturno') {
      horasPorDia = 3;
    }

    // Calcular número de dias necessários
    const diasNecessarios = Math.ceil(cargaHoraria / horasPorDia);
    
    // Calcular apenas dias úteis (segunda a sexta)
    const dataInicioObj = new Date(dataInicio);
    let diasAdicionados = 0;
    let diasUteis = 0;

    while (diasUteis < diasNecessarios) {
      const diaSemana = dataInicioObj.getDay(); // 0 = domingo, 6 = sábado
      
      // Se for dia útil (segunda a sexta)
      if (diaSemana >= 1 && diaSemana <= 5) {
        diasUteis++;
      }
      
      if (diasUteis < diasNecessarios) {
        dataInicioObj.setDate(dataInicioObj.getDate() + 1);
        diasAdicionados++;
      }
    }

    // Formatar data de fim
    const dataFim = dataInicioObj.toISOString().split('T')[0];
    this.form.patchValue({ dataFim }, { emitEvent: false });
  }

  salvar(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.erro = '';

    const formValue = this.form.getRawValue(); // getRawValue() pega valores mesmo de campos disabled
    const curso = this.cursosDisponiveis.find(c => c.slug === formValue.cursoSlug);
    
    // Preparar payload com todos os campos necessários
    const payload: any = {
      turno: formValue.turno
    };
    
    // Adicionar cursos como lista (N×N) - mesmo que seja apenas um curso
    if (curso) {
      payload.cursos = [{
        nome: curso.titulo
      }];
    } else {
      payload.cursos = [];
    }
    
    // Adicionar datas se fornecidas
    if (formValue.dataInicio) {
      payload.dataInicio = formValue.dataInicio; // Enviar como string no formato ISO (YYYY-MM-DD)
    }
    
    if (formValue.dataFim) {
      payload.dataFim = formValue.dataFim; // Enviar como string no formato ISO (YYYY-MM-DD)
    }
    
    // Adicionar ID apenas se estiver editando
    if (this.idEdicao) {
      payload.id = this.idEdicao;
    }

    const req = this.idEdicao
      ? this.turmaService.alterarTurma(this.idEdicao, payload)
      : this.turmaService.inserirTurma(payload);

    req.subscribe({
      next: () => {
        this.router.navigate(['/turmas']);
      },
      error: (error) => {
        console.error('Erro completo ao salvar turma:', error);
        console.error('Payload enviado:', payload);
        
        let mensagemErro = 'Falha ao salvar turma. ';
        
        if (error.status === 404) {
          mensagemErro += 'Endpoint não encontrado. Verifique se o backend tem o endpoint /turmas configurado.';
        } else if (error.status === 0) {
          mensagemErro += 'Não foi possível conectar ao backend. Verifique se o servidor está rodando em http://localhost:8080';
        } else if (error.status === 500) {
          // Erro 500 geralmente indica problema no backend
          if (error.error?.message) {
            mensagemErro += error.error.message;
          } else if (error.error?.error) {
            mensagemErro += error.error.error;
          } else {
            mensagemErro += 'Erro interno no servidor. Verifique se o curso existe no banco de dados.';
          }
        } else if (error.error?.message) {
          mensagemErro += error.error.message;
        } else if (error.message) {
          mensagemErro += error.message;
        } else {
          mensagemErro += 'Erro desconhecido. Verifique o console para mais detalhes.';
        }
        
        this.erro = mensagemErro;
        this.salvando = false;
      }
    });
  }

  cancelar(){
    this.router.navigate(['/turmas']);
  }

  temErro(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  getMensagemErro(campo: string): string {
    const control = this.form.get(campo);
    if (control?.errors) {
      if (control.errors['required']) return `${campo} é obrigatório`;
    }
    return '';
  }
}

