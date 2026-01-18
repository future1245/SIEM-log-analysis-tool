from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

ALERTS = []

@app.route("/api/alert", methods=["POST"])
def receive_alert():
    data = request.json
    data["received_at"] = datetime.utcnow().isoformat()
    ALERTS.append(data)
    return {"status": "ok"}, 200

@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    return jsonify(ALERTS)

if __name__ == "__main__":
    app.run(port=5000, debug=False)
