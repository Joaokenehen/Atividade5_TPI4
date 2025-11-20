const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { authenticateToken, verificarAdmin } = require('../middlewares/authMiddleware');

// --- CONFIGURAÇÃO DO MULTER ---
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
    cb(new Error("Tipo de arquivo inválido. Apenas JPG e PNG são permitidos."), false);
  }
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;
const uploadDir = "uploads/"; // Caminho relativo à raiz do projeto onde o server roda
createUploadDirectory(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Garante que a pasta existe antes de salvar
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

// --- ROTAS ---

// Rota de Upload (Protegida: User/Admin)
router.post("/upload", authenticateToken, (req, res) => {
  console.log(`Upload autenticado para o usuário:`, req.user);

  upload.array("meusArquivos", MAX_FILES)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_COUNT")
        return res.status(400).json({ error: "Too many files. Máximo de 10 permitidos." });
      if (err.code === "LIMIT_FILE_SIZE")
        return res.status(400).json({ error: "Arquivo excede o limite de 5MB." });
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

// Rota Delete (Protegida: Apenas Admin)
router.delete("/delete/:filename", authenticateToken, verificarAdmin, (req, res) => {
  const { filename } = req.params;

  // Importante: __dirname aqui refere-se a /backend/routes.
  // Precisamos subir um nível (..) para acessar a pasta uploads na raiz do backend.
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Arquivo não encontrado." });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Erro ao deletar arquivo ${filename}:`, err);
      return res.status(500).json({ error: "Erro ao deletar o arquivo." });
    }

    console.log(`Arquivo deletado pelo admin ${req.user.userId}: ${filename}`);
    return res.status(200).json({ message: "Arquivo deletado com sucesso!" });
  });
});

module.exports = router;