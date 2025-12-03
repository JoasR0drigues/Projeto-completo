# Correção: Turma com Cursos (N×N)

## ✅ Alterações Realizadas no Frontend

### 1. **Formulário de Turma** (`turma-form.component.ts`)
- ✅ Ajustado para enviar `cursos` como **lista** (array) ao invés de `curso` singular
- ✅ O payload agora envia: `cursos: [{ nome: "Nome do Curso" }]`

### 2. **Serviço de Turma** (`turma.service.ts`)
- ✅ Atualizado `processarTurma()` para processar `List<Curso> cursos` do backend
- ✅ Mantém compatibilidade com `curso` singular (caso o backend retorne assim)
- ✅ Processa todos os cursos da lista e mantém o primeiro como "curso principal"

### 3. **Modelo Turma** (`turma.ts`)
- ✅ Adicionado campo `cursos?: Curso[]` para suportar lista de cursos (N×N)
- ✅ Mantido campo `curso?: Curso` para compatibilidade

### 4. **Lista de Turmas** (`turma-lista.component.ts` e `.html`)
- ✅ Criado método `getCursosDaTurma()` para exibir todos os cursos da turma
- ✅ Exibe badges azuis para cada curso associado à turma

## 🔧 O que o Backend Precisa Fazer

### Opção 1: Backend já busca curso pelo nome (Recomendado)

Se o `TurmaService` no backend já busca o curso pelo nome e associa corretamente, não é necessário alterar nada. O frontend está enviando:

```json
{
  "turno": "Matutino",
  "cursos": [{"nome": "Desenvolvimento Web"}],
  "dataInicio": "2025-01-15",
  "dataFim": "2025-06-15"
}
```

### Opção 2: Backend precisa buscar curso pelo nome

Se o backend precisa buscar o curso pelo nome antes de associar, você pode atualizar o `TurmaService` assim:

```java
@Service
public class TurmaService {
    
    @Autowired
    private TurmaRepository turmaRepository;
    
    @Autowired
    private CursoRepository cursoRepository;
    
    public Turma salvarTurma(Turma turma) {
        // Se a turma tem cursos com apenas "nome", buscar os cursos completos
        if (turma.getCursos() != null && !turma.getCursos().isEmpty()) {
            List<Curso> cursosCompletos = new ArrayList<>();
            for (Curso cursoRecebido : turma.getCursos()) {
                if (cursoRecebido.getNome() != null && cursoRecebido.getId() == null) {
                    // Buscar curso pelo nome
                    Optional<Curso> cursoEncontrado = cursoRepository.findByNome(cursoRecebido.getNome());
                    if (cursoEncontrado.isPresent()) {
                        cursosCompletos.add(cursoEncontrado.get());
                    }
                } else if (cursoRecebido.getId() != null) {
                    // Se já tem ID, usar diretamente
                    cursosCompletos.add(cursoRecebido);
                }
            }
            turma.setCursos(cursosCompletos);
        }
        
        // Calcular data de término se necessário
        if (turma.getDataFim() == null) {
            turma.calcularDataTermino();
        }
        
        return turmaRepository.save(turma);
    }
    
    public Turma editarTurma(Long id, Turma dadosTurma) {
        Optional<Turma> turmaExistente = turmaRepository.findById(id);
        if (turmaExistente.isPresent()) {
            Turma turma = turmaExistente.get();
            turma.setTurno(dadosTurma.getTurno());
            
            // Processar cursos da mesma forma
            if (dadosTurma.getCursos() != null && !dadosTurma.getCursos().isEmpty()) {
                List<Curso> cursosCompletos = new ArrayList<>();
                for (Curso cursoRecebido : dadosTurma.getCursos()) {
                    if (cursoRecebido.getNome() != null && cursoRecebido.getId() == null) {
                        Optional<Curso> cursoEncontrado = cursoRepository.findByNome(cursoRecebido.getNome());
                        if (cursoEncontrado.isPresent()) {
                            cursosCompletos.add(cursoEncontrado.get());
                        }
                    } else if (cursoRecebido.getId() != null) {
                        cursosCompletos.add(cursoRecebido);
                    }
                }
                turma.setCursos(cursosCompletos);
            }
            
            turma.setDataInicio(dadosTurma.getDataInicio());
            turma.setDataFim(dadosTurma.getDataFim());
            
            if (turma.getDataFim() == null) {
                turma.calcularDataTermino();
            }
            
            return turmaRepository.save(turma);
        } else {
            throw new RuntimeException("Turma não encontrada para atualização");
        }
    }
}
```

### Adicionar método no CursoRepository

Se você usar a Opção 2, adicione este método no `CursoRepository`:

```java
public interface CursoRepository extends JpaRepository<Curso, Long> {
    Optional<Curso> findByNome(String nome);
}
```

## 📋 Resumo

✅ **Frontend corrigido** para enviar `cursos` como lista (N×N)
✅ **Frontend atualizado** para processar `List<Curso> cursos` do backend
✅ **Exibição na lista** mostra todos os cursos associados à turma

⚠️ **Backend**: Verifique se o `TurmaService` busca os cursos pelo nome ou se precisa ser atualizado conforme a Opção 2 acima.

