package com.br.model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "aluno")
public class Aluno {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long codigo;
	
	@Column(name = "nome")
	private String nome;
	
	@Column(name = "curso")
	private String curso;
	
	@Column(name = "data_matricula")
	private Date dataMatricula;
	
	@Column(name = "mensalidade")
	private double mensalidade;
	
	@Column(name = "bolsista")
	private boolean bolsista;
	
	@Column(name = "semestre")
	private int semestre;

	// Construtor padrão
	public Aluno() {
		super();
	}

	// Construtor com todos os campos
	public Aluno(Long codigo, String nome, String curso, Date dataMatricula, double mensalidade,
			boolean bolsista, int semestre) {
		super();
		this.codigo = codigo;
		this.nome = nome;
		this.curso = curso;
		this.dataMatricula = dataMatricula;
		this.mensalidade = mensalidade;
		this.bolsista = bolsista;
		this.semestre = semestre;
	}

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

	public String getCurso() {
		return curso;
	}

	public void setCurso(String curso) {
		this.curso = curso;
	}

	public Date getDataMatricula() {
		return dataMatricula;
	}

	public void setDataMatricula(Date dataMatricula) {
		this.dataMatricula = dataMatricula;
	}

	public double getMensalidade() {
		return mensalidade;
	}

	public void setMensalidade(double mensalidade) {
		this.mensalidade = mensalidade;
	}

	public boolean isBolsista() {
		return bolsista;
	}

	public void setBolsista(boolean bolsista) {
		this.bolsista = bolsista;
	}

	public int getSemestre() {
		return semestre;
	}

	public void setSemestre(int semestre) {
		this.semestre = semestre;
	}
}
