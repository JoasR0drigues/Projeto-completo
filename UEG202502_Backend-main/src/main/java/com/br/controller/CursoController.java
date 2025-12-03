package com.br.controller;

import com.br.model.Curso;
import com.br.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    // GET /cursos - Listar todos os cursos
    @GetMapping
    public ResponseEntity<List<Curso>> listarCursos() {
        List<Curso> cursos = cursoService.listarCursos();
        return ResponseEntity.ok(cursos);
    }

    // POST /cursos - Criar um novo curso
    @PostMapping
    public ResponseEntity<Curso> criarCurso(@RequestBody Curso curso) {
        try {
            Curso cursoSalvo = cursoService.salvarCurso(curso);
            return ResponseEntity.status(HttpStatus.CREATED).body(cursoSalvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /cursos/cadastrar-inicial - Cadastrar todos os cursos iniciais de uma vez
    @PostMapping("/cadastrar-inicial")
    public ResponseEntity<String> cadastrarCursosIniciais() {
        try {
            // Verificar se já existem cursos cadastrados
            List<Curso> cursosExistentes = cursoService.listarCursos();
            if (!cursosExistentes.isEmpty()) {
                return ResponseEntity.ok("Cursos já cadastrados. Total: " + cursosExistentes.size());
            }

            // Criar os cursos iniciais
            Curso curso1 = new Curso();
            curso1.setNome("Manutenção de Computadores e Celulares");
            curso1.setCargaHoraria(120); // Ajuste conforme seu modelo
            cursoService.salvarCurso(curso1);

            Curso curso2 = new Curso();
            curso2.setNome("Excel Avançado");
            curso2.setCargaHoraria(90);
            cursoService.salvarCurso(curso2);

            Curso curso3 = new Curso();
            curso3.setNome("Marketing Digital");
            curso3.setCargaHoraria(110);
            cursoService.salvarCurso(curso3);

            Curso curso4 = new Curso();
            curso4.setNome("Introdução à IA");
            curso4.setCargaHoraria(80);
            cursoService.salvarCurso(curso4);

            Curso curso5 = new Curso();
            curso5.setNome("Informática Básica");
            curso5.setCargaHoraria(60);
            cursoService.salvarCurso(curso5);

            return ResponseEntity.ok("5 cursos cadastrados com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao cadastrar cursos: " + e.getMessage());
        }
    }

    // GET /cursos/{id} - Consultar um curso por ID
    @GetMapping("/{id}")
    public ResponseEntity<Curso> consultarCurso(@PathVariable Long id) {
        try {
            Curso curso = cursoService.consultarCurso(id);
            return ResponseEntity.ok(curso);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT /cursos/{id} - Atualizar um curso
    @PutMapping("/{id}")
    public ResponseEntity<Curso> atualizarCurso(@PathVariable Long id, @RequestBody Curso dadosCurso) {
        try {
            Curso cursoAtualizado = cursoService.editarCurso(id, dadosCurso);
            return ResponseEntity.ok(cursoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /cursos/{id} - Excluir um curso
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirCurso(@PathVariable Long id) {
        try {
            cursoService.excluirCurso(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

