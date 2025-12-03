package com.br.service;

import com.br.model.Curso;
import com.br.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    // Método para listar todos os cursos
    public List<Curso> listarCursos() {
        return cursoRepository.findAll();
    }

    // Método para salvar um novo curso
    public Curso salvarCurso(Curso curso) {
        return cursoRepository.save(curso);
    }

    // Método para editar um curso existente
    public Curso editarCurso(Long id, Curso dadosCurso) {
        Optional<Curso> cursoExistente = cursoRepository.findById(id);
        if (cursoExistente.isPresent()) {
            Curso curso = cursoExistente.get();
            curso.setNome(dadosCurso.getNome());
            curso.setCargaHoraria(dadosCurso.getCargaHoraria());  // Atualiza os detalhes do curso
            return cursoRepository.save(curso);
        } else {
            throw new RuntimeException("Curso não encontrado para atualização");
        }
    }

    // Método para excluir um curso
    public void excluirCurso(Long id) {
        cursoRepository.deleteById(id);
    }

    // Método para consultar um curso por ID
    public Curso consultarCurso(Long id) {
        Optional<Curso> cursoExistente = cursoRepository.findById(id);
        return cursoExistente.orElseThrow(() -> new RuntimeException("Curso não encontrado"));
    }

    // Método para buscar um curso pelo nome (opcional - pode ser usado pelo TurmaService)
    public Optional<Curso> buscarCursoPorNome(String nome) {
        return cursoRepository.findByNome(nome);
    }
}

