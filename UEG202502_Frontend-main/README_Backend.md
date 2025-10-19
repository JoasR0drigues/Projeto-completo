# Sistema de Gerenciamento de Alunos - Backend

Este projeto contém o backend para um sistema de gerenciamento de alunos desenvolvido em Spring Boot.

## 🚀 Melhorias Implementadas

### 1. **Entidade Aluno (`Aluno.java`)**
- ✅ **Validações Bean Validation**: Anotações para validação de dados
- ✅ **Uso de LocalDate**: Substituição de `java.sql.Date` por `LocalDate` (mais moderno)
- ✅ **BigDecimal para valores monetários**: Precisão adequada para mensalidades
- ✅ **Métodos utilitários**: `calcularMensalidadeComDesconto()`, `isAtivo()`, `getStatus()`
- ✅ **Implementação de equals/hashCode/toString**: Para melhor funcionamento com coleções
- ✅ **Documentação JavaDoc**: Documentação completa dos métodos

### 2. **DTO (`AlunoDTO.java`)**
- ✅ **Separação de responsabilidades**: DTO para transferência de dados
- ✅ **Validações**: Mesmas validações da entidade para consistência

### 3. **Repository (`AlunoRepository.java`)**
- ✅ **Queries personalizadas**: Métodos específicos para diferentes buscas
- ✅ **Uso de Optional**: Evita NullPointerException
- ✅ **Queries nativas e JPQL**: Flexibilidade para consultas complexas

### 4. **Service (`AlunoService.java`)**
- ✅ **Lógica de negócio**: Validações específicas do domínio
- ✅ **Transações**: Controle adequado de transações
- ✅ **Tratamento de exceções**: Mensagens de erro claras
- ✅ **Métodos utilitários**: Operações específicas como desconto para bolsistas

### 5. **Controller (`AlunoController.java`)**
- ✅ **RESTful API**: Endpoints seguindo padrões REST
- ✅ **Tratamento de erros HTTP**: Códigos de status apropriados
- ✅ **Validação de entrada**: Uso de `@Valid` para validação automática

## 📋 Dependências Necessárias

Adicione as seguintes dependências no seu `pom.xml`:

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- MySQL Connector -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Spring Boot DevTools (opcional) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

## 🗄️ Configuração do Banco de Dados

1. **Crie o banco de dados MySQL:**
```sql
CREATE DATABASE sistema_alunos;
```

2. **Configure as credenciais** no arquivo `application.yml`

3. **A tabela será criada automaticamente** pelo Hibernate

## 🚀 Como Executar

1. **Clone o repositório**
2. **Configure o banco de dados** no `application.yml`
3. **Execute o comando:**
```bash
mvn spring-boot:run
```

4. **Acesse a API** em: `http://localhost:8080/api`

## 📚 Endpoints da API

### Alunos
- `GET /api/alunos` - Lista todos os alunos
- `GET /api/alunos/{codigo}` - Busca aluno por código
- `POST /api/alunos` - Cria novo aluno
- `PUT /api/alunos/{codigo}` - Atualiza aluno
- `DELETE /api/alunos/{codigo}` - Remove aluno

### Buscas Específicas
- `GET /api/alunos/buscar?nome={nome}` - Busca por nome
- `GET /api/alunos/curso/{curso}` - Busca por curso
- `GET /api/alunos/bolsistas` - Lista bolsistas

### Operações de Negócio
- `POST /api/alunos/aplicar-desconto-bolsistas?percentualDesconto={valor}` - Aplica desconto

## 📝 Exemplo de Uso

### Criar um aluno:
```json
POST /api/alunos
{
    "nome": "João Silva",
    "curso": "Ciência da Computação",
    "dataMatricula": "2024-01-15",
    "mensalidade": 1200.00,
    "bolsista": true,
    "semestre": 3
}
```

### Buscar alunos por nome:
```
GET /api/alunos/buscar?nome=João
```

## 🔧 Validações Implementadas

- **Nome**: Obrigatório, 2-100 caracteres
- **Curso**: Obrigatório, 2-50 caracteres
- **Data de Matrícula**: Obrigatória, não pode ser futura
- **Mensalidade**: Obrigatória, deve ser maior que zero
- **Semestre**: Obrigatório, deve ser maior que zero

## 🎯 Benefícios das Melhorias

1. **Segurança**: Validações impedem dados inválidos
2. **Manutenibilidade**: Código bem estruturado e documentado
3. **Performance**: Uso de Optional e queries otimizadas
4. **Flexibilidade**: DTOs permitem diferentes representações
5. **Robustez**: Tratamento adequado de exceções
6. **Padrões**: Seguindo melhores práticas do Spring Boot

## 🔍 Próximos Passos Sugeridos

1. **Implementar testes unitários** com JUnit 5
2. **Adicionar testes de integração** com TestContainers
3. **Implementar paginação** nas consultas
4. **Adicionar cache** com Redis
5. **Implementar auditoria** com Spring Data JPA Auditing
6. **Adicionar documentação** com Swagger/OpenAPI
7. **Implementar autenticação** com Spring Security
