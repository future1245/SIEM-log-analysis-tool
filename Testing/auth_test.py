import time
import os

AUTH_LOG = "/var/log/auth.log"

def follow(file):
    file.seek(0, os.SEEK_END)
    while True:
        line = file.readline()
        if not line:
            time.sleep(0.5)
            continue
        yield line

def analyze_log(line):
    l = line.lower()

    # ================== SUDO ==================
    if "sudo:" in l:
        if ("authentication failure" in l or
            "incorrect password" in l or
            "pam_unix(sudo:auth)" in l):
            print("[FAIL] SUDO authentication failed ->", line.strip())

        elif "pam_unix(sudo:session)" in l:
            print("[GOOD] SUDO session opened ->", line.strip())

        elif "command=" in l:
            print("[GOOD] SUDO command executed ->", line.strip())

        else:
            print("[INFO] SUDO event ->", line.strip())
        return

    # ================== CRON ==================
    if "cron" in l:
        if ("failed" in l or
            "error" in l or
            "permission denied" in l):
            print("[FAIL] CRON job failed ->", line.strip())

        elif "cmd" in l:
            print("[GOOD] CRON job executed ->", line.strip())

        else:
            print("[INFO] CRON event ->", line.strip())
        return

    # ================== SSH ===================
    if "sshd" in l:
        if ("failed password" in l or
            "authentication failure" in l or
            "failed publickey" in l or
            "invalid user" in l):
            print("[FAIL] SSH authentication failed ->", line.strip())

        elif ("accepted password" in l or
              "accepted publickey" in l):
            print("[GOOD] SSH login successful ->", line.strip())

        else:
            print("[INFO] SSH event ->", line.strip())
        return

def main():
    print("Monitoring auth.log for SUDO, CRON, and SSH (GOOD & FAIL)...")
    print("Run using sudo | Press Ctrl+C to stop\n")

    try:
        with open(AUTH_LOG, "r") as logfile:
            for line in follow(logfile):
                analyze_log(line)
    except PermissionError:
        print("❌ Permission denied! Run with sudo.")
    except FileNotFoundError:
        print("❌ /var/log/auth.log not found!")

if __name__ == "__main__":
    main()