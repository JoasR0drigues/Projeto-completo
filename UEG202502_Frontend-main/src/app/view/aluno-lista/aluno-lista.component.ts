import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno.service';
import { CURSOS_SUKATECH } from '../../shared/constants/cursos.const';

@Component({
  selector: 'app-aluno-lista',
  templateUrl: './aluno-lista.component.html',
  styleUrls: ['./aluno-lista.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AlunoListaComponent implements OnInit {

  alunos: Aluno[] = [];
  alunosFiltrados: Aluno[] = [];
  carregando = false;
  erro = '';

  // Filtros
  filtroNome = '';
  filtroCurso = '';
  filtroSemestre = '';
  filtroBolsista = '';
  filtroTurmaId?: number;

  // Listas para filtros
  cursos: string[] = CURSOS_SUKATECH;
  semestres: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Estatísticas
  get alunosBolsistas(): number {
    return this.alunos.filter(a => a.bolsista).length;
  }

  get cursosUnicos(): number {
    const cursosCatalogo = new Set(CURSOS_SUKATECH);
    const cursosNaBase = new Set<string>();

    this.alunos.forEach(a => {
      a.cursos?.forEach(c => {
        if (cursosCatalogo.has(c.nome)) {
          cursosNaBase.add(c.nome);
        }
      });
    });

    return cursosNaBase.size;
  }

  get mensalidadeMedia(): number {
    if (this.alunos.length === 0) return 0;
    const total = this.alunos.reduce((sum, a) => sum + a.mensalidade, 0);
    return total / this.alunos.length;
  }

  constructor(
    private service: AlunoService, 
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    // Verificar se há filtro por turma nos query params
    this.route.queryParams.subscribe(params => {
      if (params['turmaId']) {
        this.filtroTurmaId = Number(params['turmaId']);
      }
      this.carregar();
    });
  }

  carregar(){
    this.carregando = true;
    this.erro = '';
    
    this.service.listarAlunos().subscribe({
      next: data => { 
        this.alunos = data; 
        this.extrairCursos();
        // Aplicar filtros após carregar (incluindo filtro por turma se houver)
        this.aplicarFiltros();
        this.carregando = false; 
      },
      error: () => { 
        this.erro = 'Falha ao carregar os dados dos alunos';
        this.carregando = false; 
      }
    });
  }

  extrairCursos(): void {
    // Mantido para compatibilidade, mas agora os cursos são controlados pelo catálogo Sukatech.
    this.cursos = CURSOS_SUKATECH;
  }

  aplicarFiltros(): void {
    this.alunosFiltrados = this.alunos.filter(aluno => {
      const nomeMatch = !this.filtroNome || 
        aluno.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      
      const cursoMatch = !this.filtroCurso || 
        (aluno.cursos && aluno.cursos.some(c => c.nome === this.filtroCurso));
      
      const semestreMatch = !this.filtroSemestre || 
        aluno.semestre === Number(this.filtroSemestre);
      
      const bolsistaMatch = !this.filtroBolsista || 
        aluno.bolsista === (this.filtroBolsista === 'true');
      
      const turmaMatch = !this.filtroTurmaId || 
        aluno.turma?.id === this.filtroTurmaId;

      return nomeMatch && cursoMatch && semestreMatch && bolsistaMatch && turmaMatch;
    });
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroCurso = '';
    this.filtroSemestre = '';
    this.filtroBolsista = '';
    this.filtroTurmaId = undefined;
    // Remover query param da URL
    this.router.navigate(['/alunos'], { queryParams: {} });
    this.aplicarFiltros();
  }

  novo(): void { 
    this.router.navigate(['/alunos/novo']); 
  }

  editar(id?: number): void { 
    if(id) this.router.navigate(['/alunos/editar', id]); 
  }

  excluir(id?: number): void {
    if(!id) return;
    
    const aluno = this.alunos.find(a => a.codigo === id);
    const nomeAluno = aluno ? aluno.nome : 'este aluno';
    
    if(!confirm(`Tem certeza que deseja excluir ${nomeAluno}?`)) return;
    
    this.service.excluirAluno(id).subscribe({
      next: () => {
        this.carregar();
        this.erro = '';
      },
      error: () => {
        this.erro = 'Erro ao excluir o aluno. Tente novamente.';
      }
    });
  }

  // Método para obter status do aluno baseado no semestre
  getStatusAluno(semestre: number): string {
    if (semestre <= 2) return 'Iniciante';
    if (semestre <= 4) return 'Intermediário';
    if (semestre <= 6) return 'Avançado';
    return 'Finalista';
  }

  // Método para verificar se aluno está ativo (matriculado há menos de 2 anos)
  isAlunoAtivo(dataMatricula: Date): boolean {
    const doisAnosAtras = new Date();
    doisAnosAtras.setFullYear(doisAnosAtras.getFullYear() - 2);
    return new Date(dataMatricula) > doisAnosAtras;
  }

  // Método para calcular mensalidade com desconto para bolsistas
  calcularMensalidadeComDesconto(aluno: Aluno, percentualDesconto: number = 0.5): number {
    if (aluno.bolsista && percentualDesconto > 0) {
      return aluno.mensalidade * (1 - percentualDesconto);
    }
    return aluno.mensalidade;
  }

  // Helper para exibir os nomes dos cursos de um aluno em forma de string
  obterCursosAsString(aluno: Aluno): string {
    if (!aluno.cursos || aluno.cursos.length === 0) {
      return '-';
    }
    return aluno.cursos.map(c => c.nome).join(', ');
  }
}