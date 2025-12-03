import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursoInfo, CURSOS_INFO, CURSOS_INFO_MAP } from '../../shared/constants/cursos-info';
import { TurmaService } from '../../service/turma.service';
import { AlunoService } from '../../service/aluno.service';
import { Turma } from '../../model/turma';
import { Aluno } from '../../model/aluno';

@Component({
  selector: 'app-curso-mestre',
  standalone: true,
  templateUrl: './curso-mestre.component.html',
  styleUrls: ['./curso-mestre.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CursoMestreComponent implements OnInit {

  /**
   * PARTE MESTRE:
   * Lista de cursos disponíveis para seleção no formulário mestre.
   */
  cursos: CursoInfo[] = CURSOS_INFO;

  /**
   * Campo que representa a escolha do registro mestre (curso).
   * É preenchido a partir do formulário (select).
   */
  slugSelecionado = '';

  /**
   * PARTE DETALHE:
   * Curso carregado a partir do mestre selecionado.
   */
  cursoSelecionado?: CursoInfo;

  /**
   * Turma selecionada no formulário mestre.
   * Este campo depende do curso selecionado (MESTRE).
   */
  turmaSelecionada?: number;

  /**
   * LISTA DE TURMAS REAIS DO BACKEND (DETALHE DO MESTRE).
   * Cada curso pode ter várias turmas.
   */
  turmasReais: Turma[] = [];
  carregandoTurmas = false;
  erroTurmas = '';

  /**
   * LISTA DE ALUNOS REAIS DO BACKEND.
   * Usado para relacionamento N×N (Curso x Aluno).
   */
  alunosReais: Aluno[] = [];
  carregandoAlunos = false;
  erroAlunos = '';

  constructor(
    private turmaService: TurmaService,
    private alunoService: AlunoService
  ) {}

  ngOnInit(): void {
    this.carregarTurmas();
    this.carregarAlunos();
  }

  /**
   * Carrega todas as turmas do backend.
   */
  carregarTurmas(): void {
    this.carregandoTurmas = true;
    this.erroTurmas = '';
    this.turmaService.listarTurmas().subscribe({
      next: (turmas) => {
        this.turmasReais = turmas;
        this.carregandoTurmas = false;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.erroTurmas = 'Erro ao carregar turmas do backend.';
        this.carregandoTurmas = false;
      }
    });
  }

  /**
   * Carrega todos os alunos do backend.
   */
  carregarAlunos(): void {
    this.carregandoAlunos = true;
    this.erroAlunos = '';
    this.alunoService.listarAlunos().subscribe({
      next: (alunos) => {
        this.alunosReais = alunos;
        this.carregandoAlunos = false;
      },
      error: (error) => {
        console.error('Erro ao carregar alunos:', error);
        this.erroAlunos = 'Erro ao carregar alunos do backend.';
        this.carregandoAlunos = false;
      }
    });
  }

  /**
   * LISTA DETALHADA de alunos vinculados ao curso mestre selecionado.
   * Representa o DETALHE no contexto do relacionamento N×N.
   * Busca alunos reais que têm o curso selecionado em seus cursos OU que estão em turmas do curso.
   */
  get alunosDoCursoSelecionado(): Aluno[] {
    if (!this.slugSelecionado || !this.cursoSelecionado) {
      return [];
    }

    const tituloCursoSelecionado = this.cursoSelecionado.titulo.trim();
    
    // Obter IDs das turmas do curso selecionado
    const idsTurmasDoCurso = this.turmasDoCursoSelecionado.map(t => t.id);

    // Buscar alunos de duas formas:
    // 1. Alunos que têm o curso na lista de cursos (N×N direto)
    // 2. Alunos que estão em turmas do curso selecionado
    const alunosEncontrados = new Set<number>(); // Usar Set para evitar duplicatas
    const alunosFiltrados: Aluno[] = [];

    this.alunosReais.forEach(aluno => {
      let encontrado = false;

      // Método 1: Verificar se o aluno tem o curso na lista de cursos
      if (aluno.cursos && aluno.cursos.length > 0) {
        encontrado = aluno.cursos.some(curso => {
          if (!curso.nome) return false;
          const nomeCursoAluno = curso.nome.trim();
          // Comparação case-insensitive e exata
          return nomeCursoAluno.toLowerCase() === tituloCursoSelecionado.toLowerCase() ||
                 nomeCursoAluno === tituloCursoSelecionado;
        });
      }

      // Método 2: Verificar se o aluno está em uma turma do curso selecionado
      if (!encontrado && aluno.turma?.id && idsTurmasDoCurso.includes(aluno.turma.id)) {
        encontrado = true;
      }

      // Adicionar aluno se encontrado e ainda não foi adicionado
      if (encontrado && aluno.codigo && !alunosEncontrados.has(aluno.codigo)) {
        alunosEncontrados.add(aluno.codigo);
        alunosFiltrados.push(aluno);
      }
    });

    return alunosFiltrados;
  }

  /**
   * Chamado sempre que o usuário escolhe um curso no formulário mestre.
   * Aqui fazemos a ligação Mestre -> Detalhe.
   */
  onSelecionarCurso(): void {
    if (this.slugSelecionado) {
      this.cursoSelecionado = CURSOS_INFO_MAP[this.slugSelecionado];
      // Limpar seleção de turma quando mudar o curso (turma depende do curso)
      this.turmaSelecionada = undefined;
    } else {
      this.cursoSelecionado = undefined;
      this.turmaSelecionada = undefined;
    }
  }

  /**
   * Retorna a lista de turmas REAIS do curso mestre selecionado.
   * Este é o DETALHE: turmas dependem do curso (MESTRE).
   * Filtra turmas do backend que pertencem ao curso selecionado.
   */
  get turmasDoCursoSelecionado(): Turma[] {
    if (!this.slugSelecionado || !this.cursoSelecionado) {
      return [];
    }

    // Filtrar turmas que têm o curso selecionado
    return this.turmasReais.filter(turma => {
      // Verificar se a turma tem cursos associados
      if (turma.cursos && turma.cursos.length > 0) {
        // Verificar se algum curso da turma corresponde ao curso selecionado
        return turma.cursos.some(curso => 
          curso.nome === this.cursoSelecionado?.titulo
        );
      }
      // Se a turma tem curso singular (compatibilidade)
      if (turma.curso) {
        return turma.curso.nome === this.cursoSelecionado?.titulo;
      }
      return false;
    });
  }

  /**
   * Retorna a quantidade de alunos em uma turma específica.
   */
  getQuantidadeAlunosTurma(turmaId?: number): number {
    if (!turmaId) return 0;
    return this.alunosReais.filter(aluno => aluno.turma?.id === turmaId).length;
  }

  /**
   * Exemplo de submissão do "formulário mestre".
   * Em um cenário real, aqui você chamaria o backend para salvar o registro mestre.
   */
  onSubmit(): void {
    if (!this.cursoSelecionado) {
      alert('Selecione um curso (MESTRE) antes de salvar.');
      return;
    }

    alert(`Mestre salvo com sucesso: ${this.cursoSelecionado.titulo}`);
  }
}


