from ULM import main as siem_main
import subprocess
import threading
import os

def start_siem():
    print("[INFO] SIEM analyser is starting...")
    siem_main()  # this is your processor loop

def start_frontend():
    print("[INFO] Frontend is starting...")
    frontend_path = os.path.join(os.getcwd(), "FRONT_END")

    subprocess.run(
        ["npm", "run", "dev"],
        cwd=frontend_path
    )

def start():
    siem_thread = threading.Thread(target=start_siem)
    frontend_thread = threading.Thread(target=start_frontend)

    siem_thread.start()
    frontend_thread.start()

    siem_thread.join()
    frontend_thread.join()

if __name__ == "__main__":
    start()

