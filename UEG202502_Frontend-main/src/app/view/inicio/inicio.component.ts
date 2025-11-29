import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlunoService } from '../../service/aluno.service';
import { Aluno } from '../../model/aluno';
import { CURSOS_SUKATECH } from '../../shared/constants/cursos.const';
import { CURSOS_INFO } from '../../shared/constants/cursos-info';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  imports: [CommonModule, RouterModule]
})
export class InicioComponent implements OnInit {

  totalAlunos = 0;
  totalBolsistas = 0;
  totalCursos = 0;
  mensalidadeMedia = 0;
  alunosRecentes: Aluno[] = [];
  dataAtualizacao = new Date();
  readonly cursosDisponiveis = CURSOS_SUKATECH;
  readonly cursosDetalhados = CURSOS_INFO;

  constructor(private alunoService: AlunoService) {}

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.alunoService.listarAlunos().subscribe({
      next: (alunos) => {
        this.totalAlunos = alunos.length;
        this.totalBolsistas = alunos.filter(a => a.bolsista).length;
        
        // Calcular cursos únicos
        this.totalCursos = this.cursosDisponiveis.length;
        
        // Calcular mensalidade média
        if (alunos.length > 0) {
          const totalMensalidade = alunos.reduce((sum, a) => sum + a.mensalidade, 0);
          this.mensalidadeMedia = totalMensalidade / alunos.length;
        }
        
        // Pegar os 6 alunos mais recentes (ordenados por data de matrícula)
        this.alunosRecentes = alunos
          .sort((a, b) => new Date(b.dataMatricula).getTime() - new Date(a.dataMatricula).getTime())
          .slice(0, 6);
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

}
