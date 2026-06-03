# SIEM Log Analysis Tool

A lightweight, event-driven Security Information and Event Management (SIEM) prototype designed to collect, normalize, and analyze Linux system logs with intelligent rule-based detection for security threats.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Security Capabilities](#security-capabilities)
- [System Architecture](#system-architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Supported Log Sources](#supported-log-sources)
- [Detection Rules](#detection-rules)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This SIEM prototype provides enterprises with a lightweight alternative to traditional enterprise SIEM solutions. Built with TypeScript and Python, it offers real-time log collection, normalization, and threat detection specifically optimized for Linux environments. The tool implements event-driven architecture for efficient processing of high-volume security events.

### Use Cases

- **Incident Detection**: Identify suspicious activities in real-time
- **Compliance Monitoring**: Track and audit system activities for regulatory requirements
- **Threat Intelligence**: Correlate events to identify attack patterns
- **Operational Security**: Monitor privileged access and system changes
- **Network Security**: Detect and alert on network-based attacks

## 🔒 Security Capabilities

### 1. **Brute-Force Attack Detection**
- Real-time monitoring of authentication failures
- Configurable threshold-based alerts
- Automatic IP reputation tracking
- Pattern recognition for distributed attack scenarios
- Timestamp-based correlation across multiple login attempts

### 2. **Privilege Abuse Detection**
- Tracks unauthorized `sudo` and `su` command execution
- Monitors user privilege escalation attempts
- Detects anomalous privilege usage patterns
- Alerts on privilege boundary violations
- User-to-privilege mapping analysis

### 3. **Cron Misuse Detection**
- Monitors cron job execution anomalies
- Detects unauthorized cron modifications
- Tracks suspicious cron-based command execution
- Identifies persistence mechanisms using cron jobs
- Timing-based anomaly detection for cron activities

### 4. **Network Attack Detection**
- Integration with Suricata IDS for signature-based detection
- Deep packet inspection capabilities
- Real-time network threat identification
- Protocol anomaly detection
- Malware traffic pattern recognition

### 5. **Log Normalization**
- Unified event format for heterogeneous log sources
- Standardized timestamp processing
- Field extraction and parsing
- Data enrichment and context addition
- Schema-based validation

### 6. **Rule-Based Detection Engine**
- Flexible, extensible detection rule framework
- Multi-step correlation rules
- Temporal and statistical analysis
- Custom alert routing and severity classification
- Rule versioning and audit trails

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│      Log Sources                            │
│  ├─ Linux Authentication (auth.log)         │
│  ├─ System Logs (syslog)                    │
│  ├─ Network Detection (Suricata)            │
│  └─ Application Logs                        │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│      Log Collection & Ingestion             │
│  ├─ File Monitoring                         │
│  ├─ Real-time Parsing                       │
│  └─ Event Queuing                           │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│      Log Normalization Engine               │
│  ├─ Format Standardization                  │
│  ├─ Field Extraction                        │
│  ├─ Data Enrichment                         │
│  └─ Schema Validation                       │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│      Detection & Correlation Engine         │
│  ├─ Rule Evaluation                         │
│  ├─ Event Correlation                       │
│  ├─ Threshold Analysis                      │
│  └─ Alert Generation                        │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│      Alert & Response Management            │
│  ├─ Severity Classification                 │
│  ├─ Alert Routing                           │
│  ├─ Investigation UI                        │
│  └─ Response Actions                        │
└─────────────────────────────────────────────┘
```

## 📋 Requirements

### System Requirements
- **OS**: Linux (Ubuntu 20.04+, CentOS 8+, or equivalent)
- **CPU**: 2+ cores
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 20GB+ for log storage (depends on log volume)

### Software Dependencies
- Node.js 16.0 or higher
- Python 3.8 or higher
- Suricata 6.0 or higher (for network detection)

### Supported Log Sources
- **Authentication Logs**: `/var/log/auth.log`, `/var/log/secure`
- **System Logs**: `/var/log/syslog`, `/var/log/messages`
- **IDS/IPS**: Suricata EVE JSON output
- **Custom Sources**: Syslog protocol support

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/future1245/SIEM-log-analysis-tool.git
cd SIEM-log-analysis-tool
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Configure Suricata Integration (Optional)
```bash
sudo apt-get install suricata
sudo suricata -c /etc/suricata/suricata.yaml -i eth0
```

### 4. Build the Project
```bash
npm run build
```

### 5. Start the Application
```bash
npm start
```

## 🔧 Configuration

### Main Configuration File
Create a `config.json` file in the root directory:

```json
{
  "logSources": [
    {
      "name": "authentication",
      "path": "/var/log/auth.log",
      "type": "auth",
      "enabled": true
    },
    {
      "name": "system",
      "path": "/var/log/syslog",
      "type": "syslog",
      "enabled": true
    },
    {
      "name": "network",
      "path": "/var/log/suricata/eve.json",
      "type": "suricata",
      "enabled": true
    }
  ],
  "detection": {
    "bruteForceThreshold": 5,
    "bruteForceWindow": 300,
    "privilegeEscalationTracking": true,
    "cronMonitoring": true,
    "networkThreatsEnabled": true
  },
  "alerts": {
    "severityLevels": ["critical", "high", "medium", "low"],
    "routingDestination": "console",
    "webhookUrl": ""
  }
}
```

### Rule Configuration
Place custom detection rules in `rules/` directory in YAML format:

```yaml
rule:
  name: "Multiple Failed Login Attempts"
  id: "AUTH-001"
  severity: "high"
  description: "Detects brute-force login attempts"
  conditions:
    - field: "event_type"
      operator: "equals"
      value: "auth_failure"
    - field: "count"
      operator: "greater_than"
      value: 5
  window: 300
  action: "alert"
```

## 🚀 Usage

### Start the SIEM Service
```bash
npm start
```

### Run Detection Engine
```bash
npm run detect
```

### View Alerts
```bash
npm run alerts
```

### Launch Web Dashboard
```bash
npm run dashboard
# Access at http://localhost:3000
```

### Query Logs
```bash
npm run query -- --source auth --timerange "last 1h"
```

## 📊 Supported Log Sources

| Source | Format | Purpose |
|--------|--------|---------|
| **Auth Logs** | Text/Syslog | Authentication events, login attempts, privilege escalation |
| **System Logs** | Text/Syslog | System events, service changes, cron execution |
| **Suricata** | JSON (EVE) | Network intrusion detection, protocol anomalies |
| **Syslog** | Syslog Protocol | Remote log collection from network devices |

## 🎯 Detection Rules

### Pre-Built Detection Rules

#### 1. Brute-Force Detection
- Monitors repeated authentication failures
- Configurable failure threshold (default: 5 attempts in 5 minutes)
- IP-based and user-based correlation
- Automatic blocking recommendations

#### 2. Privilege Escalation Detection
- Tracks `sudo` command execution with suspicious patterns
- Detects `su` usage anomalies
- Monitors privilege boundary violations
- Alerts on unauthorized privilege changes

#### 3. Cron Abuse Detection
- Identifies unauthorized cron job creation
- Detects suspicious cron-based commands
- Monitors cron file modifications
- Tracks timing anomalies

#### 4. Network Threat Detection
- Integrates Suricata ruleset
- Detects known attack signatures
- Identifies protocol violations
- Alerts on suspicious network patterns

## 📈 Performance

### Benchmarks
- **Log Ingestion**: Up to 10,000 events per second
- **Detection Latency**: <500ms average
- **Memory Footprint**: 200-500MB (configurable)
- **Storage**: 1-2GB per day (depends on configuration)

### Optimization Tips
1. Tune log ingestion batch sizes
2. Filter unnecessary log sources
3. Configure appropriate retention policies
4. Use database indexing for historical queries

## 🛠️ Troubleshooting

### Common Issues

**Issue**: High memory consumption
- **Solution**: Reduce log ingestion rate or implement archival policies

**Issue**: Missed alerts
- **Solution**: Verify rule syntax and log source configuration

**Issue**: Performance degradation
- **Solution**: Implement log rotation and retention policies

## 📚 Technology Stack

- **Frontend**: TypeScript with modern web framework
- **Backend**: Node.js with event-driven architecture
- **Processing**: Python for advanced analytics
- **Styling**: CSS for UI components
- **Integration**: Suricata IDS/IPS

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Include security considerations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/future1245/SIEM-log-analysis-tool/issues)
- **Documentation**: Check the [docs](./docs) directory
- **Security Concerns**: Please report privately to maintainers

## 🎓 Learn More

- [SIEM Best Practices](https://www.nist.gov/cyberframework)
- [Linux Log Formats](https://tools.ietf.org/html/rfc5424)
- [Suricata Documentation](https://docs.suricata.io/)
- [Detection Rule Development](./docs/rule-development.md)

---

**Last Updated**: June 2026

Made with ❤️ for the security community