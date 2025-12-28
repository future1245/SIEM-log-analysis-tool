import time

cron_events = []

CRON_THRESHOLD = 5
TIME_WINDOW = 60  

ssh_fail_count = 0
sudo_fail_count = 0

def auth_analysis(log):
    global ssh_fail_count, sudo_fail_count

    service = log.get("service")
    message = log.get("message", "")

    if not service or not message:
        return

    # ---------- SSH ----------
    if service == "sshd":
        if " Failed password for future" in message: 
            ssh_fail_count += 1
            print(f"[DETECTED] Failed SSH login (count={ssh_fail_count})")

        elif "session opened" in message:
            print("[DETECTED] Successful SSH login")

    # ---------- SUDO ----------
    elif service == "sudo":

        if ((
            "password check failed for user" in message or 
           "conversation failed" in message or
            "auth could not identify password" in message or
            "incorrect password attempt" in message) and sudo_fail_count ==0
        ):
            return

        if( "pam_unix(sudo:auth): authentication failure" in message or "password check failed for user" in message):
            sudo_fail_count += 1
            print(f"[DETECTED] Failed sudo attempt (count={sudo_fail_count})")

        elif "session opened" in message:
            print("[DETECTED] Privilege escalation (sudo)")

    # ---------- CRON ----------
    elif service == "CRON":
            
            global cron_events , CRON_THRESHOLD , TIME_WINDOW
            if "session opened" in message:
                now = time.time()
                cron_events.append(now)

               
                cron_events = [t for t in cron_events if now - t <= TIME_WINDOW]

                print(f"[INFO] Cron started (last {TIME_WINDOW}s = {len(cron_events)})")

                if len(cron_events) >= CRON_THRESHOLD:
                    print("[ALERT] Excessive cron executions detected")

                if "user root" in message:
                    print("[ALERT] Cron job running as ROOT")



