Projeto Full-Stack: Upload de Arquivos + Sistema de Login
Este é um projeto full-stack que combina upload de arquivos com autenticação de usuários. O backend em Node.js/Express gerencia uploads e autenticação, enquanto o frontend oferece uma interface moderna usando Tailwind CSS.

Tecnologias Utilizadas

Backend:
Node.js
Express.js
Multer (upload de arquivos)
JWT (autenticação)
bcryptjs (hash de senhas)
CORS

Frontend:
HTML5
Tailwind CSS
JavaScript (ES6+)
Fetch API
FormData

Funcionalidades Implementadas
Sistema de Autenticação
Registro de Usuários: Endpoint POST /register para criar novas contas.

Login: Endpoint POST /login com autenticação JWT.

Segurança: Senhas hasheadas com bcrypt.

Token JWT: Gerado após login bem-sucedido.

Controle de UI: O frontend exibe/oculta os formulários de Login/Registro e o painel de Logout com base no estado de autenticação (presença do token).

Função de Logout: Permite ao usuário remover o token do localStorage e atualizar a UI.

Upload de Arquivos
Rota Protegida: A rota /upload agora é protegida por middleware JWT. Apenas requisições com um token de autenticação válido (Authorization: Bearer <token>) podem enviar arquivos.

Múltiplos Uploads: Até 10 arquivos por requisição.

Validação: Apenas imagens .jpeg/.png e máximo 5MB por arquivo.

Armazenamento Seguro: Diretório uploads/ com nomes únicos e criação automática de diretórios.

Frontend
Interface Moderna: Login/Registro com feedback visual e painel de usuário com botão de "Sair".

Comunicação Assíncrona: Login com JWT e Upload via FormData (enviando o token no cabeçalho Authorization).

Feedback em Tempo Real: Mensagens de sucesso/erro, incluindo feedback de autorização (ex: "Acesso negado") se o upload for tentado sem login.

Autenticação Persistente: Token JWT armazenado no localStorage.

Tratamento de Erros
Mensagens claras para usuários: Exibe mensagens de erro vindas do servidor (ex: "Credenciais inválidas", "Token inválido ou expirado").

Códigos HTTP apropriados: O backend retorna códigos como 401 (Não autorizado) ou 403 (Proibido) em falhas de autenticação.

Validação no cliente: Verifica se arquivos foram selecionados antes do envio.

Validação no servidor: O backend rejeita ativamente tentativas de upload não autenticadas.

Este projeto demonstra uma implementação completa de autenticação e upload de arquivos, com foco em segurança e experiência do usuário.