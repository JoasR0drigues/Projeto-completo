import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Turma } from '../model/turma';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {

  private url = "http://localhost:8080/turmas";

  constructor(private httpClient: HttpClient) { }

  /**
   * Processa uma turma para quebrar referências circulares
   */
  private processarTurma(turma: any): Turma {
    // Processar cursos: pode vir como lista (N×N) ou como objeto singular
    let cursosProcessados: { id?: number; nome: string }[] = [];
    let cursoProcessado: { id?: number; nome: string } | undefined;
    
    if (turma.cursos && Array.isArray(turma.cursos) && turma.cursos.length > 0) {
      // Se for lista (N×N do backend), processar todos os cursos
      cursosProcessados = turma.cursos.map((c: any) => ({
        id: c.id,
        nome: c.nome
      }));
      // Pegar o primeiro curso como "curso principal" para compatibilidade
      cursoProcessado = cursosProcessados[0];
    } else if (turma.curso) {
      // Se for objeto singular (compatibilidade)
      cursoProcessado = {
        id: turma.curso.id,
        nome: turma.curso.nome
      };
      cursosProcessados = [cursoProcessado];
    }
    
    return {
      id: turma.id,
      turno: turma.turno,
      dataInicio: turma.dataInicio ? new Date(turma.dataInicio) : undefined,
      dataFim: turma.dataFim ? new Date(turma.dataFim) : undefined,
      curso: cursoProcessado, // Para compatibilidade com código existente
      cursos: cursosProcessados, // Lista completa de cursos (N×N)
      // Limpar referência circular: alunos não devem ter turma dentro deles
      alunos: turma.alunos ? turma.alunos.map((aluno: any) => ({
        codigo: aluno.codigo,
        nome: aluno.nome,
        dataMatricula: aluno.dataMatricula,
        mensalidade: aluno.mensalidade,
        bolsista: aluno.bolsista,
        semestre: aluno.semestre,
        cursos: aluno.cursos || [],
        // Não incluir turma dentro do aluno para evitar referência circular
        turma: undefined
      })) : []
    };
  }

  // Métodos que consomem os serviços HTTP do backend

  listarTurmas(): Observable<Turma[]> {
    // Tentar primeiro como JSON
    return this.httpClient.get<any[]>(`${this.url}`).pipe(
      map((turmas: any[]) => {
        return turmas.map((turma: any) => this.processarTurma(turma));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao listar turmas:', error);
        
        // Se for erro 500, verificar o tipo de erro
        if (error.status === 500) {
          const errorMessage = error.error?.message || error.message || 'Erro interno no servidor';
          console.error('Erro 500 no backend');
          console.error('Detalhes do erro:', errorMessage);
          
          // Verificar se é problema com campo primitivo recebendo null
          if (errorMessage.includes('Null value was assigned to a property') || 
              errorMessage.includes('primitive type')) {
            // Extrair o nome do campo do erro
            const campoMatch = errorMessage.match(/\[class com\.br\.model\.Aluno\.(\w+)\]/);
            const nomeCampo = campoMatch ? campoMatch[1] : 'campo';
            
            // Determinar o tipo correto baseado no nome do campo
            let tipoCorreto = '';
            let tipoErrado = '';
            if (nomeCampo === 'bolsista') {
              tipoErrado = 'boolean';
              tipoCorreto = 'Boolean';
            } else if (nomeCampo === 'mensalidade') {
              tipoErrado = 'double';
              tipoCorreto = 'Double';
            } else if (nomeCampo === 'semestre') {
              tipoErrado = 'int';
              tipoCorreto = 'Integer';
            } else {
              tipoErrado = 'tipo primitivo';
              tipoCorreto = 'classe wrapper (Boolean, Double, Integer, etc.)';
            }
            
            console.error(`Solução: Mude o campo "${nomeCampo}" na entidade Aluno de "${tipoErrado}" para "${tipoCorreto}"`);
            return throwError(() => new Error(`Erro 500: O campo "${nomeCampo}" na entidade Aluno deve ser "${tipoCorreto}" (não "${tipoErrado}") para permitir valores null.`));
          }
          
          // Caso contrário, pode ser referência circular
          console.error('Solução: O backend precisa usar @JsonIgnore na propriedade "alunos" da entidade Turma');
          return throwError(() => new Error('Erro 500: O backend precisa configurar @JsonIgnore na propriedade "alunos" da entidade Turma para evitar referência circular.'));
        }
        
        // Para outros erros, propagar o erro original
        return throwError(() => error);
      })
    );
  }

  inserirTurma(turma: Turma): Observable<object> {
    return this.httpClient.post(`${this.url}`, turma);
  }

  alterarTurma(id: number, turma: Turma): Observable<object> {
    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
      throw new Error('ID da turma inválido');
    }
    return this.httpClient.put(`${this.url}/${idNum}`, turma);
  }

  excluirTurma(id: number): Observable<Object> {
    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
      throw new Error('ID da turma inválido');
    }
    return this.httpClient.delete(`${this.url}/${idNum}`);
  }

  consultarTurma(id: number): Observable<Turma> {
    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
      throw new Error('ID da turma inválido');
    }
    const urlCompleta = `${this.url}/${idNum}`;
    // Receber como texto para processar manualmente e quebrar referências circulares
    return this.httpClient.get(urlCompleta, { responseType: 'text' }).pipe(
      map((responseText: string) => {
        try {
          // Remover referências circulares
          let textoLimpo = responseText;
          textoLimpo = textoLimpo.replace(/,"turma":\{[^}]*"id":[^,}]*,"turno":"[^"]*"[^}]*\}/g, '');
          
          let tentativas = 0;
          while (textoLimpo.includes('"turma":{') && tentativas < 10) {
            textoLimpo = textoLimpo.replace(/,"turma":\{[^}]*\}/g, '');
            tentativas++;
          }
          
          const turma = JSON.parse(textoLimpo);
          return this.processarTurma(turma);
        } catch (error) {
          console.error('Erro ao processar resposta do backend:', error);
          throw new Error('Erro ao processar resposta do servidor.');
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error('Erro ao consultar turma:', error);
        return throwError(() => error);
      })
    );
  }
}

