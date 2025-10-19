import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../model/aluno';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private url = "http://localhost:8080/caluno/aluno";

  constructor(private httpClient : HttpClient) { }

  //Métodos que consomem os serviços HTTP do backend

  listarAlunos(): Observable<Aluno[]>{
    return this.httpClient.get<Aluno[]>(`${this.url}`);
  }

  inserirAluno(aluno: Aluno): Observable<object>{
    return this.httpClient.post(`${this.url}`, aluno);
  }

  alterarAluno(codigo: number, aluno: Aluno): Observable<object>{
    return this.httpClient.put(`${this.url}/${codigo}`, aluno);
  }

  excluirAluno(codigo: number): Observable<Object>{
    return this.httpClient.delete(`${this.url}/${codigo}`);
  }

  consultarAluno(codigo: number): Observable<Aluno>{
    return this.httpClient.get<Aluno>(`${this.url}/${codigo}`);
  }

}
