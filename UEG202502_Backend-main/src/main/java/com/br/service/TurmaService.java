package com.br.service;

import com.br.model.Turma;
import com.br.model.Curso;
import com.br.repository.TurmaRepository;
import com.br.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class TurmaService {

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    // Método para listar todas as turmas
    public List<Turma> listarTurmas() {
        return turmaRepository.findAll();
    }

    // Método para salvar uma nova turma
    public Turma salvarTurma(Turma turma) {
        // Processar cursos: buscar pelo nome se necessário
        processarCursos(turma);
        
        // Calcular a data de término, caso não tenha sido fornecida
        if (turma.getDataFim() == null) {
            calcularDataTermino(turma); // Se a data de término não foi informada, o backend calcula
        }
        return turmaRepository.save(turma);
    }

    // Método para editar uma turma existente
    public Turma editarTurma(Long id, Turma dadosTurma) {
        Optional<Turma> turmaExistente = turmaRepository.findById(id);
        if (turmaExistente.isPresent()) {
            Turma turma = turmaExistente.get();
            turma.setTurno(dadosTurma.getTurno());
            
            // Processar cursos: buscar pelo nome se necessário
            if (dadosTurma.getCursos() != null) {
                processarCursos(dadosTurma);
                turma.setCursos(dadosTurma.getCursos());
            }
            
            if (dadosTurma.getDataInicio() != null) {
                turma.setDataInicio(dadosTurma.getDataInicio());
            }
            
            if (dadosTurma.getDataFim() != null) {
                turma.setDataFim(dadosTurma.getDataFim()); // A data de fim pode vir do frontend
            } else if (turma.getDataFim() == null) { // Caso a data de término não tenha sido fornecida, recalcular
                calcularDataTermino(turma);
            }
            
            return turmaRepository.save(turma);
        } else {
            throw new RuntimeException("Turma não encontrada para atualização");
        }
    }

    // Método para excluir uma turma
    public void excluirTurma(Long id) {
        Optional<Turma> turma = turmaRepository.findById(id);
        if (turma.isPresent()) {
            turmaRepository.deleteById(id);
        } else {
            throw new RuntimeException("Turma não encontrada para exclusão");
        }
    }

    // Método para consultar uma turma por ID (retorna Turma diretamente)
    public Turma consultarTurma(Long id) {
        Optional<Turma> turmaExistente = turmaRepository.findById(id);
        return turmaExistente.orElseThrow(() -> new RuntimeException("Turma não encontrada"));
    }

   
    public Optional<Turma> buscarTurmaPorId(Long id) {
        return turmaRepository.findById(id);
    }

    /**
     * Processa a lista de cursos da turma, buscando cursos completos pelo nome quando necessário.
     * O frontend pode enviar cursos com apenas "nome", então precisamos buscar o curso completo no banco.
     * 
     * Melhorias:
     * - Busca case-insensitive (ignora maiúsculas/minúsculas)
     * - Remove espaços extras (trim)
     * - Tenta buscar exato primeiro, depois case-insensitive
     * - Lista todos os cursos disponíveis se não encontrar (para debug)
     */
    private void processarCursos(Turma turma) {
        if (turma.getCursos() != null && !turma.getCursos().isEmpty()) {
            List<Curso> cursosCompletos = new ArrayList<>();
            
            for (Curso cursoRecebido : turma.getCursos()) {
                Curso cursoCompleto = null;
                
                // Se o curso tem ID, buscar pelo ID
                if (cursoRecebido.getId() != null) {
                    Optional<Curso> cursoEncontrado = cursoRepository.findById(cursoRecebido.getId());
                    if (cursoEncontrado.isPresent()) {
                        cursoCompleto = cursoEncontrado.get();
                    }
                }
                // Se não tem ID mas tem nome, buscar pelo nome
                else if (cursoRecebido.getNome() != null && !cursoRecebido.getNome().trim().isEmpty()) {
                    String nomeCurso = cursoRecebido.getNome().trim();
                    
                    // Tentar busca exata primeiro
                    Optional<Curso> cursoEncontrado = cursoRepository.findByNome(nomeCurso);
                    
                    // Se não encontrou, tentar case-insensitive
                    if (!cursoEncontrado.isPresent()) {
                        // Buscar todos os cursos e comparar case-insensitive
                        List<Curso> todosCursos = cursoRepository.findAll();
                        cursoEncontrado = todosCursos.stream()
                            .filter(c -> c.getNome() != null && 
                                        c.getNome().trim().equalsIgnoreCase(nomeCurso))
                            .findFirst();
                    }
                    
                    if (cursoEncontrado.isPresent()) {
                        cursoCompleto = cursoEncontrado.get();
                    } else {
                        // Se não encontrou, listar cursos disponíveis para ajudar no debug
                        List<Curso> todosCursos = cursoRepository.findAll();
                        StringBuilder cursosDisponiveis = new StringBuilder();
                        todosCursos.forEach(c -> {
                            if (cursosDisponiveis.length() > 0) cursosDisponiveis.append(", ");
                            cursosDisponiveis.append(c.getNome());
                        });
                        
                        throw new RuntimeException(
                            "Curso não encontrado: '" + nomeCurso + "'. " +
                            "Cursos disponíveis no banco: " + cursosDisponiveis.toString()
                        );
                    }
                }
                
                // Adicionar apenas se encontrou o curso completo
                if (cursoCompleto != null) {
                    cursosCompletos.add(cursoCompleto);
                }
            }
            
            turma.setCursos(cursosCompletos);
        }
    }

    // Método para calcular a data de término com base nos cursos associados à turma
    private void calcularDataTermino(Turma turma) {
        if (turma.getDataInicio() != null && turma.getCursos() != null && !turma.getCursos().isEmpty()) {
            int totalHoras = turma.getCursos().stream()
                .mapToInt(Curso::getCargaHoraria)
                .sum(); // Soma das cargas horárias dos cursos

            // Estima-se que cada 8 horas representem 1 dia útil de aulas (ajustável conforme necessário)
            int diasDeAula = totalHoras / 8;

            // Calcula a data de término adicionando os dias de aula à data de início
            turma.setDataFim(new java.util.Date(turma.getDataInicio().getTime() + (diasDeAula * 24 * 60 * 60 * 1000L))); // Adiciona dias em milissegundos
        }
    }

    // Método para adicionar um curso a uma turma
    public Turma adicionarCurso(Long idTurma, Long idCurso) {
        Optional<Turma> turma = turmaRepository.findById(idTurma);
        Optional<Curso> curso = cursoRepository.findById(idCurso);

        if (turma.isPresent() && curso.isPresent()) {
            Turma turmaEncontrada = turma.get();
            if (turmaEncontrada.getCursos() == null) {
                turmaEncontrada.setCursos(new java.util.ArrayList<>());
            }
            turmaEncontrada.getCursos().add(curso.get());
            calcularDataTermino(turmaEncontrada); // Recalcula a data de término após adicionar curso
            return turmaRepository.save(turmaEncontrada);
        } else {
            throw new RuntimeException("Turma ou curso não encontrado");
        }
    }

    // Método para remover um curso de uma turma
    public Turma removerCurso(Long idTurma, Long idCurso) {
        Optional<Turma> turma = turmaRepository.findById(idTurma);
        Optional<Curso> curso = cursoRepository.findById(idCurso);

        if (turma.isPresent() && curso.isPresent()) {
            Turma turmaEncontrada = turma.get();
            if (turmaEncontrada.getCursos() != null) {
                turmaEncontrada.getCursos().remove(curso.get());
                calcularDataTermino(turmaEncontrada); // Recalcula a data de término após remover curso
                return turmaRepository.save(turmaEncontrada);
            }
            return turmaEncontrada;
        } else {
            throw new RuntimeException("Turma ou curso não encontrado");
        }
    }
}

