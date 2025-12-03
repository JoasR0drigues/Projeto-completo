package com.br.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // Certifique-se de importar a anotação
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "turno")
    private String turno; // Ex: "Matutino", "Vespertino", "Noturno"

    @ManyToMany
    @JoinTable(
        name = "turma_curso",  // Tabela intermediária para Turma e Curso
        joinColumns = @JoinColumn(name = "id_turma"),  // FK para Turma
        inverseJoinColumns = @JoinColumn(name = "id_curso")  // FK para Curso
    )
    private List<Curso> cursos; // Lista de cursos associados à turma

    @Column(name = "data_inicio")
    private Date dataInicio; // Data de início da turma

    @Column(name = "data_fim")
    private Date dataFim; // Data de término da turma (calculada baseada na carga horária)

    @OneToMany(mappedBy = "turma")
    @JsonIgnore  // Ignora a propriedade "alunos" para evitar referência circular ao serializar
    private List<Aluno> alunos; // Relacionamento com a entidade Aluno


    // Construtores, getters e setters
    public Turma() {}

    public Turma(String turno, List<Curso> cursos, Date dataInicio, Date dataFim) {
        this.turno = turno;
        this.cursos = cursos;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public List<Curso> getCursos() {
        return cursos;
    }

    public void setCursos(List<Curso> cursos) {
        this.cursos = cursos;
    }

    public Date getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(Date dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Date getDataFim() {
        return dataFim;
    }

    public void setDataFim(Date dataFim) {
        this.dataFim = dataFim;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<Aluno> alunos) {
        this.alunos = alunos;
    }

    // Método para contar o número de alunos na turma
    public int getQuantidadeAlunos() {
        return alunos != null ? alunos.size() : 0;
    }

    // Método para calcular a data de término com base nos cursos associados à turma
    public void calcularDataTermino() {
        if (this.dataInicio != null && this.cursos != null && !this.cursos.isEmpty()) {
            int totalHoras = this.cursos.stream().mapToInt(Curso::getCargaHoraria).sum(); // Soma das cargas horárias dos cursos

            // Estima-se que cada 8 horas representem 1 dia útil de aulas (ajustável conforme necessário)
            int diasDeAula = totalHoras / 8;

            // Calcula a data de término adicionando os dias de aula à data de início
            this.dataFim = new Date(this.dataInicio.getTime() + (diasDeAula * 24 * 60 * 60 * 1000L)); // Adiciona dias em milissegundos
        }
    }
}
