# Aluno Lista Component

Este componente foi criado baseado no `automovel-lista` e adaptado para gerenciar a listagem de alunos com funcionalidades avançadas.

## 📋 Funcionalidades

- **Listagem de alunos** - Exibe todos os alunos em uma tabela responsiva
- **Filtros avançados** - Filtros por nome, curso, semestre e status de bolsista
- **Estatísticas** - Cards com informações resumidas sobre os alunos
- **Ações CRUD** - Botões para editar e excluir alunos
- **Interface responsiva** - Layout adaptável para diferentes dispositivos

## 🏗️ Estrutura dos Arquivos

```
src/app/view/aluno-lista/
├── aluno-lista.component.html    # Template da lista
├── aluno-lista.component.ts      # Lógica do componente
├── aluno-lista.component.css     # Estilos específicos
├── aluno-lista.component.spec.ts # Testes unitários
└── README.md                     # Esta documentação
```

## 🎯 Funcionalidades Principais

### 📊 **Tabela de Alunos**
- Exibe informações completas de cada aluno
- Colunas: Código, Nome, Curso, Data de Matrícula, Mensalidade, Semestre, Bolsista, Ações
- Badges coloridos para semestre e status de bolsista
- Formatação de moeda para mensalidades
- Formatação de data para matrícula

### 🔍 **Sistema de Filtros**
- **Filtro por Nome**: Busca parcial (case-insensitive)
- **Filtro por Curso**: Dropdown com cursos únicos
- **Filtro por Semestre**: Dropdown com semestres 1-10
- **Filtro por Bolsista**: Todos, Bolsistas, Não Bolsistas
- **Botão Limpar**: Remove todos os filtros aplicados

### 📈 **Cards de Estatísticas**
- **Total de Alunos**: Contagem geral
- **Bolsistas**: Quantidade de alunos bolsistas
- **Cursos Diferentes**: Número de cursos únicos
- **Mensalidade Média**: Valor médio das mensalidades

### ⚡ **Ações Disponíveis**
- **Incluir Novo Aluno**: Navega para formulário de criação
- **Editar Aluno**: Navega para formulário de edição
- **Excluir Aluno**: Remove aluno com confirmação

## 🎨 Design e UX

### **Visual**
- Tabela com hover effects
- Badges coloridos para melhor identificação
- Cards de estatísticas com cores temáticas
- Botões com ícones para melhor usabilidade

### **Responsividade**
- Layout adaptável para mobile, tablet e desktop
- Tabela com scroll horizontal em telas pequenas
- Botões empilhados verticalmente em mobile
- Filtros reorganizados para telas pequenas

### **Acessibilidade**
- Títulos descritivos nos botões
- Contraste adequado nas cores
- Navegação por teclado
- Feedback visual para interações

## 🔧 Métodos Utilitários

### **Filtros**
- `aplicarFiltros()`: Aplica todos os filtros ativos
- `limparFiltros()`: Remove todos os filtros
- `extrairCursos()`: Extrai cursos únicos para dropdown

### **Navegação**
- `novo()`: Navega para criação de aluno
- `editar(id)`: Navega para edição de aluno
- `excluir(id)`: Remove aluno com confirmação

### **Cálculos**
- `getStatusAluno(semestre)`: Retorna status baseado no semestre
- `isAlunoAtivo(dataMatricula)`: Verifica se aluno está ativo
- `calcularMensalidadeComDesconto()`: Calcula desconto para bolsistas

## 📱 Responsividade

### **Desktop (> 768px)**
- Layout em grid com filtros na mesma linha
- Tabela completa com todas as colunas
- Botões de ação lado a lado

### **Tablet (768px - 576px)**
- Filtros reorganizados em grid
- Tabela com scroll horizontal se necessário
- Botões de ação empilhados

### **Mobile (< 576px)**
- Layout em coluna única
- Filtros empilhados verticalmente
- Tabela compacta com fonte menor
- Botões de ação em largura total

## 🧪 Testes

O componente inclui testes unitários abrangentes:

- ✅ Carregamento de dados
- ✅ Tratamento de erros
- ✅ Sistema de filtros
- ✅ Navegação entre telas
- ✅ Operações de exclusão
- ✅ Cálculos de estatísticas
- ✅ Métodos utilitários

## 🚀 Como Usar

### 1. Importar o Componente
```typescript
import { AlunoListaComponent } from './view/aluno-lista/aluno-lista.component';
```

### 2. Adicionar às Rotas
```typescript
const routes: Routes = [
  { path: 'alunos', component: AlunoListaComponent }
];
```

### 3. Usar no Template
```html
<app-aluno-lista></app-aluno-lista>
```

## 🔄 Fluxo de Funcionamento

1. **Inicialização**: Carrega lista de alunos do serviço
2. **Exibição**: Mostra dados em tabela com filtros
3. **Filtros**: Aplica filtros em tempo real
4. **Ações**: Permite editar/excluir alunos
5. **Navegação**: Redireciona para formulários

## 🛠️ Dependências

- **Angular Common** - Para diretivas estruturais
- **Angular Forms** - Para filtros com ngModel
- **Angular Router** - Para navegação
- **Bootstrap** - Para estilos e layout
- **AlunoService** - Para operações de CRUD

## 📊 Estatísticas Calculadas

### **Alunos Bolsistas**
```typescript
get alunosBolsistas(): number {
  return this.alunos.filter(a => a.bolsista).length;
}
```

### **Cursos Únicos**
```typescript
get cursosUnicos(): number {
  const cursosUnicos = new Set(this.alunos.map(a => a.curso));
  return cursosUnicos.size;
}
```

### **Mensalidade Média**
```typescript
get mensalidadeMedia(): number {
  if (this.alunos.length === 0) return 0;
  const total = this.alunos.reduce((sum, a) => sum + a.mensalidade, 0);
  return total / this.alunos.length;
}
```

## 🔮 Próximas Melhorias Sugeridas

1. **Paginação** para listas grandes
2. **Ordenação** por colunas
3. **Exportação** para Excel/PDF
4. **Busca avançada** com múltiplos critérios
5. **Gráficos** para visualização de dados
6. **Filtros salvos** para reutilização
7. **Ações em lote** para múltiplos alunos
8. **Histórico de alterações** por aluno
