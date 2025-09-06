cron.schedule("0 * * * *", async () => {
  const clients = loadClientData();
  const now = new Date();
  clients.forEach(client => {
    if (!client.eventId || !client.nextNotification) return;
    const notifyTime = new Date(client.nextNotification);
    if (notifyTime <= now) {
      bot.sendMessage(client.chatId, `Oi ${client.name}! Só passando pra lembrar do seu agendamento de ${client.lastService} 🐾. Estou ansiosa pra ver você e seu pet!`);
      client.nextNotification = null;
    }
  });
});
