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
        "severity": data.get("severity", "INFO"),
        "detectionType": data.get("detection", "Unknown"),
        "reason": data.get("reason", ""),
        "service": data.get("service"),
        "user": data.get("user"),
        "sourceIp": data.get("ip"),
        "rawLog": data.get("rawLog", "")
    }

    ALERTS.append(alert)

    return {"status": "ok"}, 200


# Simulation endpoint (now generates ONLY 1 alert)
@app.route("/api/simulate", methods=["POST"])
def simulate():

    data = request.json
    sim_type = data.get("type", "Unknown Simulation")

    alert = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "severity": "ALERT",
        "detectionType": sim_type,
        "reason": f"Simulated {sim_type} activity detected",
        "service": "simulation-engine",
        "user": "attacker",
        "sourceIp": "192.168.1.10",
        "rawLog": f"{sim_type} simulated event"
    }

    ALERTS.append(alert)

    return jsonify({
        "alerts_created": 1
    })


@app.route("/api/alerts")
def get_alerts():
    return jsonify(ALERTS)


@app.route("/api/search")
def search():

    query = request.args.get("q", "").lower()

    if not query:
        return jsonify([])

    results = [
        a for a in ALERTS
        if query in (a.get("reason","").lower())
        or query in (a.get("detectionType","").lower())
        or query in (a.get("user","") or "").lower()
        or query in (a.get("service","") or "").lower()
        or query in (a.get("sourceIp","") or "").lower()
        or query in (a.get("rawLog","") or "").lower()
    ]

    return jsonify(results)


@app.route("/api/summary")
def summary():

    return {
        "total": len(ALERTS),
        "critical": sum(a["severity"] == "CRITICAL" for a in ALERTS),
        "alert": sum(a["severity"] == "ALERT" for a in ALERTS),
        "warning": sum(a["severity"] == "WARNING" for a in ALERTS),
        "info": sum(a["severity"] == "INFO" for a in ALERTS),
    }


@app.route("/api/posture")
def posture():

    critical_count = sum(a["severity"] == "CRITICAL" for a in ALERTS)
    alert_count = sum(a["severity"] == "ALERT" for a in ALERTS)
    warning_count = sum(a["severity"] == "WARNING" for a in ALERTS)

    if critical_count >= 2:
        return {"posture": "UNDER_ATTACK"}

    if alert_count >= 3:
        return {"posture": "UNDER_ATTACK"}

    if alert_count >= 1 or warning_count >= 1:
        return {"posture": "SUSPICIOUS"}

    return {"posture": "NORMAL"}


if __name__ == "__main__":
    app.run(port=5000, debug=True)