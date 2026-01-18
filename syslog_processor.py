import time
from collections import defaultdict, deque
from sender import send_alert


SERVICE_WINDOW = 30     
SERVICE_THRESHOLD = 9  

service_restart_tracker = defaultdict(deque)

def service_analysis(unified_log):
    service = unified_log.get("service", "").lower()
    message = unified_log.get("message", "").lower()

    # only track systemd services
    if not service or not service.endswith(".service"):
        return

    now = time.time()

    # track events per service
    events = service_restart_tracker[service]
    events.append(now)

    # remove old events outside the window
    while events and now - events[0] > SERVICE_WINDOW:
        events.popleft()

    # trigger only when threshold is hit (not every time after)
    if len(events) == SERVICE_THRESHOLD:
        print(
            f"[CRITICAL] Service restart abuse detected: {service} "
            f"(~3 restarts in {SERVICE_WINDOW}s)"
        )
    
        send_alert(
        severity="ALERT",
        detection="Service Restart Abuse",
        alert_type="Service",
        entity=service,
        reason=f"{SERVICE_THRESHOLD} restarts in {SERVICE_WINDOW}s"
        )


# ---- CONFIG ----
TIME_WINDOW = 60        # seconds
TIME_THRESHOLD = 2      # suspicious events
LOG_WINDOW = 30
LOG_THRESHOLD = 3

# ---- TRACKERS ----
time_events = deque()
log_events = deque()

LOGGING_SERVICES = {
    "rsyslog.service",
    "systemd-journald.service"
}

TIME_KEYWORDS = {
    "timesync",
    "time synchronization",
    "clocksource",
    "ntp",
    "system clock",
    "clock",
    "timedatectl",
    "set time"
}


ROTATION_KEYWORDS = {
    "logrotate",
    "rotating",
    "rotation"
}

def time_tampering_analysis(unified_log):
    service = unified_log.get("service", "").lower()
    message = unified_log.get("message", "").lower()
    now = time.time()

    # ---- TIME CHANGE DETECTION ----
    if any(keyword in message for keyword in TIME_KEYWORDS):
        time_events.append(now)

        while time_events and now - time_events[0] > TIME_WINDOW:
            time_events.popleft()

        if len(time_events) == TIME_THRESHOLD:
            print(
                "[CRITICAL] Possible system time manipulation detected "
                f"({TIME_THRESHOLD} events in {TIME_WINDOW}s)"
            )

            send_alert(
            severity="CRITICAL",
            detection="Time Manipulation",
            alert_type="User",
            entity="root",
            reason="Multiple system time changes detected"
        )


    # ---- LOGGING SERVICE RESTART ----
    if service in LOGGING_SERVICES:
        log_events.append(now)

        while log_events and now - log_events[0] > LOG_WINDOW:
            log_events.popleft()

        if len(log_events) == LOG_THRESHOLD:
            print(
                "[CRITICAL] Logging service instability detected "
                f"({LOG_THRESHOLD} events in {LOG_WINDOW}s)"
            )

        send_alert(
            severity="WARNING",
            detection="Logging Service Instability",
            alert_type="Service",
            entity=service,
            reason=f"{LOG_THRESHOLD} logging service restarts in {LOG_WINDOW}s"
        )

    # ---- LOG ROTATION BURST ----
    if any(keyword in message for keyword in ROTATION_KEYWORDS):
        log_events.append(now)

        while log_events and now - log_events[0] > LOG_WINDOW:
            log_events.popleft()

        if len(log_events) == LOG_THRESHOLD:
            print(
                "[WARNING] Suspicious log rotation activity detected"
            )

            send_alert(
            severity="WARNING",
            detection="Suspicious Log Rotation",
            alert_type="Service",
            entity=service if service else "logrotate",
            reason=f"{LOG_THRESHOLD} log rotation events in {LOG_WINDOW}s"
        )