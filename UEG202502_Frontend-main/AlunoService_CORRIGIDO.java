package com.br.service;

import com.br.model.Aluno;
import com.br.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    // Método para listar todos os alunos
    public List<Aluno> listarAlunos() {
        return alunoRepository.findAll();
    }

    // Método para salvar um aluno (criar ou atualizar)
    public Aluno salvarAluno(Aluno aluno) {
        // Validações básicas antes de salvar
        if (aluno.getNome() == null || aluno.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome do aluno é obrigatório");
        }
        
        return alunoRepository.save(aluno);
    }

    // ✅ Método para buscar um aluno por ID (retorna Optional<Aluno>)
    public Optional<Aluno> buscarAlunoPorId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID do aluno inválido");
        }
        return alunoRepository.findById(id);
    }

    // Método para consultar um aluno por ID (retorna Aluno diretamente, lança exceção se não encontrar)
    public Aluno consultarAluno(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID do aluno inválido");
        }
        return alunoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + id));
    }

    // Método para excluir um aluno
    public void excluirAluno(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID do aluno inválido");
        }
        
        // Verificar se o aluno existe antes de excluir
        Optional<Aluno> aluno = alunoRepository.findById(id);
        if (aluno.isEmpty()) {
            throw new RuntimeException("Aluno não encontrado para exclusão com ID: " + id);
        }
        
        alunoRepository.deleteById(id);
    }
}

