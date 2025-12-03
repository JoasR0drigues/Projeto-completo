package com.br.controller;

import com.br.model.Aluno;
import com.br.model.Turma;
import com.br.model.Curso;
import com.br.service.AlunoService;
import com.br.service.TurmaService;
import com.br.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/alunos")
@CrossOrigin(origins = "*")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private TurmaService turmaService;

    @Autowired
    private CursoService cursoService;

    // Endpoint para listar todos os alunos
    @GetMapping
    public ResponseEntity<List<Aluno>> listarAlunos() {
        try {
            List<Aluno> alunos = alunoService.listarAlunos();
            return ResponseEntity.ok(alunos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para salvar um novo aluno
    @PostMapping
    public ResponseEntity<Aluno> salvarAluno(@RequestBody Aluno aluno) {
        try {
            Aluno alunoSalvo = alunoService.salvarAluno(aluno);
            return ResponseEntity.status(HttpStatus.CREATED).body(alunoSalvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para editar um aluno existente
    @PutMapping("/{id}")
    public ResponseEntity<Aluno> editarAluno(@PathVariable Long id, @RequestBody Aluno dadosAluno) {
        try {
            // Buscar o aluno existente
            Optional<Aluno> alunoExistenteOpt = alunoService.buscarAlunoPorId(id);
            
            if (alunoExistenteOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Aluno aluno = alunoExistenteOpt.get();
            
            // Atualizar campos básicos
            if (dadosAluno.getNome() != null) {
                aluno.setNome(dadosAluno.getNome());
            }
            
            if (dadosAluno.getDataMatricula() != null) {
                aluno.setDataMatricula(dadosAluno.getDataMatricula());
            }
            
            if (dadosAluno.getMensalidade() != null) {
                aluno.setMensalidade(dadosAluno.getMensalidade());
            }
            
            if (dadosAluno.getSemestre() != null) {
                aluno.setSemestre(dadosAluno.getSemestre());
            }
            
            // ✅ CORRIGIDO: usar getBolsista() em vez de isBolsista()
            if (dadosAluno.getBolsista() != null) {
                aluno.setBolsista(dadosAluno.getBolsista());
            }

            // Atualizar a turma (se fornecida)
            if (dadosAluno.getTurma() != null && dadosAluno.getTurma().getId() != null) {
                Optional<Turma> turmaOpt = turmaService.buscarTurmaPorId(dadosAluno.getTurma().getId());
                if (turmaOpt.isPresent()) {
                    aluno.setTurma(turmaOpt.get());
                }
            }

            // Atualizar os cursos (se fornecidos)
            if (dadosAluno.getCursos() != null && !dadosAluno.getCursos().isEmpty()) {
                aluno.setCursos(dadosAluno.getCursos());
            }

            Aluno alunoAtualizado = alunoService.salvarAluno(aluno);
            return ResponseEntity.ok(alunoAtualizado);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para excluir um aluno
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirAluno(@PathVariable Long id) {
        try {
            alunoService.excluirAluno(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para consultar um aluno por ID
    @GetMapping("/{id}")
    public ResponseEntity<Aluno> consultarAluno(@PathVariable Long id) {
        try {
            Optional<Aluno> alunoOpt = alunoService.buscarAlunoPorId(id);
            
            if (alunoOpt.isPresent()) {
                return ResponseEntity.ok(alunoOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

