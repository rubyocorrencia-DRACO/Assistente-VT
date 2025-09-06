bot.on("message", async (msg) => {
  if (!msg.text) return;

  const chatId = msg.chat.id;
  const userName = msg.from?.first_name || "amigo";
  const userMessage = msg.text;

  const history = loadConversation(chatId);
  history.push({ role: "user", content: userMessage });

  // IA responde como Ruby, pessoa real
  const aiResponse = await askAI(history, userName);
  history.push({ role: "assistant", content: aiResponse });
  saveConversation(chatId, history);

  bot.sendMessage(chatId, aiResponse);

  // Agendamento
  if (/agendar/i.test(userMessage)) {
    bot.sendMessage(chatId, `Claro, ${userName}! Por favor, me diga a data e hora que você gostaria de agendar no formato AAAA-MM-DD HH:MM.`);
  } else if (/cancelar/i.test(userMessage)) {
    const clients = loadClientData();
    const client = clients.find(c => c.chatId === chatId);
    if (client && client.eventId) {
      await deleteEvent(client.eventId);
      client.eventId = null;
      saveClientData(clients);
      bot.sendMessage(chatId, `Tudo bem, ${userName}. Seu agendamento foi cancelado, espero vê-los em outra oportunidade!`);
    } else {
      bot.sendMessage(chatId, `Não encontrei nenhum agendamento seu, ${userName}.`);
    }
  } else if (/alterar/i.test(userMessage)) {
    bot.sendMessage(chatId, `Sem problemas, ${userName}. Me diga a nova data e hora que deseja alterar.`);
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(userMessage)) {
    const clients = loadClientData();
    let client = clients.find(c => c.chatId === chatId);
    if (!client) {
      client = { chatId, name: userName, eventId: null, lastService: "Banho/Tosa" };
      clients.push(client);
    }

    const events = await listEvents(userMessage, userMessage);
    if (events.length > 0) {
      bot.sendMessage(chatId, `Ops, ${userName}, esse horário já está ocupado. Pode me passar outro horário?`);
      return;
    }

    if (client.eventId) {
      await updateEvent(client.eventId, `Banho/Tosa - ${userName}`, `Serviço: Banho/Tosa`, userMessage);
      bot.sendMessage(chatId, `Beleza, ${userName}! Seu agendamento foi alterado para ${userMessage}.`);
    } else {
      const event = await createEvent(`Banho/Tosa - ${userName}`, `Serviço: Banho/Tosa`, userMessage);
      client.eventId = event.id;
      bot.sendMessage(chatId, `Perfeito, ${userName}! Seu agendamento para banho/tosa está confirmado em ${userMessage} 🐶✨`);
    }
    saveClientData(clients);
  }
});
