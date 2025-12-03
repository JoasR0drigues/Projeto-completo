import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Turma } from '../../model/turma';
import { AlunoService } from '../../service/aluno.service';
import { TurmaService } from '../../service/turma.service';
import { Aluno } from '../../model/aluno';

@Component({
  selector: 'app-turma-lista',
  templateUrl: './turma-lista.component.html',
  styleUrls: ['./turma-lista.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TurmaListaComponent implements OnInit {

  turmas: Turma[] = [];
  turmasFiltradas: Turma[] = [];
  carregando = false;
  erro = '';

  // Filtros
  filtroTurno = '';
  filtroNomeAluno = '';

  // Lista de turnos disponíveis (removido "Integral")
  turnosDisponiveis = ['Matutino', 'Vespertino', 'Noturno'];
  
  // Lista de alunos para contar por turma
  alunos: Aluno[] = [];
  
  // Limite de alunos por turma
  readonly LIMITE_ALUNOS_POR_TURMA = 20;

  // Estatísticas
  get totalTurmas(): number {
    return this.turmas.length;
  }

  get turmasPorTurno(): Record<string, number> {
    const contagem: Record<string, number> = {};
    this.turmas.forEach(t => {
      const turno = t.turno || 'Sem turno';
      contagem[turno] = (contagem[turno] || 0) + 1;
    });
    return contagem;
  }

  constructor(
    private router: Router,
    private alunoService: AlunoService,
    private turmaService: TurmaService
  ){}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(){
    this.carregando = true;
    this.erro = '';
    
    // Carregar turmas do backend
    this.turmaService.listarTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        // Carregar alunos para contar por turma
        this.carregarAlunosPorTurma();
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        
        // Se for erro 500, mostrar mensagem específica
        if (error.status === 500 || error.message?.includes('Erro 500')) {
          // A mensagem de erro já contém a solução específica
          this.erro = error.message || 'Erro no servidor. Verifique o console para mais detalhes.';
          this.carregando = false;
          // Tentar fallback mesmo assim
          this.carregarTurmasDosAlunos();
        } else {
          // Para outros erros, tentar fallback
          this.carregarTurmasDosAlunos();
        }
      }
    });
  }

  carregarAlunosPorTurma(): void {
    // Carregar alunos para contar quantos pertencem a cada turma
    this.alunoService.listarAlunos().subscribe({
      next: (alunos) => {
        this.alunos = alunos;
        
        // Associar alunos às suas turmas
        this.turmas.forEach(turma => {
          if (turma.id) {
            turma.alunos = alunos.filter(a => a.turma?.id === turma.id);
          }
        });
        
        this.turmasFiltradas = [...this.turmas];
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar alunos:', error);
        this.turmasFiltradas = [...this.turmas];
        this.carregando = false;
      }
    });
  }

  carregarTurmasDosAlunos(): void {
    // Fallback: extrair turmas únicas dos alunos (caso o backend de turmas não esteja disponível)
    this.alunoService.listarAlunos().subscribe({
      next: (alunos) => {
        this.alunos = alunos;
        const turmasMap = new Map<number, Turma>();
        
        alunos.forEach(aluno => {
          if (aluno.turma && aluno.turma.id) {
            const turmaId = aluno.turma.id;
            if (!turmasMap.has(turmaId)) {
              turmasMap.set(turmaId, {
                id: aluno.turma.id,
                turno: aluno.turma.turno,
                dataInicio: aluno.turma.dataInicio,
                dataFim: aluno.turma.dataFim,
                curso: aluno.turma.curso,
                alunos: []
              });
            }
            const turma = turmasMap.get(turmaId)!;
            if (!turma.alunos) {
              turma.alunos = [];
            }
            turma.alunos.push(aluno);
          }
        });

        this.turmas = Array.from(turmasMap.values()).sort((a, b) => (a.id || 0) - (b.id || 0));
        this.turmasFiltradas = [...this.turmas];
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.erro = 'Erro ao carregar turmas e alunos';
        this.carregando = false;
      }
    });
  }

  /**
   * Retorna a quantidade de alunos de uma turma
   */
  getQuantidadeAlunos(turmaId?: number): number {
    if (!turmaId) return 0;
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma?.alunos?.length || 0;
  }

  /**
   * Verifica se a turma está no limite (20 alunos)
   */
  isTurmaNoLimite(turmaId?: number): boolean {
    return this.getQuantidadeAlunos(turmaId) >= this.LIMITE_ALUNOS_POR_TURMA;
  }

  /**
   * Retorna a lista de alunos de uma turma
   */
  getAlunosDaTurma(turmaId?: number): Aluno[] {
    if (!turmaId) return [];
    const turma = this.turmas.find(t => t.id === turmaId);
    return turma?.alunos || [];
  }

  /**
   * Retorna a lista de cursos únicos dos alunos de uma turma
   */
  getCursosDosAlunos(turmaId?: number): string[] {
    if (!turmaId) return [];
    const alunos = this.getAlunosDaTurma(turmaId);
    const cursosSet = new Set<string>();
    
    alunos.forEach(aluno => {
      if (aluno.cursos && aluno.cursos.length > 0) {
        aluno.cursos.forEach(curso => {
          if (curso.nome) {
            cursosSet.add(curso.nome);
          }
        });
      }
    });
    
    return Array.from(cursosSet).sort();
  }

  /**
   * Retorna a lista de cursos da turma (do relacionamento N×N)
   * Compatível com backend que retorna List<Curso> cursos
   */
  getCursosDaTurma(turma: Turma): { id?: number; nome: string }[] {
    // Se a turma tem lista de cursos (N×N do backend)
    if (turma.cursos && turma.cursos.length > 0) {
      return turma.cursos.map(c => ({ id: c.id, nome: c.nome }));
    }
    // Se a turma tem curso singular (compatibilidade)
    if (turma.curso && turma.curso.nome) {
      return [{ id: turma.curso.id, nome: turma.curso.nome }];
    }
    return [];
  }

  aplicarFiltros(): void {
    this.turmasFiltradas = this.turmas.filter(turma => {
      const turnoMatch = !this.filtroTurno || 
        turma.turno === this.filtroTurno;
      
      // Filtro por nome do aluno
      const nomeAlunoMatch = !this.filtroNomeAluno || 
        this.getAlunosDaTurma(turma.id).some(aluno => 
          aluno.nome.toLowerCase().includes(this.filtroNomeAluno.toLowerCase())
        );
      
      return turnoMatch && nomeAlunoMatch;
    });
  }

  limparFiltros(): void {
    this.filtroTurno = '';
    this.filtroNomeAluno = '';
    this.aplicarFiltros();
  }

  anexarTurma(): void { 
    this.router.navigate(['/turmas/novo']);
  }

  editar(id?: number): void { 
    if(id) {
      this.router.navigate(['/turmas/editar', id]);
    }
  }

  excluir(id?: number): void {
    if(!id) return;
    
    const turma = this.turmas.find(t => t.id === id);
    const turnoTurma = turma ? turma.turno : 'esta turma';
    const qtdAlunos = this.getQuantidadeAlunos(id);
    
    if(qtdAlunos > 0) {
      alert(`Não é possível excluir esta turma. Ela possui ${qtdAlunos} aluno(s) cadastrado(s).`);
      return;
    }
    
    if(!confirm(`Tem certeza que deseja excluir a turma ${turnoTurma}?`)) return;
    
    this.turmaService.excluirTurma(id).subscribe({
      next: () => {
        this.carregar();
        this.erro = '';
      },
      error: (error) => {
        this.erro = 'Erro ao excluir turma: ' + (error.error?.message || 'Erro desconhecido');
        console.error('Erro ao excluir turma:', error);
      }
    });
  }

  verAlunos(id?: number): void {
    if(id) {
      // Navegar para lista de alunos com filtro por turma
      this.router.navigate(['/alunos'], { 
        queryParams: { turmaId: id } 
      });
    }
  }
}

