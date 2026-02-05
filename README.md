# 🛡️ Projeto Full-Stack: Upload Seguro, RBAC e Modularização

Este é um projeto full-stack robusto que combina gerenciamento de arquivos com um sistema avançado de autenticação e controle de acesso. O backend em **Node.js/Express** foi refatorado para uma arquitetura modular, implementando **Controle de Acesso Baseado em Função (RBAC)**, enquanto o frontend recebeu uma atualização visual moderna com estilo **Glassmorphism**.

---

## 🚀 Tecnologias Utilizadas

### Backend (Server-side)
- **Node.js & Express.js**: Servidor e roteamento modular (`express.Router`).
- **Multer**: Middleware para gerenciamento de upload (`multipart/form-data`).
- **JWT (JSON Web Token)**: Autenticação segura com payload personalizado (incluindo roles).
- **Bcryptjs**: Hashing seguro de senhas.
- **FS (File System) & Path**: Módulos nativos para manipulação e remoção segura de arquivos.
- **CORS**: Controle de acesso HTTP.

### Frontend (Client-side)
- **HTML5 & CSS3**: Estrutura semântica e animações.
- **Tailwind CSS**: Estilização utilitária e responsiva.
- **JavaScript (ES6+)**: Lógica do cliente, Fetch API e manipulação do DOM.
- **Glassmorphism**: Estética visual moderna com transparência e desfoque.

---

## ⚙️ Funcionalidades e Arquitetura

### 🏗️ Arquitetura e Modularização
- **Organização de Código:** Backend separado em rotas (`routes/auth.js`, `routes/file.js`) e middlewares (`middlewares/authMiddleware.js`), garantindo código limpo e escalável.
- **Middlewares Reutilizáveis:** Lógica de verificação de token e verificação de administrador isolada para fácil reutilização em diferentes rotas.

### 🔐 Sistema de Autenticação e RBAC
- **Endpoints Modulares:**
  - `POST /auth/register`: Criação de contas (Padrão: role 'user').
  - `POST /auth/login`: Autenticação que retorna JWT contendo ID e Role do usuário.
- **Controle de Acesso (RBAC):**
  - **User:** Acesso padrão às funcionalidades básicas.
  - **Admin:** Permissões elevadas para ações críticas.
- **Persistência de Sessão:** O Frontend gerencia o armazenamento do token e do papel do usuário para controle da interface (UI).

### 📂 Gerenciamento de Arquivos
- **Upload Protegido:** Rota `POST /file/upload` protegida por JWT. Suporte a múltiplos arquivos (.png/.jpg, máx 5MB).
- **Deleção Administrativa:** Nova rota `DELETE /file/delete/:filename`.
  - **Segurança Dupla:** Requer Token válido **E** Role de 'admin'.
  - **Segurança de Path:** Uso de `path.join` para prevenir ataques de *Directory Traversal*.

### 🎨 Frontend Moderno (Glassmorphism)
- **Interface Visual:** Design com efeitos de vidro (blur/transparência) sobre fundo gradiente.
- **Feedback Visual de Role:** Badges (insígnias) indicam visualmente se o usuário é "User" ou "Admin".
- **UX Aprimorada:** Feedback em tempo real para uploads, logins e erros com animações suaves.
- **Comunicação Atualizada:** Fetch API consumindo a nova estrutura de rotas (`/auth` e `/file`).

---

## 🛡️ Segurança e Tratamento de Erros

- **Respostas HTTP Semânticas:**
  - `401 Unauthorized`: Não autorizado.
  - `403 Forbidden`: Proibido (Requer Admin).
  - `404 Not Found`: Recurso não encontrado.
  - `500 Internal Server Error`: Erro no servidor.
- **Validação em Camadas:**
  - **Frontend:** Validação de seleção de arquivos.
  - **Backend:** Validação de tipo MIME, tamanho, autenticação e autorização.

---

## 🔧 Como Rodar o Projeto

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/seu-usuario/seu-projeto.git](https://github.com/seu-usuario/seu-projeto.git)

Instale as dependências do Backend

Bash
- cd backend
- npm install
- Inicie o Servidor

Bash
- npm start
- Acesse o Frontend Abra o arquivo index.html (ou o arquivo principal do frontend) diretamente no navegador ou utilize uma extensão como Live Server.

## 👨‍💻 Autor
Desenvolvido com foco em segurança e arquitetura limpa.

