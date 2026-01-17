import time
import json
import syslog_processor
import auth_processor
import suricata_processor


def main():
    # logs that are analysed
    files = {
        "SYSLOG": open("/var/log/syslog"),
        "AUTH": open("/var/log/auth.log"),
        "SURICATA": open("/var/log/suricata/eve.json"),
    }

    # go to the bottom of the log
    for f in files.values():
        f.seek(0, 2)

    try:
        while True:
            for name, f in files.items():
                line = f.readline()
                if not line:
                    continue

                raw_line = line.strip()

                # -------------------- SYSLOG --------------------
                if name == "SYSLOG":
                    parts = raw_line.split()
                    if len(parts) < 5:
                        continue

                    timestamp = " ".join(parts[0:3])
                    service_part = parts[4]
                    message = " ".join(parts[5:])
                    service = service_part.split("[")[0].replace(":", "")

                    unified_log = {
                        "timestamp": timestamp,
                        "src_ip": None,
                        "src_port": None,
                        "dest_ip": None,
                        "dest_port": None,
                        "proto": None,
                        "pkts_toserver": None,
                        "pkts_toclient": None,
                        "bytes_toserver": None,
                        "bytes_toclient": None,
                        "http_url": None,
                        "http_method": None,
                        "https_sni": None,
                        "dns_query": None,
                        "dns_type": None,
                        "service": service,
                        "message": message
                    }
                    print(unified_log)
                    syslog_processor.service_analysis(unified_log)
                    syslog_processor.time_tampering_analysis(unified_log)
                   

                # -------------------- AUTH.LOG --------------------
                elif name == "AUTH":
                    parts = raw_line.split()
                    if len(parts) < 5:
                        continue

                    if parts[0].startswith("20"):
                        timestamp = parts[0]
                        message = " ".join(parts[1:])
                    else:
                        timestamp = " ".join(parts[0:3])
                        message = " ".join(parts[3:])

                    if "sudo:" in raw_line or "unix_chkpwd" in raw_line:
                        service = "sudo"
                    elif "sshd" in raw_line:
                        service = "sshd"
                    elif "CRON" in raw_line:
                        service = "CRON"
                    else:
                        service = "auth"

                    unified_log = {
                        "timestamp": timestamp,
                        "src_ip": None,
                        "src_port": None,
                        "dest_ip": None,
                        "dest_port": None,
                        "proto": None,
                        "pkts_toserver": None,
                        "pkts_toclient": None,
                        "bytes_toserver": None,
                        "bytes_toclient": None,
                        "http_url": None,
                        "http_method": None,
                        "https_sni": None,
                        "dns_query": None,
                        "dns_type": None,
                        "service": service,
                        "message": message
                    }

                    auth_processor.auth_analysis(unified_log)

                # -------------------- SURICATA --------------------
                elif name == "SURICATA":
                    try:
                        event = json.loads(raw_line)
                    except json.JSONDecodeError:
                        continue

                    event_type = event.get("event_type")

                    unified_log = {
                        "timestamp": event.get("timestamp"),
                        "src_ip": event.get("src_ip"),
                        "src_port": event.get("src_port"),
                        "dest_ip": event.get("dest_ip"),
                        "dest_port": event.get("dest_port"),
                        "proto": event.get("proto"),
                        "pkts_toserver": None,
                        "pkts_toclient": None,
                        "bytes_toserver": None,
                        "bytes_toclient": None,
                        "http_url": None,
                        "http_method": None,
                        "https_sni": None,
                        "dns_query": None,
                        "dns_type": None,
                        "service": "suricata",
                        "message": event_type
                    }

                    if event_type == "flow":
                        flow = event.get("flow", {})
                        unified_log["pkts_toserver"] = flow.get("pkts_toserver")
                        unified_log["pkts_toclient"] = flow.get("pkts_toclient")
                        unified_log["bytes_toserver"] = flow.get("bytes_toserver")
                        unified_log["bytes_toclient"] = flow.get("bytes_toclient")

                    elif event_type == "http":
                        http = event.get("http", {})
                        unified_log["http_url"] = http.get("url")
                        unified_log["http_method"] = http.get("http_method")

                    elif event_type == "tls":
                        tls = event.get("tls", {})
                        unified_log["https_sni"] = tls.get("sni")

                    elif event_type == "dns":
                        dns = event.get("dns", {})
                        unified_log["dns_query"] = dns.get("rrname")
                        unified_log["dns_type"] = dns.get("rrtype")

                    suricata_processor.outbound_analysis(unified_log)
                    suricata_processor.dns_analysis(unified_log)
                    suricata_processor.http_analysis(unified_log)
                    suricata_processor.https_analysis(unified_log)

            time.sleep(0.2)

    except KeyboardInterrupt:
        print("\n[INFO] Unified Log Monitor stopped safely.")
        for f in files.values():
            f.close()


if __name__ == "__main__":
    main()
