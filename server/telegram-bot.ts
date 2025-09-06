import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { askAI } from "./chatgpt";
import { saveConversation, loadConversation, saveClientData, loadClientData } from "./utils";
import { createEvent, listEvents, updateEvent, deleteEvent } from "./google-calendar";

dotenv.config();

const token = process.env.TELEGRAM_TOKEN || "";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  if (!msg.text) return;

  const chatId = msg.chat.id;
  const userName = msg.from?.first_name || "Cliente";
  const userMessage = msg.text;

  const history = loadConversation(chatId);
  history.push({ role: "user", content: userMessage });

  // IA responde
  const aiResponse = await askAI(history, userName);
  history.push({ role: "assistant", content: aiResponse });
  saveConversation(chatId, history);

  bot.sendMessage(chatId, aiResponse);

  // Verificar se o usuário deseja agendar, alterar ou cancelar
  if (/agendar/i.test(userMessage)) {
    bot.sendMessage(chatId, "Por favor, informe a data e hora desejadas no formato AAAA-MM-DD HH:MM");
  } else if (/cancelar/i.test(userMessage)) {
    const clients = loadClientData();
    const client = clients.find(c => c.chatId === chatId);
    if (client && client.eventId) {
      await deleteEvent(client.eventId);
      client.eventId = null;
      saveClientData(clients);
      bot.sendMessage(chatId, "Seu agendamento foi cancelado com sucesso!");
    } else {
      bot.sendMessage(chatId, "Não encontrei nenhum agendamento para cancelar.");
    }
  } else if (/alterar/i.test(userMessage)) {
    bot.sendMessage(chatId, "Informe a nova data e hora para alterar o agendamento no formato AAAA-MM-DD HH:MM");
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(userMessage)) {
    // Criar ou alterar agendamento
    const clients = loadClientData();
    let client = clients.find(c => c.chatId === chatId);
    if (!client) {
      client = { chatId, name: userName, eventId: null, lastService: "Banho/Tosa" };
      clients.push(client);
    }
    // Verifica disponibilidade na agenda
    const events = await listEvents(userMessage, userMessage);
    if (events.length > 0) {
      bot.sendMessage(chatId, "Esse horário já está ocupado, por favor escolha outro.");
      return;
    }
    if (client.eventId) {
      await updateEvent(client.eventId, `Banho/Tosa - ${userName}`, `Serviço: Banho/Tosa`, userMessage);
      bot.sendMessage(chatId, `Seu agendamento foi alterado para ${userMessage}`);
    } else {
      const event = await createEvent(`Banho/Tosa - ${userName}`, `Serviço: Banho/Tosa`, userMessage);
      client.eventId = event.id;
      bot.sendMessage(chatId, `Agendamento confirmado para ${userMessage}`);
    }
    saveClientData(clients);
  }
});
