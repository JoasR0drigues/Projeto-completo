# Atualização do Backend - Turma com Curso e Datas

## 🎯 Objetivo

Atualizar a entidade `Turma` no backend para suportar:
- Relacionamento com `Curso`
- Campos `dataInicio` e `dataFim`

## 📋 Atualização da Entidade Turma

### Código Atualizado:

```java
package com.br.model;

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

    // ✅ ADICIONAR: Relacionamento com Curso
    @ManyToOne
    @JoinColumn(name = "id_curso", referencedColumnName = "id")
    private Curso curso;

    // ✅ ADICIONAR: Data de início
    @Column(name = "data_inicio")
    private Date dataInicio;

    // ✅ ADICIONAR: Data de fim
    @Column(name = "data_fim")
    private Date dataFim;

    @OneToMany(mappedBy = "turma")
    @JsonIgnore  // Evitar referência circular
    private List<Aluno> alunos;

    // Construtores
    public Turma() {}

    public Turma(String turno) {
        this.turno = turno;
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

    // ✅ ADICIONAR: Getters e Setters para Curso
    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    // ✅ ADICIONAR: Getters e Setters para Data Início
    public Date getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(Date dataInicio) {
        this.dataInicio = dataInicio;
    }

    // ✅ ADICIONAR: Getters e Setters para Data Fim
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
}
```

## 🔧 Atualização do TurmaService

O `TurmaService` já está preparado para receber esses campos. Apenas certifique-se de que o método `editarTurma` atualiza todos os campos:

```java
public Turma editarTurma(Long id, Turma dadosTurma) {
    Optional<Turma> turmaExistente = turmaRepository.findById(id);
    if (turmaExistente.isPresent()) {
        Turma turma = turmaExistente.get();
        turma.setTurno(dadosTurma.getTurno());
        
        // ✅ Atualizar curso
        if (dadosTurma.getCurso() != null) {
            turma.setCurso(dadosTurma.getCurso());
        }
        
        // ✅ Atualizar datas
        if (dadosTurma.getDataInicio() != null) {
            turma.setDataInicio(dadosTurma.getDataInicio());
        }
        
        if (dadosTurma.getDataFim() != null) {
            turma.setDataFim(dadosTurma.getDataFim());
        }
        
        return turmaRepository.save(turma);
    } else {
        throw new RuntimeException("Turma não encontrada para atualização");
    }
}
```

## 📊 Atualização do Banco de Dados

O Hibernate vai criar automaticamente as colunas se você usar `ddl-auto: update`. Caso contrário, execute:

```sql
ALTER TABLE turma 
ADD COLUMN id_curso BIGINT,
ADD COLUMN data_inicio DATE,
ADD COLUMN data_fim DATE,
ADD FOREIGN KEY (id_curso) REFERENCES curso(id);
```

## ✅ Após as Atualizações

1. Atualize a entidade `Turma` com os novos campos
2. Reinicie o backend
3. O frontend já está preparado para enviar e receber esses dados
4. As informações aparecerão automaticamente na lista de turmas

