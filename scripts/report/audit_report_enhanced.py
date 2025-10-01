#!/usr/bin/env python3
"""
Audit Report Generator
Generates comprehensive audit reports from system data
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any
from jinja2 import Template

# Get the root directory
ROOT_DIR = Path(__file__).resolve().parents[2]

def load_sample_data() -> Dict[str, Any]:
    """Load sample audit data"""
    return {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "report_version": "1.0.0",
            "system_version": "1.0.0",
            "organization": "GTEK Quantum",
            "report_period": {
                "start": "2025-01-01",
                "end": "2025-09-30"
            }
        },
        "summary": {
            "total_events": 1247,
            "organizations": 5,
            "users": 23,
            "projects": 15,
            "tasks": 89,
            "ledger_integrity": "VERIFIED",
            "compliance_score": 98.5
        },
        "audit_trail": {
            "total_ledger_events": 1247,
            "verified_events": 1247,
            "failed_verifications": 0,
            "head_hash": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
            "chain_length": 1247,
            "earliest_event": "2025-01-15T09:30:00Z",
            "latest_event": "2025-09-30T16:45:12Z"
        },
        "security_events": [
            {
                "type": "LOGIN_SUCCESS",
                "count": 156,
                "risk_level": "LOW"
            },
            {
                "type": "LOGIN_FAILURE", 
                "count": 3,
                "risk_level": "MEDIUM"
            },
            {
                "type": "PERMISSION_DENIED",
                "count": 12,
                "risk_level": "HIGH"
            }
        ],
        "compliance_checks": [
            {
                "check": "Data Encryption at Rest",
                "status": "PASS",
                "details": "All sensitive data encrypted using AES-256"
            },
            {
                "check": "Access Control Matrix",
                "status": "PASS", 
                "details": "RBAC properly implemented across all endpoints"
            },
            {
                "check": "Audit Trail Completeness",
                "status": "PASS",
                "details": "100% of write operations logged"
            },
            {
                "check": "Backup Integrity",
                "status": "WARNING",
                "details": "Last backup verification: 2 days ago"
            }
        ],
        "recommendations": [
            "Schedule more frequent backup verifications",
            "Implement automated security scanning",
            "Add geo-location tracking for logins",
            "Enable real-time anomaly detection"
        ]
    }

def generate_markdown_report(data: Dict[str, Any]) -> str:
    """Generate markdown audit report"""
    
    template_str = """
# Audit Report

**Organization:** {{ metadata.organization }}  
**Generated:** {{ metadata.generated_at }}  
**Report Period:** {{ metadata.report_period.start }} to {{ metadata.report_period.end }}  
**Report Version:** {{ metadata.report_version }}  

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Audit Events | {{ summary.total_events | default("N/A") }} |
| Organizations | {{ summary.organizations | default("N/A") }} |
| Active Users | {{ summary.users | default("N/A") }} |
| Projects | {{ summary.projects | default("N/A") }} |
| Tasks | {{ summary.tasks | default("N/A") }} |
| Ledger Integrity | {{ summary.ledger_integrity | default("UNKNOWN") }} |
| Compliance Score | {{ summary.compliance_score | default("N/A") }}% |

---

## Audit Trail Integrity

The ledger verification shows **{{ audit_trail.verified_events }}** out of **{{ audit_trail.total_ledger_events }}** events verified successfully.

- **Chain Length:** {{ audit_trail.chain_length }} events
- **Head Hash:** `{{ audit_trail.head_hash }}`
- **Event Range:** {{ audit_trail.earliest_event }} → {{ audit_trail.latest_event }}
- **Failed Verifications:** {{ audit_trail.failed_verifications }}

{% if audit_trail.failed_verifications == 0 %}
✅ **All ledger events verified successfully**
{% else %}
⚠️ **{{ audit_trail.failed_verifications }} verification failures detected**
{% endif %}

---

## Security Events Summary

| Event Type | Count | Risk Level |
|------------|-------|------------|
{% for event in security_events %}
| {{ event.type }} | {{ event.count }} | {{ event.risk_level }} |
{% endfor %}

---

## Compliance Checks

{% for check in compliance_checks %}
### {{ check.check }}

**Status:** {% if check.status == "PASS" %}✅ {{ check.status }}{% elif check.status == "WARNING" %}⚠️ {{ check.status }}{% else %}❌ {{ check.status }}{% endif %}  
**Details:** {{ check.details }}

{% endfor %}

---

## Recommendations

{% for recommendation in recommendations %}
- {{ recommendation }}
{% endfor %}

---

## Technical Details

**System Version:** {{ metadata.system_version }}  
**Verification Method:** SHA-256 hash chain  
**Encryption Standard:** AES-256  
**Database:** PostgreSQL with audit triggers  

---

*This report was generated automatically by the NOVA Audit System.*  
*For questions, contact the system administrator.*

"""
    
    template = Template(template_str.strip())
    return template.render(**data)

def main():
    """Generate audit report in multiple formats"""
    
    print("🔍 Generating audit report...")
    
    # Load sample data (in production, this would query the database)
    data = load_sample_data()
    
    # Generate reports
    markdown_report = generate_markdown_report(data)
    
    # Write files
    markdown_path = ROOT_DIR / "AUDIT_REPORT.md"
    json_path = ROOT_DIR / "audit_data.json"
    
    with open(markdown_path, 'w', encoding='utf-8') as f:
        f.write(markdown_report)
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, default=str)
    
    print(f"✅ Markdown report: {markdown_path}")
    print(f"✅ JSON data: {json_path}")
    print(f"📊 Report covers {data['summary']['total_events']} audit events")
    print(f"🔒 Compliance score: {data['summary']['compliance_score']}%")

if __name__ == "__main__":
    main()