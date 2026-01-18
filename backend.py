from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

ALERTS = []

@app.route("/api/alert", methods=["POST"])
def receive_alert():
    data = request.json

    alert = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "severity": data.get("severity", "INFO"),  # CRITICAL | ALERT | WARNING | INFO
        "detectionType": data.get("detection", "Unknown"),
        "reason": data.get("reason", ""),
        "service": data["entity"] if data.get("type") == "Service" else None,
        "user": data["entity"] if data.get("type") == "User" else None,
        "sourceIp": data["entity"] if data.get("type") == "IP" else None,
    }

    ALERTS.append(alert)
    return {"status": "ok"}, 200


@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    return jsonify(ALERTS)


@app.route("/api/summary", methods=["GET"])
def summary():
    return {
        "total": len(ALERTS),
        "critical": sum(a["severity"] == "CRITICAL" for a in ALERTS),
        "alert": sum(a["severity"] == "ALERT" for a in ALERTS),
        "warning": sum(a["severity"] == "WARNING" for a in ALERTS),
        "info": sum(a["severity"] == "INFO" for a in ALERTS),
    }


@app.route("/api/posture", methods=["GET"])
def posture():
    if any(a["severity"] == "CRITICAL" for a in ALERTS):
        return {"posture": "UNDER_ATTACK"}
    if any(a["severity"] in ["ALERT", "WARNING"] for a in ALERTS):
        return {"posture": "SUSPICIOUS"}
    return {"posture": "NORMAL"}


if __name__ == "__main__":
    app.run(port=5000, debug=False)
