import { Curso } from './curso';

/**
 * Model Turma - Representa uma turma no sistema.
 * 
 * Relacionamento 1:N (OneToMany) com Aluno:
 * - Uma turma pode ter vários alunos
 * - Muitos alunos pertencem a uma turma (lado N no Aluno)
 */
export class Turma {
    id?: number;
    turno!: string; // Ex: "Matutino", "Vespertino", "Noturno"
    dataInicio?: Date; // Data de início da turma
    dataFim?: Date; // Data de fim da turma (calculada baseada na carga horária)
    
    /**
     * Relacionamento N:1 (ManyToOne) com Curso.
     * Uma turma pertence a um curso.
     * NOTA: O backend usa List<Curso> cursos (N×N), mas no frontend usamos curso (singular)
     * para compatibilidade com a interface.
     */
    curso?: Curso;
    
    /**
     * Lista de cursos (N×N) - usado quando o backend retorna List<Curso>
     * No frontend, usamos apenas o primeiro curso da lista como "curso principal"
     */
    cursos?: Curso[];
    
    /**
     * Relacionamento 1:N (OneToMany) com Aluno.
     * Uma turma pode ter vários alunos.
     * Nota: No frontend, geralmente não precisamos carregar a lista completa de alunos,
     * apenas o relacionamento reverso (aluno.turma) é usado.
     */
    alunos?: any[]; // Tipo genérico para evitar dependência circular
}

