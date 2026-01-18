import time
from sender import send_alert


#resources for outbound network detection 
outbound_events = {}   # src_ip -> list of timestamps
data_sent = {}         # src_ip -> total bytes
last_unusual_alert = {}  # src_ip -> last alert time

#cooldowns
TIME_WINDOW = 60
CONN_THRESHOLD = 10
DATA_THRESHOLD = 100_000  
COOLDOWN = 60

#resource for dns flood detection 
DNS_WINDOW = 10        # seconds
DNS_THRESHOLD = 20    # queries
dns_events = {}       # src_ip -> list of timestamps

#resource for http flood detection 
http_events = {}  
HTTP_WINDOW = 30
HTTP_THRESHOLD = 20

#resources for https sni detection 
https_sni_events = {}  
HTTPS_WINDOW = 30
HTTPS_SNI_THRESHOLD = 5 


#-------------------OUTBOUND NETWORK DETECTION--------------------

def is_internal(ip):
    return ip.startswith(("10.", "192.168.", "172.16.", "192.168."))

def outbound_analysis(log):
    src_ip = log.get("src_ip")
    dest_ip = log.get("dest_ip")
    dest_port = log.get("dest_port")
    bytes_out = log.get("bytes_toserver") or 0

    if not src_ip or not dest_ip:
        return

    if not is_internal(src_ip) or is_internal(dest_ip):
        return

    now = time.time()

    #----------Rule 1: Unusual port----------
    if dest_port not in [80, 443, 53 , 5353 , 1900]:
        last = last_unusual_alert.get(src_ip, 0)
        if now - last > COOLDOWN:
            print(f"[ALERT] Unusual outbound connection attempt: {src_ip} → {dest_ip}:{dest_port}")
            last_unusual_alert[src_ip] = now
    
            send_alert(
            severity="WARNING",
            detection="Unusual Network Activity",
            alert_type="IP",
            entity=dest_ip,
            reason="Outbound connection to multicast address"
        )


    #----------Rule 2: Connection burst----------
    outbound_events.setdefault(src_ip, []).append(now)
    outbound_events[src_ip] = [
        t for t in outbound_events[src_ip] if now - t <= TIME_WINDOW
    ]

    if len(outbound_events[src_ip]) >= CONN_THRESHOLD:
        print(f"[ALERT] Excessive outbound connections from {src_ip}")
        outbound_events[src_ip].clear()

        send_alert(
        severity="WARNING",
        detection="Excessive Outbound Connections",
        alert_type="IP",
        entity=src_ip,
        reason=f"{CONN_THRESHOLD} outbound connections "
    )


    #----------Rule 3: Data exfil----------
    data_sent[src_ip] = data_sent.get(src_ip, 0) + bytes_out

    if data_sent[src_ip] >= DATA_THRESHOLD:
        print(f"[ALERT] High outbound data from {src_ip}")
        data_sent[src_ip] = 0

        send_alert(
        severity="WARNING",
        detection="High Outbound Data Transfer",
        alert_type="IP",
        entity=src_ip,
        reason=f"{DATA_THRESHOLD} bytes sent outbound"

)


#--------------------DNS FLOODING DETECTION--------------------

def dns_analysis(log):
    if log.get("message") != "dns":
        return

    src_ip = log.get("src_ip")
    dest_port = log.get("dest_port")

    if not src_ip or dest_port != 53:
        return

    now = time.time()

    dns_events.setdefault(src_ip, []).append(now)

    dns_events[src_ip] = [
        t for t in dns_events[src_ip] if now - t <= DNS_WINDOW
    ]

    if len(dns_events[src_ip]) >= DNS_THRESHOLD:
        print(f"[ALERT] Possible DNS flood from {src_ip} "
              f"({len(dns_events[src_ip])} queries in {DNS_WINDOW}s)")
        dns_events[src_ip].clear()

        send_alert(
        severity="CRITICAL",
        detection="DNS Flooding",
        alert_type="IP",
        entity=src_ip,
        reason=f"{DNS_THRESHOLD} DNS queries IN {DNS_WINDOW}"
)


#--------------------HTTP FLOODING DETECTION--------------------


def http_analysis(log):
    if log.get("message") != "http":
        return

    src_ip = log.get("src_ip")
    if not src_ip:
        return

    now = time.time()
    http_events.setdefault(src_ip, []).append(now)

    http_events[src_ip] = [
        t for t in http_events[src_ip] if now - t <= HTTP_WINDOW
    ]

    if len(http_events[src_ip]) >= HTTP_THRESHOLD:
        print(f"[ALERT] Possible HTTP flood from {src_ip}")
        http_events[src_ip].clear()

        send_alert(
        severity="ALERT",
        detection="HTTP Flooding",
        alert_type="IP",
        entity=src_ip,
        reason=f"{HTTP_THRESHOLD} HTTP requests in {HTTP_WINDOW}s"
)


#--------------------HTTPS SNI DETECTION--------------------


def https_analysis(log):
    if log.get("message") != "tls":
        return

    src_ip = log.get("src_ip")
    sni = log.get("https_sni")

    if not src_ip or not sni:
        return

    now = time.time()

    https_sni_events.setdefault(src_ip, {})
    https_sni_events[src_ip][sni] = now

    # remove old SNI entries
    https_sni_events[src_ip] = {
        domain: t for domain, t in https_sni_events[src_ip].items()
        if now - t <= HTTPS_WINDOW
    }

    if len(https_sni_events[src_ip]) >= HTTPS_SNI_THRESHOLD:
        print(f"[ALERT] Excessive HTTPS domains from {src_ip}")
        print(f" Domains: {list(https_sni_events[src_ip].keys())}")
        https_sni_events[src_ip].clear()

        send_alert(
        severity="ALERT",
        detection="Suspicious HTTPS SNI Activity",
        alert_type="IP",
        entity=src_ip,
        reason=f"{HTTPS_SNI_THRESHOLD} TLS SNI requests in {HTTPS_WINDOW}s"
)

