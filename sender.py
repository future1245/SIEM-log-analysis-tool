# sender.py
import requests
import time

BACKEND_URL = "http://127.0.0.1:5000/api/alerts"

def send_alert(severity, detection, alert_type, entity, reason):
    payload = {
        "time": int(time.time()),
        "severity": severity,
        "detection": detection,
        "type": alert_type,      # Service / User / IP
        "entity": entity,        # ssh.service / root / 192.168.1.5
        "reason": reason
    }

    try:
        requests.post(BACKEND_URL, json=payload, timeout=1)
    except Exception:
        pass
