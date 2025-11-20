Projeto Full-Stack: Upload Seguro, RBAC e Modularização

Este é um projeto full-stack robusto que combina gerenciamento de arquivos com um sistema de autenticação e controle de acesso avançado. O backend em Node.js/Express foi refatorado para uma arquitetura modular, implementando controle de acesso baseado em função (RBAC), enquanto o frontend recebeu uma atualização visual moderna com estilo Glassmorphism.


Tecnologias Utilizadas

Backend:
Node.js & Express.js: Servidor e roteamento modular (express.Router).
Multer: Middleware para gerenciamento de upload (multipart/form-data).
JWT (JSON Web Token): Autenticação segura com payload personalizado (incluindo roles).
Bcryptjs: Hashing seguro de senhas.
FS (File System) & Path: Módulos nativos para manipulação e remoção segura de arquivos.
CORS: Controle de acesso HTTP.

Frontend:
HTML5 & CSS3: Estrutura semântica e animações.
Tailwind CSS: Estilização utilitária e responsiva.
JavaScript (ES6+): Lógica do cliente, Fetch API e manipulação do DOM.
Glassmorphism: Estética visual moderna com transparência e desfoque.
Funcionalidades Implementadas

1. Arquitetura e Modularização
Organização de Código: O backend foi separado em rotas (routes/auth.js, routes/file.js) e middlewares (middlewares/authMiddleware.js), garantindo um código limpo e escalável.
Middlewares Reutilizáveis: Lógica de verificação de token e verificação de administrador isolada para fácil reutilização.

3. Sistema de Autenticação e RBAC
Endpoints Modulares:
POST /auth/register: Criação de contas (padrão: role 'user').
POST /auth/login: Autenticação que retorna JWT contendo ID e Role do usuário.
Controle de Acesso Baseado em Função (RBAC):
Usuários comuns (user) têm acesso padrão.
Administradores (admin) possuem permissões elevadas.
Persistência: O Frontend armazena o token e o papel do usuário para controle de UI.

3. Gerenciamento de Arquivos
Upload Protegido: Rota POST /file/upload protegida por JWT. Permite envio de múltiplos arquivos (imagens .png/.jpg, máx 5MB).
Deleção Administrativa: Nova rota DELETE /file/delete/:filename.
Segurança Dupla: Requer Token válido E Role de 'admin'.
Segurança de Path: Uso de path.join para prevenir ataques de Directory Traversal ao deletar arquivos.

4. Frontend Moderno (Glassmorphism)
Interface Visual: Design atualizado com efeitos de vidro (blur/transparência) sobre um fundo gradiente.
Feedback Visual de Role: Badges (insígnias) que indicam visualmente se o usuário logado é "User" ou "Admin".
UX Aprimorada: Feedback em tempo real para uploads, logins e erros, com animações suaves.
Comunicação Atualizada: Chamadas fetch apontando para a nova estrutura de rotas do backend (/auth e /file).
Tratamento de Erros e Segurança
Respostas HTTP Semânticas: Uso correto de 401 (Não Autorizado), 403 (Proibido/Requer Admin), 404 (Não Encontrado) e 500 (Erro Interno).

Validação em Camadas:
Frontend valida seleção de arquivos.
Backend valida tipo MIME, tamanho, autenticação e autorização (nível de acesso).
