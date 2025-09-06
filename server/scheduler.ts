import cron from "node-cron";
import { loadClientData } from "./utils";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_TOKEN || "";
const bot = new TelegramBot(token, { polling: false });

// Executa todo dia de hora em hora
cron.schedule("0 * * * *", async () => {
  const clients = loadClientData();
  const now = new Date();
  clients.forEach(client => {
    if (!client.eventId || !client.nextNotification) return;
    const notifyTime = new Date(client.nextNotification);
    if (notifyTime <= now) {
      bot.sendMessage(client.chatId, `Olá ${client.name}, lembrete do seu agendamento para ${client.lastService} está próximo!`);
      // Atualiza próxima notificação para não enviar duas vezes
      client.nextNotification = null;
    }
  });
});
