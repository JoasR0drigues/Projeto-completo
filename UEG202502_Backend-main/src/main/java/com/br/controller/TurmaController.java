package com.br.controller;

import com.br.model.Turma;
import com.br.service.TurmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")  // URL base para os endpoints de turma
@CrossOrigin(origins = "*")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    // Endpoint para listar todas as turmas
    @GetMapping
    public List<Turma> listarTurmas() {
        return turmaService.listarTurmas();
    }

    // Endpoint para salvar uma nova turma
    @PostMapping
    public ResponseEntity<Turma> salvarTurma(@RequestBody Turma turma) {
        Turma turmaSalva = turmaService.salvarTurma(turma);
        return ResponseEntity.ok(turmaSalva);
    }

    // Endpoint para editar uma turma existente
    @PutMapping("/{id}")
    public ResponseEntity<Turma> editarTurma(@PathVariable Long id, @RequestBody Turma dadosTurma) {
        Turma turmaAtualizada = turmaService.editarTurma(id, dadosTurma);
        return ResponseEntity.ok(turmaAtualizada);
    }

    // Endpoint para excluir uma turma
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirTurma(@PathVariable Long id) {
        turmaService.excluirTurma(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para consultar uma turma por ID
    @GetMapping("/{id}")
    public ResponseEntity<Turma> consultarTurma(@PathVariable Long id) {
        Turma turma = turmaService.consultarTurma(id);
        return ResponseEntity.ok(turma);
    }
}
