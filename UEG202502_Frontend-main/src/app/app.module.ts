import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AlunoListaComponent } from './view/aluno-lista/aluno-lista.component';
import { InicioComponent } from './view/inicio/inicio.component';
import { AlunoAlteraComponent } from './view/aluno-altera/aluno-altera.component';
import { AlunoConsultaComponent } from './view/aluno-consulta/aluno-consulta.component';
import { AlunoInsereComponent } from './view/aluno-insere/aluno-insere.component';
import { CursoMestreComponent } from './view/curso-mestre/curso-mestre.component';

@NgModule({
  declarations: [
    AppComponent,
    AlunoAlteraComponent,
    AlunoConsultaComponent,
    AlunoInsereComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    // Importar componentes standalone
    AlunoListaComponent,
    InicioComponent,
    CursoMestreComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
