package com.br.repository;

import com.br.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    
    /**
     * Busca um curso pelo nome.
     * Este método é necessário para o TurmaService processar cursos enviados pelo frontend
     * que podem vir apenas com o nome (sem ID).
     * 
     * @param nome Nome do curso a ser buscado
     * @return Optional contendo o curso encontrado, ou empty se não encontrado
     */
    Optional<Curso> findByNome(String nome);
}

