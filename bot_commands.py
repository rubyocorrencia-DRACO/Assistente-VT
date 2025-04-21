from telegram import Update
from telegram.ext import CallbackContext

async def start(update: Update, context: CallbackContext):
    await update.message.reply_text("Olá! Eu sou o Assistente Virtual.")

async def help_command(update: Update, context: CallbackContext):
    await update.message.reply_text("Comandos disponíveis:\n/start - Iniciar o bot\n/help - Obter ajuda")
