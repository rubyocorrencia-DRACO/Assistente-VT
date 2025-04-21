from flask import Flask

app = Flask(__name__)

@app.route("/health")
def health():
    return "Bot está ativo!", 200

def run():
    app.run(host="0.0.0.0", port=5001)
