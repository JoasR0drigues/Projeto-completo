import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './view/inicio/inicio.component';
import { AlunoListaComponent } from './view/aluno-lista/aluno-lista.component';
import { AlunoFormComponent } from './view/aluno-form/aluno-form.component';
import { AlunoInsereComponent } from './view/aluno-insere/aluno-insere.component';
import { AlunoAlteraComponent } from './view/aluno-altera/aluno-altera.component';
import { AlunoConsultaComponent } from './view/aluno-consulta/aluno-consulta.component';
import { CursoDetalheComponent } from './view/curso-detalhe/curso-detalhe.component';
import { CursoMestreComponent } from './view/curso-mestre/curso-mestre.component';
import { TurmaListaComponent } from './view/turma-lista/turma-lista.component';
import { TurmaFormComponent } from './view/turma-form/turma-form.component';

const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
  {path: 'inicio', component: InicioComponent},
  {path: 'cursos/:slug', component: CursoDetalheComponent},
  // Tela demonstrando explicitamente Mestre (Curso) / Detalhe (informações do curso)
  {path: 'cursos-mestre', component: CursoMestreComponent},
  
  // Rotas para alunos
  {path: 'alunos', component: AlunoListaComponent},
  {path: 'alunos/novo', component: AlunoFormComponent},
  {path: 'alunos/editar/:id', component: AlunoFormComponent},
  
  // Rotas para turmas
  {path: 'turmas', component: TurmaListaComponent},
  {path: 'turmas/novo', component: TurmaFormComponent},
  {path: 'turmas/editar/:id', component: TurmaFormComponent},
  
  // Rotas antigas (mantidas para compatibilidade)
  {path: 'aluno-lista', component: AlunoListaComponent},
  {path: 'aluno-altera/:codigo', component: AlunoAlteraComponent},
  {path: 'aluno-insere', component: AlunoInsereComponent},
  {path: 'aluno-consulta/:codigo', component: AlunoConsultaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
