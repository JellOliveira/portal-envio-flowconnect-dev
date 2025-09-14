


# Portal de Envio via WhatsApp

Um portal moderno e intuitivo para automação de envios de campanhas via WhatsApp, integrado com N8N.



## Vídeo de Apresentação

Assista ao vídeo de apresentação do projeto para entender melhor suas funcionalidades:

[![Vídeo de Apresentação](https://img.youtube.com/vi/grqIA2tEsUM/0.jpg)](https://www.youtube.com/watch?v=grqIA2tEsUM)




## 🚀 Funcionalidades

### ✅ Implementado
- ✨ **Login/Logout** com autenticação segura
- 📱 **Design Responsivo** para desktop e mobile  
- 🎨 **Interface Moderna** com animações suaves
- 📊 **Dashboard** com dois formulários principais:
  - 📢 **Campanhas em Massa** - Envio para listas de contatos
  - ⏰ **Agendamento** - Mensagens programadas
- 👥 **Página de Contatos** com informações de suporte
- 📚 **Central de Ajuda** com guias passo a passo
- 💬 **WhatsApp Flutuante** para suporte rápido
- 👤 **Perfil do Usuário** com dropdown de opções

### 🎯 Características Técnicas
- 🔐 **Autenticação** com cookies HTTP-only
- 🎭 **Animações CSS** personalizadas
- 🎨 **Design System** com cores do WhatsApp
- 📱 **Menu Mobile** responsivo
- 🔄 **Estados de Loading** em todos os formulários
- ✅ **Validação de Formulários** 
- 🎊 **Toasts de Feedback** para ações do usuário




## 🛠️ Stack Tecnológica

### Frontend (Este Projeto)
- ⚛️ **React 18** com TypeScript
- 🎨 **Tailwind CSS** para styling
- 🧩 **Shadcn/ui** para componentes
- 🔄 **React Router** para navegação
- 📡 **TanStack Query** para gerenciamento de estado
- 🎭 **Framer Motion** (via Tailwind) para animações

### Backend (Existente)
- 🟢 **Node.js** com Express
- 🗄️ **Supabase** para autenticação e dados  
- 🤖 **N8N** para automação de workflows
- 🍪 **Cookies** para sessões seguras




## 📋 Como Usar

### 1. Login
- Acesse a aplicação e faça login com suas credenciais
- O sistema redirecionará automaticamente após o login

### 2. Enviando Campanhas
1. **Prepare sua planilha**:
   - Crie no Google Sheets com colunas: `nome` e `whatsapp`
   - Configure compartilhamento público
2. **Preencha o formulário**:
   - Nome da campanha
   - Link da planilha
   - Texto da mensagem (use `{nome}` para personalização)
   - Links opcionais e assinatura
3. **Envie** e acompanhe o status

### 3. Agendando Mensagens
1. **Configure o destino**:
   - Link do grupo ou número do WhatsApp
2. **Agende**:
   - Data e hora do envio
   - Texto da mensagem
   - Links de aula/venda (opcional)
   - Dados de reunião (opcional)

### 4. Suporte
- Use o **WhatsApp flutuante** para contato rápido
- Acesse **Contatos** para informações completas
- Consulte **Ajuda** para guias detalhados




## 🎨 Design

O portal utiliza uma paleta de cores baseada no WhatsApp:
- **Verde Primary**: `hsl(134, 61%, 41%)` - Cor principal
- **Verde Accent**: `hsl(134, 48%, 85%)` - Destaques
- **Gradientes** suaves para elementos especiais
- **Sombras elegantes** para profundidade
- **Animações suaves** para melhor UX




## 📱 Responsividade

- **Desktop**: Layout em duas colunas
- **Tablet**: Formulários empilhados
- **Mobile**: Interface otimizada com menu hamburger
- **WhatsApp Float**: Posição otimizada para não interferir




## 🔒 Segurança

- ✅ **Autenticação** via Supabase
- ✅ **Cookies HTTP-only** para tokens
- ✅ **Rotas protegidas** com middleware
- ✅ **Validação** de formulários
- ✅ **CORS** configurado apropriadamente




## 🚀 Próximos Passos

Para continuar o desenvolvimento:

1. **Adicionar sua logo**:
   - Substitua o placeholder "WA" no Header
   - Adicione o arquivo da logo em `src/assets/`

2. **Vídeo tutorial**:
   - Grave o vídeo explicativo
   - Atualize o link na página de Ajuda

3. **Planilha modelo**:
   - Crie a planilha modelo no Google Sheets
   - Atualize o link na página de Ajuda

4. **Avatar personalizado**:
   - Adicione a funcionalidade de upload de avatar
   - Integre com Supabase Storage se necessário




## 📞 Contato

**Desenvolvedor(a)**: [SEU NOME]  
**WhatsApp**: [SEU WHATSAPP]  
**Email**: [SEU EMAIL]  
**LinkedIn**: [SEU LINKEDIN]  
**GitHub**: [SEU GITHUB]

---

💚 **Criado com amor para automação via WhatsApp**




## Como rodar o projeto localmente

```sh
# Clone o repositório
git clone <YOUR_GIT_URL>

# Navegue para o diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm i

# Inicie o servidor de desenvolvimento
npm run dev
```

