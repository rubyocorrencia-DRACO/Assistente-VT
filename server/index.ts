import express from "express";
import dotenv from "dotenv";
import "./telegram-bot";
import "./scheduler";

dotenv.config();

const app = express();
app.use(express.json());

// Dashboard simples: lista todos os clientes e agendamentos
import fs from "fs";
import path from "path";

app.get("/dashboard", (req, res) => {
  const filePath = path.join(process.cwd(), "data/clients.json");
  if (!fs.existsSync(filePath)) return res.json([]);
  const clients = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(clients);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
