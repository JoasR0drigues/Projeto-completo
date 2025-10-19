import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Aluno } from '../../model/aluno';
import { AlunoService } from '../../service/aluno.service';

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

  // Listas para filtros
  cursos: string[] = [];
  semestres: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Estatísticas
  get alunosBolsistas(): number {
    return this.alunos.filter(a => a.bolsista).length;
  }

  get cursosUnicos(): number {
    const cursosUnicos = new Set(this.alunos.map(a => a.curso));
    return cursosUnicos.size;
  }

  get mensalidadeMedia(): number {
    if (this.alunos.length === 0) return 0;
    const total = this.alunos.reduce((sum, a) => sum + a.mensalidade, 0);
    return total / this.alunos.length;
  }

  constructor(
    private service: AlunoService, 
    private router: Router
  ){}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(){
    this.carregando = true;
    this.erro = '';
    
    this.service.listarAlunos().subscribe({
      next: data => { 
        this.alunos = data; 
        this.alunosFiltrados = [...data];
        this.extrairCursos();
        this.carregando = false; 
      },
      error: () => { 
        this.erro = 'Falha ao carregar os dados dos alunos';
        this.carregando = false; 
      }
    });
  }

  extrairCursos(): void {
    const cursosUnicos = new Set(this.alunos.map(a => a.curso));
    this.cursos = Array.from(cursosUnicos).sort();
  }

  aplicarFiltros(): void {
    this.alunosFiltrados = this.alunos.filter(aluno => {
      const nomeMatch = !this.filtroNome || 
        aluno.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      
      const cursoMatch = !this.filtroCurso || 
        aluno.curso === this.filtroCurso;
      
      const semestreMatch = !this.filtroSemestre || 
        aluno.semestre === Number(this.filtroSemestre);
      
      const bolsistaMatch = !this.filtroBolsista || 
        aluno.bolsista === (this.filtroBolsista === 'true');

      return nomeMatch && cursoMatch && semestreMatch && bolsistaMatch;
    });
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroCurso = '';
    this.filtroSemestre = '';
    this.filtroBolsista = '';
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
}