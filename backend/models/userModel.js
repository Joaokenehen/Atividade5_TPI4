const users = [
  // Usuário Admin Hardcoded para testes
  // A senha abaixo representa o hash para "admin123" (exemplo gerado com bcrypt)
  {
    id: 999,
    username: "admin",
    email: "admin@teste.com",
    passwordHash: "$2a$10$YourGeneratedHashHere...", // Você precisaria de um hash real aqui para logar
    role: "admin"
  }
];

let currentId = 1;

const addUser = (user) => {
  const newUser = {
    id: currentId++,
    username: user.username,
    email: user.email,
    passwordHash: user.passwordHash, // Armazena apenas o hash
    role: 'user' // <--- ALTERAÇÃO: Define 'user' como padrão para novos registros
  };
  users.push(newUser);
  console.log('Usuário adicionado:', newUser);
  return newUser;
};

const findByUsername = (username) => {
  return users.find(u => u.username === username);
};

module.exports = {
  addUser,
  findByUsername
};