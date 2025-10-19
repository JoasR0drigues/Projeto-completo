# Aluno Form Component

Este componente foi criado baseado no `automovel-form` e adaptado para gerenciar dados de alunos.

## 📋 Funcionalidades

- **Criação de novos alunos** - Formulário para cadastrar alunos
- **Edição de alunos existentes** - Formulário para atualizar dados de alunos
- **Validação de campos** - Validações em tempo real com mensagens de erro
- **Interface responsiva** - Layout adaptável para diferentes tamanhos de tela

## 🏗️ Estrutura dos Arquivos

```
src/app/view/aluno-form/
├── aluno-form.component.html    # Template do formulário
├── aluno-form.component.ts      # Lógica do componente
├── aluno-form.component.css     # Estilos específicos
├── aluno-form.component.spec.ts # Testes unitários
└── README.md                    # Esta documentação
```

## 📝 Campos do Formulário

| Campo | Tipo | Validações | Descrição |
|-------|------|------------|-----------|
| **Código** | number | - | Código único do aluno (gerado automaticamente) |
| **Nome** | string | Obrigatório, 2-100 caracteres | Nome completo do aluno |
| **Curso** | string | Obrigatório, 2-50 caracteres | Curso que o aluno está matriculado |
| **Data de Matrícula** | date | Obrigatório | Data em que o aluno se matriculou |
| **Mensalidade** | number | Obrigatório, > 0 | Valor da mensalidade |
| **Semestre** | number | Obrigatório, 1-10 | Semestre atual do aluno |
| **Bolsista** | boolean | - | Se o aluno é bolsista |

## 🔧 Validações Implementadas

### Validações de Entrada
- **Nome**: Obrigatório, mínimo 2 caracteres, máximo 100 caracteres
- **Curso**: Obrigatório, mínimo 2 caracteres, máximo 50 caracteres
- **Data de Matrícula**: Obrigatória
- **Mensalidade**: Obrigatória, deve ser maior que R$ 0,01
- **Semestre**: Obrigatório, deve estar entre 1 e 10

### Validações Visuais
- Campos obrigatórios são destacados quando vazios
- Mensagens de erro aparecem em tempo real
- Botão de salvar fica desabilitado quando o formulário é inválido
- Indicador de carregamento durante o salvamento

## 🎨 Estilos e UX

### Melhorias Visuais
- **Feedback visual** para campos com erro (borda vermelha)
- **Spinner de carregamento** durante operações
- **Layout responsivo** que se adapta a diferentes telas
- **Cores consistentes** com o tema da aplicação

### Responsividade
- Em telas pequenas (< 768px):
  - Campos empilhados verticalmente
  - Botões ocupam toda a largura
  - Melhor espaçamento entre elementos

## 🧪 Testes

O componente inclui testes unitários abrangentes que cobrem:

- ✅ Inicialização do formulário
- ✅ Carregamento de dados para edição
- ✅ Validações de campos obrigatórios
- ✅ Operações de criação e edição
- ✅ Tratamento de erros
- ✅ Navegação entre telas

## 🚀 Como Usar

### 1. Importar o Componente
```typescript
import { AlunoFormComponent } from './view/aluno-form/aluno-form.component';
```

### 2. Adicionar às Rotas
```typescript
const routes: Routes = [
  { path: 'alunos/novo', component: AlunoFormComponent },
  { path: 'alunos/editar/:id', component: AlunoFormComponent }
];
```

### 3. Usar no Template
```html
<app-aluno-form></app-aluno-form>
```

## 🔄 Fluxo de Funcionamento

1. **Inicialização**: Formulário é criado com valores padrão
2. **Edição**: Se há ID na rota, carrega dados do aluno
3. **Validação**: Campos são validados em tempo real
4. **Salvamento**: Dados são enviados para o serviço
5. **Navegação**: Usuário é redirecionado para lista de alunos

## 🛠️ Dependências

- **Angular Reactive Forms** - Para gerenciamento de formulários
- **Angular Router** - Para navegação entre telas
- **Bootstrap** - Para estilos e layout responsivo
- **AlunoService** - Para operações de CRUD

## 📱 Compatibilidade

- ✅ Angular 15+
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móveis e tablets
- ✅ Acessibilidade (ARIA labels, navegação por teclado)

## 🔮 Próximas Melhorias Sugeridas

1. **Autocomplete** para campo de curso
2. **Máscaras de entrada** para formatação de dados
3. **Upload de foto** do aluno
4. **Validação de CPF** se necessário
5. **Histórico de alterações** do aluno
6. **Integração com calendário** para data de matrícula
