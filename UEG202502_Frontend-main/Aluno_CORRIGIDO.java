package com.br.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "aluno")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(name = "nome")
    private String nome;

    @ManyToOne
    @JoinColumn(name = "id_turma", referencedColumnName = "id")
    private Turma turma; // Relacionamento com Turma

    @ManyToMany
    @JoinTable(
        name = "matricula",  // Tabela intermediária para Turma e Curso
        joinColumns = @JoinColumn(name = "id_aluno"),  // FK para Aluno
        inverseJoinColumns = @JoinColumn(name = "id_curso")  // FK para Curso
    )
    private List<Curso> cursos; // Lista de cursos do aluno

    @Column(name = "data_matricula")
    private Date dataMatricula;

    @Column(name = "mensalidade")
    private Double mensalidade;  // ✅ CORRIGIDO: double → Double

    @Column(name = "semestre")
    private Integer semestre;  // ✅ CORRIGIDO: int → Integer

    @Column(name = "bolsista")
    private Boolean bolsista;  // ✅ Já estava correto

    // Getters e Setters
    public Long getCodigo() {
        return codigo;
    }

    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }

    public List<Curso> getCursos() {
        return cursos;
    }

    public void setCursos(List<Curso> cursos) {
        this.cursos = cursos;
    }

    public Date getDataMatricula() {
        return dataMatricula;
    }

    public void setDataMatricula(Date dataMatricula) {
        this.dataMatricula = dataMatricula;
    }

    public Double getMensalidade() {  // ✅ CORRIGIDO: double → Double
        return mensalidade;
    }

    public void setMensalidade(Double mensalidade) {  // ✅ CORRIGIDO: double → Double
        this.mensalidade = mensalidade;
    }

    public Integer getSemestre() {  // ✅ CORRIGIDO: int → Integer
        return semestre;
    }

    public void setSemestre(Integer semestre) {  // ✅ CORRIGIDO: int → Integer
        this.semestre = semestre;
    }

    public Boolean getBolsista() {  // ✅ CORRIGIDO: boolean → Boolean (mudei de isBolsista para getBolsista)
        return bolsista;
    }

    public void setBolsista(Boolean bolsista) {  // ✅ CORRIGIDO: boolean → Boolean
        this.bolsista = bolsista;
    }
}

