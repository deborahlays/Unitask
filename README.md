# 🎓 UniTask — Plataforma de Organização Acadêmica

O **UniTask** é uma plataforma SaaS completa de produtividade acadêmica desenvolvida para estudantes universitários gerenciarem tarefas, disciplinas, provas, trabalhos e prazos em um único lugar, com interface minimalista, responsiva, moderna e intuitiva.

---

## ✨ Funcionalidades Principais

1. **Dashboard Inteligente**:
   - Saudação personalizada de acordo com o horário do dia (*"Bom dia / Boa tarde / Boa noite"*).
   - Data atual formatada em português brasileiro (`DD/MM/AAAA`).
   - Cards de indicadores em tempo real: tarefas pendentes, tarefas concluídas, avaliações próximas (14 dias) e disciplinas ativas.
   - **Prioridades de hoje**: lista de atividades priorizadas dinamicamente pelo algoritmo inteligente.
   - Próximos prazos e gráfico de produtividade semanal (Recharts).
   - Progresso das tarefas por disciplina e botão de ação rápida para criação de tarefas.

2. **Gerenciamento de Tarefas (`/tarefas`)**:
   - Criação, edição, conclusão com confetes e exclusão com modal de confirmação.
   - Categorização por tipo: **Tarefa**, **Prova**, **Trabalho**, **Apresentação** e **Outro**.
   - Filtros dinâmicos: por status (todas, pendentes, em andamento, concluídas, atrasadas), prioridade (baixa, média, alta), disciplina e tipo de atividade.
   - Busca em tempo real por título ou descrição.
   - Ordenação inteligente por prazo mais próximo, prazo mais distante, maior prioridade e ordem alfabética.
   - Alternância entre visualização em **Lista** e visualização em **Cards / Grid**.

3. **Sistema Inteligente de Prioridades**:
   - Algoritmo transparente que calcula a pontuação de urgência baseado na proximidade do prazo, peso da prioridade (Alta/Média/Baixa), tipo de atividade (provas têm peso elevado) e atrasos.
   - Justificativa clara exibida em cada tarefa: *"Atrasada há X dias"*, *"Entrega hoje"*, *"Entrega amanhã"*, *"Prova em 3 dias"*, *"Alta prioridade"*.
   - Tarefas concluídas saem automaticamente do ranking de pendências.

4. **Calendário Acadêmico (`/calendario`)**:
   - Visualizações **Mensal** e **Semanal**.
   - Identificação visual dos tipos de evento e matérias.
   - Navegação entre meses/semanas e botão "Hoje" para retorno rápido.
   - Clique em qualquer dia para inspecionar os compromissos agendados e adicionar uma nova atividade diretamente naquela data.

5. **Gerenciamento de Disciplinas (`/disciplinas` e `/disciplinas/:id`)**:
   - Cadastro com nome, código, docente, paleta de cores personalizada, semestre e descrição/ementa.
   - Página de detalhes para cada disciplina (`/disciplinas/:id`) com cálculo de progresso real, estatísticas de tarefas concluídas/pendentes/atrasadas e listagem filtrável.
   - Estado vazio elegante quando uma matéria não possui tarefas cadastradas (evitando porcentagens enganosas).

6. **Estatísticas e Produtividade (`/estatisticas`)**:
   - Gráfico de barras com histórico de tarefas concluídas dia a dia nos últimos 14 dias.
   - Gráfico de pizza com a distribuição da carga de tarefas por disciplina (utilizando as cores das próprias matérias).
   - Gráfico de evolução da produtividade acumulada (Area Chart).
   - Gráfico de equilíbrio e distribuição de status (Concluídas, Pendentes, Atrasadas).
   - Atualização automática em tempo real.

7. **Central de Notificações**:
   - Alertas automáticos para tarefas atrasadas, prazos no dia, prazos no dia seguinte e provas se aproximando.
   - Contador visual de notificações não lidas no sino do cabeçalho.
   - Opção para marcar individualmente ou todas como lidas.

8. **Configurações e Personalização (`/configuracoes`)**:
   - Edição de nome, curso e universidade.
   - Alternador de tema: **Claro**, **Escuro** ou **Sistema**.
   - Definição do primeiro dia da semana no calendário (Segunda-feira ou Domingo).
   - Preferências de notificações e efeitos sonoros/confetes.
   - Recarregar dados de demonstração ou exportar backup em JSON.

9. **Autenticação e Persistência**:
   - Suporte nativo a **Supabase** (Auth + Banco de Dados PostgreSQL com políticas RLS por usuário).
   - **Fallback automático para Modo Local**: funciona 100% offline via LocalStorage sem precisar configurar backend externo.
   - **Conta de Demonstração em 1 clique**: carrega matérias e tarefas universitárias realistas com datas calculadas dinamicamente em relação a hoje para explorar todas as funcionalidades do sistema.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm**

### Passo a Passo

1. Abra o terminal na pasta do projeto:
   ```powershell
   cd C:\Users\Aluno\Documents\GitHub\Unitask
   ```

2. Instale as dependências (se ainda não tiver instalado):
   ```powershell
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```powershell
   npm run dev
   ```

4. Acesse no navegador o endereço exibido no terminal (geralmente `http://localhost:5173`).

---

## 🗄️ Configuração do Supabase (Opcional)

Se desejar conectar o UniTask a um projeto do **Supabase**:

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Acesse o **SQL Editor** do seu painel Supabase e execute o script contido em:
   ```
   supabase_schema.sql
   ```
   *(Este script cria as tabelas `profiles`, `disciplines`, `tasks`, `calendar_events` e as políticas de segurança Row Level Security — RLS).*
3. Crie um arquivo `.env` na raiz do projeto (`C:\Users\Aluno\Documents\GitHub\Unitask\.env`) com suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```
4. Reinicie o servidor com `npm run dev`.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** com **TypeScript**
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React Router DOM 7**
- **Lucide React** (Ícones modernos e consistentes)
- **Recharts** (Gráficos interativos)
- **Canvas-Confetti** (Feedback visual de celebração)
- **Supabase JS** (Cliente de autenticação e banco com RLS)
