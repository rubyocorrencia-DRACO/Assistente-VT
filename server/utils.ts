import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

export function loadConversation(chatId: number | string) {
  const filePath = path.join(dataDir, `${chatId}_conversation.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function saveConversation(chatId: number | string, history: any[]) {
  const filePath = path.join(dataDir, `${chatId}_conversation.json`);
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
}

const clientsPath = path.join(dataDir, "clients.json");
if (!fs.existsSync(clientsPath)) fs.writeFileSync(clientsPath, "[]");

export function loadClientData() {
  return JSON.parse(fs.readFileSync(clientsPath, "utf-8"));
}

export function saveClientData(clients: any[]) {
  fs.writeFileSync(clientsPath, JSON.stringify(clients, null, 2));
}
