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
     * O Spring Data JPA automaticamente implementa este método baseado na convenção de nomenclatura:
     * - findByNome -> busca por campo "nome"
     * - Retorna Optional<Curso> para lidar com casos onde o curso não é encontrado
     * 
     * @param nome Nome do curso a ser buscado (ex: "Desenvolvimento Web")
     * @return Optional contendo o curso encontrado, ou empty se não encontrado
     */
    Optional<Curso> findByNome(String nome);
}

