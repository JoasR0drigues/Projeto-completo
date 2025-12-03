import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../model/aluno';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private url = "http://localhost:8080/alunos";

  constructor(private httpClient : HttpClient) { }

  //Métodos que consomem os serviços HTTP do backend

  listarAlunos(): Observable<Aluno[]>{
    return this.httpClient.get<Aluno[]>(`${this.url}`);
  }

  inserirAluno(aluno: Aluno): Observable<object>{
    return this.httpClient.post(`${this.url}`, aluno);
  }

  alterarAluno(codigo: number, aluno: Aluno): Observable<object>{
    const codigoNum = Number(codigo);
    if (isNaN(codigoNum) || codigoNum <= 0) {
      throw new Error('Código do aluno inválido');
    }
    return this.httpClient.put(`${this.url}/${codigoNum}`, aluno);
  }

  excluirAluno(codigo: number): Observable<Object>{
    const codigoNum = Number(codigo);
    if (isNaN(codigoNum) || codigoNum <= 0) {
      throw new Error('Código do aluno inválido');
    }
    return this.httpClient.delete(`${this.url}/${codigoNum}`);
  }

  consultarAluno(codigo: number): Observable<Aluno>{
    // Garantir que o código seja um número válido
    const codigoNum = Number(codigo);
    if (isNaN(codigoNum) || codigoNum <= 0) {
      throw new Error('Código do aluno inválido');
    }
    // Construir URL corretamente com barra
    const urlCompleta = `${this.url}/${codigoNum}`;
    return this.httpClient.get<Aluno>(urlCompleta);
  }

}
