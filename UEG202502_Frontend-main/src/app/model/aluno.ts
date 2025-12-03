import { Curso } from './curso';
import { Turma } from './turma';

export class Aluno {

    // Opcional no frontend: novo aluno ainda não tem código definido
    codigo?: number;
    nome!: string;
    dataMatricula!: Date;
    mensalidade!: number;
    bolsista!: boolean;
    semestre!: number;

    /**
     * Relacionamento N:1 (ManyToOne) com Turma.
     * Muitos alunos pertencem a uma turma.
     * Este é o lado "muitos" do relacionamento.
     */
    turma?: Turma;

    /**
     * Nova estrutura vinda do backend:
     * relacionamento N×N Aluno x Curso.
     */
    cursos: Curso[] = [];

    /**
     * Campo auxiliar apenas para compatibilidade com telas antigas
     * que usam "aluno.curso" (um único curso em forma de string).
     * Aqui usamos o PRIMEIRO curso da lista como "curso principal".
     */
    get curso(): string {
        return this.cursos && this.cursos.length > 0 ? this.cursos[0].nome : '';
    }

    set curso(valor: string) {
        if (!valor) {
            this.cursos = [];
            return;
        }
        if (!this.cursos) {
            this.cursos = [];
        }
        if (this.cursos.length === 0) {
            this.cursos.push({ nome: valor });
        } else {
            this.cursos[0].nome = valor;
        }
    }
}

