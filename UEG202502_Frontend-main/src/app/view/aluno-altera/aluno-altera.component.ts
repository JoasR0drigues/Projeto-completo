import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno.service';
import { TurmaService } from '../../service/turma.service';
import { Turma } from '../../model/turma';
import { CURSOS_SUKATECH } from '../../shared/constants/cursos.const';

@Component({
  selector: 'app-aluno-altera',
  standalone: false,
  templateUrl: './aluno-altera.component.html',
  styleUrl: './aluno-altera.component.css'
})
export class AlunoAlteraComponent implements OnInit {

  codigo!: number;
  aluno!: Aluno;
  readonly cursos = CURSOS_SUKATECH;
  turmasDisponiveis: Turma[] = [];
  turmaIdSelecionada?: number;

  constructor(
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.carregarTurmas();
    this.consultarAluno();  
  }

  carregarTurmas(): void {
    this.turmaService.listarTurmas().subscribe({
      next: (turmas) => {
        this.turmasDisponiveis = turmas;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.turmasDisponiveis = [];
      }
    });
  }

  onTurmaSelecionada(): void {
    if (this.turmaIdSelecionada) {
      const turmaSelecionada = this.turmasDisponiveis.find(t => t.id === this.turmaIdSelecionada);
      if (turmaSelecionada) {
        this.aluno.turma = {
          id: turmaSelecionada.id,
          turno: turmaSelecionada.turno
        };
      }
    } else {
      this.aluno.turma = undefined;
    }
  }

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

  onSubmit(){
    // Ao editar: manter os cursos originais que vieram do backend (já têm IDs válidos)
    // Não tentar criar novos cursos, apenas manter os existentes
    // Manter a turma original (já tem ID válido) ou enviar apenas o turno se foi alterado
    const alunoParaSalvar: Aluno = {
      ...this.aluno,
      // Manter apenas cursos que têm ID (já persistidos no banco)
      // Isso evita o erro de chave estrangeira
      cursos: this.aluno.cursos?.filter(c => c.id != null && c.id > 0) || [],
      // Garantir que a propriedade curso (getter/setter) esteja disponível
      curso: this.aluno.curso,
      // Manter a turma selecionada (com ID da turma anexada)
      turma: this.aluno.turma && this.aluno.turma.id ? {
        id: this.aluno.turma.id,
        turno: this.aluno.turma.turno
      } : undefined
    };
    
    this.alunoService.alterarAluno(this.codigo, alunoParaSalvar).subscribe({
      next: (data) => {
        console.log(data);
        this.retornar();
      },
      error: (error) => {
        console.error('Erro ao salvar aluno:', error);
        alert('Erro ao salvar: ' + (error.error?.message || 'Erro desconhecido'));
      }
    });
  }


  consultarAluno(){
    const codigoParam = this.route.snapshot.params['codigo'];
    this.codigo = codigoParam ? Number(codigoParam) : 0;
    this.aluno = new Aluno();
    if (this.codigo > 0) {
      this.alunoService.consultarAluno(this.codigo).subscribe({
        next: (data) => {
          this.aluno = data;
          // Preencher turmaIdSelecionada se o aluno já tiver turma
          if (data.turma?.id) {
            this.turmaIdSelecionada = data.turma.id;
          }
        },
        error: (error) => {
          console.error('Erro ao consultar aluno:', error);
        }
      });
    }
  }

  retornar(){
    this.router.navigate(['aluno-lista']);
  }

}
