import time
from sender import send_alert

# ---------------- GLOBAL STATE ----------------

cron_events = []

CRON_THRESHOLD = 8
TIME_WINDOW = 60

SSH_THRESHOLD = 5
SUDO_THRESHOLD = 3

ssh_fail_count = 0
sudo_fail_count = 0


# ---------------- AUTH ANALYSIS ----------------

def auth_analysis(log):

    global ssh_fail_count, sudo_fail_count, cron_events

    service = log.get("service")
    message = log.get("message", "")

    if not service or not message:
        return


    # ---------- SSH ----------
    if service == "sshd":

        if "Failed password for" in message:

            ssh_fail_count += 1
            print(f"[DETECTED] Failed SSH login (count={ssh_fail_count})")

            if ssh_fail_count >= SSH_THRESHOLD:

                send_alert(
                    severity="CRITICAL",
                    detection="SSH Brute Force",
                    alert_type="IP",
                    entity="auth.log",
                    reason=f"{ssh_fail_count} failed SSH login attempts"
                )

                ssh_fail_count = 0


        elif "session opened" in message:

            print("[INFO] Successful SSH login")

            send_alert(
                severity="INFO",
                detection="SSH Successful Login",
                alert_type="User",
                entity="auth.log",
                reason="Successful SSH login detected"
            )


    # ---------- SUDO ----------
    elif service == "sudo":

        if (
            "authentication failure" in message
            or "password check failed" in message
        ):

            sudo_fail_count += 1
            print(f"[DETECTED] Failed sudo attempt (count={sudo_fail_count})")

            if sudo_fail_count >= SUDO_THRESHOLD:

                send_alert(
                    severity="WARNING",
                    detection="Privilege Escalation Brute Force",
                    alert_type="User",
                    entity="auth.log",
                    reason=f"{sudo_fail_count} failed sudo attempts"
                )

                sudo_fail_count = 0


        elif "session opened" in message:

            print("[INFO] Privilege escalation using sudo")

            send_alert(
                severity="INFO",
                detection="Privilege Escalation by User",
                alert_type="User",
                entity="auth.log",
                reason="Successful sudo execution"
            )


    # ---------- CRON ----------
    elif service == "CRON":

        if "session opened" in message:

            now = time.time()
            cron_events.append(now)

            cron_events = [t for t in cron_events if now - t <= TIME_WINDOW]

            print(f"[INFO] Cron started (last {TIME_WINDOW}s = {len(cron_events)})")

            if len(cron_events) >= CRON_THRESHOLD:

                print("[ALERT] Excessive cron executions detected")

                send_alert(
                    severity="ALERT",
                    detection="Cron Execution Burst",
                    alert_type="Service",
                    entity="cron.service",
                    reason=f"{CRON_THRESHOLD} cron executions within {TIME_WINDOW}s"
                )

                cron_events.clear()


        if "user root" in message:

            print("[INFO] Cron job executed as root")

            send_alert(
                severity="INFO",
                detection="Cron Job Executed",
                alert_type="Service",
                entity="cron.service",
                reason="Cron job executed as root"
            )