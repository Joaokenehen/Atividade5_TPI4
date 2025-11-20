const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware para verificar se o token é válido
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.status(401).json({ error: "Acesso negado. Token não fornecido." }); 
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log("Erro na verificação do JWT:", err);
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }
    
    req.user = user;
    // Mapeia userId e userRole para facilitar acesso
    req.userId = user.userId;
    req.userRole = user.userRole;
    
    next();
  });
};

// Middleware para verificar se o usuário é admin
const verificarAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      error: "Acesso negado. Esta ação requer privilégios de administrador." 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  verificarAdmin,
  jwtSecret // Exportando caso precise em outros lugares, mas idealmente só o middleware usa
};