# Solução: Erro "Curso não encontrado" ao Salvar Turma

## 🔴 Problema

Ao tentar salvar uma turma, o erro ocorre:
```
Curso não encontrado: Excel Avançado
```

## 🔍 Causa

O backend está tentando buscar o curso "Excel Avançado" no banco de dados, mas não está encontrando. Isso pode acontecer por:

1. **O curso não existe no banco de dados** - O curso precisa ser cadastrado primeiro
2. **Diferença no nome** - O nome no banco pode ser diferente (espaços, maiúsculas/minúsculas, acentos)
3. **Busca case-sensitive** - A busca está sendo feita de forma exata (case-sensitive)

## ✅ Solução

### Passo 1: Verificar se o curso existe no banco

Execute esta query no banco de dados para verificar os cursos cadastrados:

```sql
SELECT id, nome FROM curso;
```

### Passo 2: Atualizar o TurmaService

Substitua seu `TurmaService` pelo código do arquivo **`TurmaService_CORRIGIDO_V2.java`**.

**Melhorias implementadas:**
- ✅ Busca case-insensitive (ignora maiúsculas/minúsculas)
- ✅ Remove espaços extras (trim)
- ✅ Tenta busca exata primeiro, depois case-insensitive
- ✅ **Lista todos os cursos disponíveis** se não encontrar (para ajudar no debug)

### Passo 3: Atualizar o CursoRepository (Opcional)

Adicione o método `findByNomeIgnoreCase` no seu `CursoRepository`:

```java
@Query("SELECT c FROM Curso c WHERE LOWER(TRIM(c.nome)) = LOWER(TRIM(:nome))")
Optional<Curso> findByNomeIgnoreCase(@Param("nome") String nome);
```

Veja o arquivo **`CursoRepository_MELHORADO.java`** para o código completo.

## 📋 Checklist

- [ ] Verificar se o curso "Excel Avançado" existe no banco de dados
- [ ] Se não existir, cadastrar o curso primeiro
- [ ] Atualizar `TurmaService` com o código de `TurmaService_CORRIGIDO_V2.java`
- [ ] Reiniciar o backend
- [ ] Tentar salvar a turma novamente

## 🎯 Resultado Esperado

Após aplicar as correções:
1. O backend buscará o curso de forma mais flexível (case-insensitive)
2. Se não encontrar, mostrará uma mensagem com **todos os cursos disponíveis** no banco
3. A turma será salva corretamente com o curso associado
4. O nome do curso aparecerá na lista de turmas

## 💡 Dica

Se o erro persistir, verifique a mensagem de erro completa. O novo código lista todos os cursos disponíveis no banco, facilitando a identificação do problema.

