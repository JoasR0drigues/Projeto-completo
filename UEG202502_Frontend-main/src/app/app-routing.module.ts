import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './view/inicio/inicio.component';
import { AlunoListaComponent } from './view/aluno-lista/aluno-lista.component';
import { AlunoFormComponent } from './view/aluno-form/aluno-form.component';
import { AlunoInsereComponent } from './view/aluno-insere/aluno-insere.component';
import { AlunoAlteraComponent } from './view/aluno-altera/aluno-altera.component';
import { AlunoConsultaComponent } from './view/aluno-consulta/aluno-consulta.component';

const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
  {path: 'inicio', component: InicioComponent},
  
  // Rotas para alunos
  {path: 'alunos', component: AlunoListaComponent},
  {path: 'alunos/novo', component: AlunoFormComponent},
  {path: 'alunos/editar/:id', component: AlunoFormComponent},
  
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
