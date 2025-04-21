# Assistente-VT
Este bot automatiza tarefas e interage com usuários via Telegram, utilizando Flask para integração com Webhook. Suporta comandos personalizados, processamento de dados e mantém-se ativo 24/7 na nuvem. Ideal para automação de processos e interação contínua com usuários.
import os
from flask import Flask, request
from telegram import Bot, Update
from telegram.ext import Dispatcher, CommandHandler
from keep_alive import keep_alive  # Módulo para manter o bot ativo
from bot_commands import start, help_command  # Comandos do bot
from data_utils import process_data  # Função para processar dados
from admin_utils import admin_check  # Função para verificar administrador
from baixa_utils import baixar_arquivo  # Função para baixar arquivos
from fac_generator import gerar_faixa  # Função para gerar faixas
from threading import Thread
import logging

# Configuração do logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicialização do Flask e do bot
app = Flask(__name__)
TOKEN = os.getenv("TELEGRAM_TOKEN")
bot = Bot(TOKEN)
dispatcher = Dispatcher(bot, None, workers=0)

# Adicionando handlers de comandos
dispatcher.add_handler(CommandHandler("start", start))
dispatcher.add_handler(CommandHandler("help", help_command))

# Endpoint de saúde
@app.route("/health")
def health():
    return "OK"

# Endpoint do webhook
@app.route(f"/{TOKEN}", methods=["POST"])
def webhook():
    json_str = request.get_data().decode("UTF-8")
    update = Update.de_json(json_str, bot)
    dispatcher.process_update(update)
    return "OK"

# Função para iniciar o servidor Flask
def run():
    app.run(host="0.0.0.0", port=5000)

# Função para manter o bot ativo
def keep_alive_thread():
    keep_alive.run()

# Iniciando o servidor Flask e o keep_alive em threads separadas
if __name__ == "__main__":
    Thread(target=run).start()
    Thread(target=keep_alive_thread).start()
