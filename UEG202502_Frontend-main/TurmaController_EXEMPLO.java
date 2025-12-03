package com.br.controller;

import com.br.model.Turma;
import com.br.service.TurmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")  // Endpoint: http://localhost:8080/turmas
@CrossOrigin(origins = "http://localhost:4200")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    // GET /turmas - Listar todas as turmas
    @GetMapping
    public ResponseEntity<List<Turma>> listarTurmas() {
        try {
            List<Turma> turmas = turmaService.listarTurmas();
            return ResponseEntity.ok(turmas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /turmas/{id} - Consultar uma turma por ID
    @GetMapping("/{id}")
    public ResponseEntity<Turma> consultarTurma(@PathVariable Long id) {
        try {
            List<Turma> turmas = turmaService.listarTurmas();
            Turma turma = turmas.stream()
                    .filter(t -> t.getId().equals(id))
                    .findFirst()
                    .orElse(null);
            
            if (turma != null) {
                return ResponseEntity.ok(turma);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /turmas - Criar uma nova turma
    @PostMapping
    public ResponseEntity<Turma> criarTurma(@RequestBody Turma turma) {
        try {
            // Validar se o turno foi fornecido
            if (turma.getTurno() == null || turma.getTurno().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            Turma turmaSalva = turmaService.salvarTurma(turma);
            return ResponseEntity.status(HttpStatus.CREATED).body(turmaSalva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT /turmas/{id} - Atualizar uma turma existente
    @PutMapping("/{id}")
    public ResponseEntity<Turma> atualizarTurma(@PathVariable Long id, @RequestBody Turma turma) {
        try {
            // Validar se o turno foi fornecido
            if (turma.getTurno() == null || turma.getTurno().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            Turma turmaAtualizada = turmaService.editarTurma(id, turma);
            return ResponseEntity.ok(turmaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE /turmas/{id} - Excluir uma turma
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirTurma(@PathVariable Long id) {
        try {
            turmaService.excluirTurma(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

