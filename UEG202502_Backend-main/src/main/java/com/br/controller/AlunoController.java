package com.br.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.br.exception.ResourceNotFoundException;
import com.br.model.Aluno;
import com.br.repository.AlunoRepository;

@RestController
@RequestMapping("/caluno/")
@CrossOrigin(origins = "*")
public class AlunoController {
    
    @Autowired
    private AlunoRepository alurep;

   
    @GetMapping("/aluno")
    public List<Aluno> listar() {
        // Endpoint: GET http://localhost:8080/caluno/aluno
        return alurep.findAll();
    }

    
    @GetMapping("/aluno/{id}")
    public ResponseEntity<Aluno> consultar(@PathVariable Long id) {
        Aluno aluno = alurep.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado."));
        return ResponseEntity.ok(aluno);
    }

    
    @PostMapping("/aluno")
    public ResponseEntity<Aluno> incluir(@RequestBody Aluno aluno) {
        Aluno salvo = alurep.save(aluno);
        return ResponseEntity.ok(salvo);
    }

    
    @PutMapping("/aluno/{id}")
    public ResponseEntity<Aluno> atualizar(@PathVariable Long id, @RequestBody Aluno dadosAluno) {
        Aluno aluno = alurep.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado."));

        aluno.setNome(dadosAluno.getNome());
        aluno.setCurso(dadosAluno.getCurso());
        aluno.setDataMatricula(dadosAluno.getDataMatricula());
        aluno.setMensalidade(dadosAluno.getMensalidade());
        aluno.setBolsista(dadosAluno.isBolsista());
        aluno.setSemestre(dadosAluno.getSemestre());

        Aluno atualizado = alurep.save(aluno);
        return ResponseEntity.ok(atualizado);
    }

    
    @DeleteMapping("/aluno/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Aluno aluno = alurep.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado."));
        alurep.delete(aluno);
        return ResponseEntity.noContent().build();
    }
}
