import os
from flask import Flask, request
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

TOKEN = "7387684386:AAFbCNWP9Rc0Y2G8Fh61MX0dbbGqGhoH8dM"

# Inicializa o Flask
app = Flask(__name__)

# Inicializa o bot com o token do ambiente
application = Application.builder().token(os.getenv("TELEGRAM_TOKEN")).build()

# Comando /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Olá! Eu sou o Assistente Virtual.")

# Comando /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Comandos disponíveis:\n/start - Iniciar o bot\n/help - Obter ajuda")

# Adiciona os manipuladores de comando
application.add_handler(CommandHandler("start", start))
application.add_handler(CommandHandler("help", help_command))

# Rota para o webhook
@app.route("/webhook", methods=["POST"])
def webhook():
    update = Update.de_json(request.get_json(force=True), application.bot)
    application.update_queue.put(update)
    return "OK", 200

# Rota de verificação de saúde
@app.route("/health", methods=["GET"])
def health():
    return "Bot está ativo!", 200

if __name__ == "__main__":
    # Define o webhook
    webhook_url = os.getenv("WEBHOOK_URL")
    if webhook_url:
        application.bot.set_webhook(url=webhook_url)
    app.run(host="0.0.0.0", port=5000)
