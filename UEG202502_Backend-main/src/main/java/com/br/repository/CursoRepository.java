package com.br.repository;

import com.br.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    
    /**
     * Busca um curso pelo nome (case-sensitive).
     * Este método é necessário para o TurmaService processar cursos enviados pelo frontend.
     */
    Optional<Curso> findByNome(String nome);
    
    /**
     * Busca um curso pelo nome ignorando maiúsculas/minúsculas (case-insensitive).
     * Útil quando o nome pode vir com variações de capitalização.
     */
    @Query("SELECT c FROM Curso c WHERE LOWER(TRIM(c.nome)) = LOWER(TRIM(:nome))")
    Optional<Curso> findByNomeIgnoreCase(@Param("nome") String nome);
}

