require('dotenv').config(); // Garante que o .env seja lido
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('./models/userModel'); // Importa o modelo de usuário

app.use(cors());
app.use(express.json()); 

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.status(401).json({ error: "Acesso negado. Token não fornecido." }); 
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      // Se o token for inválido (expirado, etc.), retorna 403 (Proibido)
      console.log("Erro na verificação do JWT:", err);
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }
    
    // Se o token for válido, salva o usuário no 'req' e continua
    req.user = user;
    next();
  });
};
// -----------------------------------


const createUploadDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Diretório ${dir} criado automaticamente.`);
  }
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      new Error("Tipo de arquivo inválido. Apenas JPG e PNG são permitidos."),
      false
    );
  }
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;
const uploadDir = "uploads/";
createUploadDirectory(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    createUploadDirectory(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

app.get("/", (req, res) => res.send("Servidor de upload e registro funcionando!"));


// --- ROTA DE UPLOAD PROTEGIDA ---
app.post("/upload", authenticateToken, (req, res) => {
  console.log(`Upload autenticado para o usuário:`, req.user);

  upload.array("meusArquivos", MAX_FILES)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_COUNT")
        return res
          .status(400)
          .json({ error: "Too many files. Máximo de 10 permitidos." });
      if (err.code === "LIMIT_FILE_SIZE")
        return res
          .status(400)
          .json({ error: "Arquivo excede o limite de 5MB." });
      return res.status(400).json({ error: `Erro do Multer: ${err.code}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "Nenhum arquivo enviado." });

    res.json({
      message: "Upload realizado com sucesso!",
      arquivos: req.files.map((f) => f.filename),
    });
  });
});


app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Recebido no servidor:', { username, password });

    const user = userModel.findByUsername(username);
    console.log('Usuário encontrado:', user);

    if (!username || !password || !user || !(await bcrypt.compare(password, user.passwordHash))) {
      console.log('Falha na autenticação');
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ userId: user.id ?? user.username }, jwtSecret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token: token,
      user: { 
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});


app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));