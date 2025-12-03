# Solução para Erro 500 ao Listar Turmas

## 🚨 Problemas Identificados

### Problema 1: Campo `bolsista` com tipo primitivo
O erro atual é:
```
Could not write JSON: Null value was assigned to a property [class com.br.model.Aluno.bolsista] 
of primitive type: 'com.br.model.Aluno.bolsista' (setter)
```

**Causa:** O campo `bolsista` na entidade `Aluno` está declarado como `boolean` (tipo primitivo), mas o banco de dados está retornando `null`. Tipos primitivos em Java não podem ser `null`.

### Problema 2: Referência Circular (pode ocorrer depois)
- `Turma` tem `List<Aluno> alunos`
- `Aluno` tem `Turma turma`
- Isso cria um loop infinito: `Turma → Aluno → Turma → Aluno → ...`

## ✅ Soluções no Backend

### 🔴 PRIORIDADE 1: Corrigir campos primitivos na entidade `Aluno`

Na entidade `Aluno`, mude **TODOS** os tipos primitivos para classes wrapper:

**ANTES (ERRADO):**
```java
@Column(name = "bolsista")
private boolean bolsista;  // ❌ Tipo primitivo não pode ser null

@Column(name = "mensalidade")
private double mensalidade;  // ❌ Tipo primitivo não pode ser null

@Column(name = "semestre")
private int semestre;  // ❌ Tipo primitivo não pode ser null
```

**DEPOIS (CORRETO):**
```java
@Column(name = "bolsista")
private Boolean bolsista;  // ✅ Classe wrapper pode ser null

@Column(name = "mensalidade")
private Double mensalidade;  // ✅ Classe wrapper pode ser null

@Column(name = "semestre")
private Integer semestre;  // ✅ Classe wrapper pode ser null
```

**OU** garanta que os campos nunca sejam `null` no banco de dados (defina valores padrão ou use `NOT NULL`).

### Opção 1: Usar `@JsonIgnore` (Para referência circular)

Adicione `@JsonIgnore` na propriedade `alunos` da entidade `Turma`:

```java
package com.br.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "turno")
    private String turno;

    @OneToMany(mappedBy = "turma")
    @JsonIgnore  // ← ADICIONE ESTA ANOTAÇÃO
    private List<Aluno> alunos;

    // ... resto do código
}
```

### Opção 2: Usar `@JsonManagedReference` e `@JsonBackReference`

**Na entidade Turma:**
```java
import com.fasterxml.jackson.annotation.JsonManagedReference;

@OneToMany(mappedBy = "turma")
@JsonManagedReference
private List<Aluno> alunos;
```

**Na entidade Aluno:**
```java
import com.fasterxml.jackson.annotation.JsonBackReference;

@ManyToOne
@JoinColumn(name = "turma_id")
@JsonBackReference
private Turma turma;
```

### Opção 3: Criar um DTO (Data Transfer Object)

Crie uma classe `TurmaDTO` sem a lista de alunos:

```java
package com.br.dto;

public class TurmaDTO {
    private Long id;
    private String turno;
    
    // Construtores, getters e setters
}
```

E no Controller, retorne o DTO:

```java
@GetMapping
public ResponseEntity<List<TurmaDTO>> listarTurmas() {
    List<Turma> turmas = turmaService.listarTurmas();
    List<TurmaDTO> turmasDTO = turmas.stream()
        .map(t -> new TurmaDTO(t.getId(), t.getTurno()))
        .collect(Collectors.toList());
    return ResponseEntity.ok(turmasDTO);
}
```

## 📋 Dependência Necessária

Certifique-se de ter a dependência do Jackson no `pom.xml`:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-annotations</artifactId>
</dependency>
```

## 🎯 Solução Completa (Recomendada)

### Passo 1: Corrigir TODOS os campos primitivos na entidade `Aluno`

```java
package com.br.model;

@Entity
@Table(name = "aluno")
public class Aluno {
    // ... outros campos ...
    
    // ❌ ERRADO (tipos primitivos não podem ser null)
    // private boolean bolsista;
    // private double mensalidade;
    // private int semestre;
    
    // ✅ CORRETO (classes wrapper podem ser null)
    @Column(name = "bolsista")
    private Boolean bolsista;
    
    @Column(name = "mensalidade")
    private Double mensalidade;
    
    @Column(name = "semestre")
    private Integer semestre;
    
    // ... resto do código ...
}
```

**Mapeamento de tipos:**
- `boolean` → `Boolean`
- `double` → `Double`
- `int` → `Integer`
- `long` → `Long`
- `float` → `Float`
- `short` → `Short`
- `byte` → `Byte`
- `char` → `Character`

### Passo 2: Adicionar `@JsonIgnore` na entidade `Turma`

```java
@OneToMany(mappedBy = "turma")
@JsonIgnore
private List<Aluno> alunos;
```

## 📋 Dependência Necessária

Certifique-se de ter a dependência do Jackson no `pom.xml`:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-annotations</artifactId>
</dependency>
```

## ✅ Após as Correções

1. Mude `boolean bolsista` para `Boolean bolsista` na entidade `Aluno`
2. Adicione `@JsonIgnore` na propriedade `alunos` da entidade `Turma`
3. Reinicie o backend
4. Teste novamente

