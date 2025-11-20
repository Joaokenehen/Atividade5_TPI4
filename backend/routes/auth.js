const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Precisamos da secret aqui para gerar o token no login
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

// Rota de Registro
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const existingUser = userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Este nome de usuário já está em uso." });
    }

    const passwordHash = await bcrypt.hash(password, 10); 

    userModel.addUser({
      username,
      email,
      passwordHash 
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// Rota de Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Recebido no servidor:', { username, password });

    const user = userModel.findByUsername(username);
    console.log('Usuário encontrado:', user);

    if (!username || !password || !user || !(await bcrypt.compare(password, user.passwordHash))) {
      console.log('Falha na autenticação');
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Payload com ID e Role (Requisito 1)
    const token = jwt.sign({ 
      userId: user.id, 
      userRole: user.role 
    }, jwtSecret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token: token,
      user: { 
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

module.exports = router;