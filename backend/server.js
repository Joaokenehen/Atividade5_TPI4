require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Importação das Rotas
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rota base de teste
app.get("/", (req, res) => res.send("Servidor de upload e registro funcionando!"));

// Montagem das Rotas Modulares
app.use('/auth', authRoutes); // Prefixo para rotas de autenticação
app.use('/file', fileRoutes); // Prefixo para rotas de arquivo

// Servir arquivos estáticos (opcional, mas útil para ver os uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));