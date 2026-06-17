# Managing Policy Packs

Policy packs are collections of compliance controls grouped by framework. GESF ships with 10 packs containing 88 controls. You can list, install, and remove them.

## List Available Packs

```bash
ges policy list
```

Output:

```
  Available Policy Packs:

  gdpr            GDPR Compliance Pack
                  22 controls | saas, ai-application, mcp-server, ...

  owasp           OWASP ASVS Pack
                  6 controls | saas, ai-application, ...

  ai              AI System Pack
                  6 controls | ai-application, mcp-server

  blockchain      Blockchain Pack
                  6 controls | blockchain, wallet

  government      Government Pack
                  5 controls | government-system

  cis             CIS Controls Pack
                  5 controls | saas, healthcare-system, ...

  nist            NIST CSF Pack
                  6 controls | saas, healthcare-system, ...

  iso27001        ISO 27001 Pack
                  11 controls | saas, healthcare-system, ...

  iso27701        ISO 27701 Privacy Pack
                  11 controls | saas, ai-application, ...

  hipaa           HIPAA Healthcare Pack
                  10 controls | healthcare-system, saas
```

## Install a Pack

Add a policy pack that wasn't installed during `ges init`:

```bash
ges policy install ai
```

Output:

```
  ✓ Installed policy pack: ai (6 controls)
```

This creates `controls/ai/controls.json` with all AI-specific controls.

## Remove a Pack

Remove a pack you no longer need:

```bash
ges policy remove blockchain
```

Output:

```
  ✓ Removed policy pack: blockchain
```

This deletes the `controls/blockchain/` directory.

## When to Install Extra Packs

| Scenario | Command |
|----------|---------|
| You started with a generic web app and now add AI features | `ges policy install ai` |
| Your SaaS expands to serve government clients | `ges policy install government` |
| You're building a wallet feature into your app | `ges policy install blockchain` |
| You need ISO 27001 certification | `ges policy install iso27001` |
| Your SaaS processes significant PII and needs privacy controls | `ges policy install iso27701` |
| You're building a healthcare system handling ePHI | `ges policy install hipaa` |
| You accidentally removed a pack | `ges policy install gdpr` |

## Pack Reference

### GDPR Compliance Pack (`gdpr`)

**22 controls** based on GDPR Articles 5, 25, 30, 32, 33, 34. Covers encryption, authentication, audit logging, data retention, breach notification, and privacy by design. Installed by default for most project types.

### OWASP ASVS Pack (`owasp`)

**6 controls** based on OWASP Application Security Verification Standard. Covers authentication, access control, input validation, output encoding, and infrastructure security.

### CIS Controls Pack (`cis`)

**5 controls** based on the CIS Critical Security Controls. Covers inventory, vulnerability management, secure configuration, network security, and data recovery.

### NIST CSF Pack (`nist`)

**23 controls / 145 checks** based on NIST Cybersecurity Framework 2.0. Covers all six Functions: Govern (GV), Identify (ID), Protect (PR), Detect (DE), Respond (RS), and Recover (RC) — 23 Categories with SP 800-53 informative references.

### AI System Pack (`ai`)

**6 controls** for AI applications. Covers prompt logging, output validation, PII detection, rate limiting, data classification, and preventing unauthorized personal data transfer to AI providers. Apply to: AI applications, MCP servers.

### Blockchain Pack (`blockchain`)

**6 controls** for blockchain systems. Covers cryptographic signatures, validator identity verification, key rotation, encrypted payload support, immutable audit trails, and on-chain data privacy. Apply to: blockchain, wallets.

### Government Pack (`government`)

**5 controls** for government systems. Covers data sovereignty, auditability, chain of custody, tamper evidence, and record integrity verification.

### ISO 27001 Pack (`iso27001`)

**11 controls** based on ISO/IEC 27001 Annex A. Covers:

| Control | Area | Severity |
|---------|------|----------|
| A5 | Information security policies | High |
| A6 | Organization of information security | High |
| A8 | Asset management | Critical |
| A9 | Access control | Critical |
| A10 | Cryptography | Critical |
| A12 | Operations security | High |
| A13 | Communications security | High |
| A14 | System acquisition & development | High |
| A16 | Incident management | Critical |
| A17 | Business continuity | High |
| A18 | Compliance | High |

### ISO 27701 Privacy Pack (`iso27701`)

**11 controls** based on ISO/IEC 27701:2019 for Privacy Information Management Systems (PIMS). Extends ISO 27001 with privacy and PII protection:

| Control | Area | Severity |
|---------|------|----------|
| 5.2 | Privacy policies | High |
| 5.3 | PII roles & responsibilities | High |
| 5.4 | Privacy risk assessment (PIA/DPIA) | Critical |
| 6.2 | PII identification & classification | High |
| 6.4 | PII de-identification & anonymization | Critical |
| 6.5 | PII segregation | High |
| 6.7 | PII retention & disposal | Critical |
| 6.9 | PII transfer controls | Critical |
| 7.3 | PII controller obligations | Critical |
| 7.5 | PII processor obligations | High |
| 8.4 | Privacy by design | High |

### HIPAA Healthcare Pack (`hipaa`)

**10 controls** based on the HIPAA Security Rule and Privacy Rule (45 CFR 164). Covers electronic Protected Health Information (ePHI):

| Control | Area | Severity |
|---------|------|----------|
| 164.308 | Administrative safeguards | Critical |
| 164.310 | Physical safeguards | High |
| 164.312(a) | Access control | Critical |
| 164.312(b) | Audit controls | Critical |
| 164.312(c) | Integrity controls | High |
| 164.312(d) | Person/entity authentication | Critical |
| 164.312(e) | Transmission security | Critical |
| 164.314 | Business associate contracts (BAAs) | High |
| 164.502 | Minimum necessary standard | High |
| 164.530 | Administrative requirements | High |

## Global Privacy Packs

GESF includes 15 country-specific privacy packs plus a universal `privacy-core` baseline pack. These are documented in detail in the [Privacy Packs](../privacy-packs/index.md) section with every control, legal article reference, and interactive exercises.

| Pack | Country | Controls |
|------|---------|----------|
| `privacy-core` | Universal baseline | 40 |
| `uk-gdpr` | United Kingdom | 14 |
| `ch-fadp` | Switzerland | 8 |
| `sg-pdpa` | Singapore | 12 |
| `ph-dpa` | Philippines | 10 |
| `jp-appi` | Japan | 10 |
| `kr-pipa` | South Korea | 10 |
| `cn-pipl` | China | 11 |
| `in-dpdpa` | India | 8 |
| `br-lgpd` | Brazil | 10 |
| `ca-pipeda` | Canada | 10 |
| `us-cpra` | California (USA) | 9 |
| `za-popia` | South Africa | 8 |
| `ae-pdpl` | UAE | 6 |
| `sa-pdpl` | Saudi Arabia | 6 |

Install a country pack:

```bash
ges policy install br-lgpd
ges policy install sg-pdpa
```

When you run `ges init --country BR`, the matching privacy pack is auto-installed.

!!! example "Exercise: Install and Remove Packs"

    1. Initialize a new project:

    ```bash
    mkdir /tmp/pack-test && cd /tmp/pack-test
    echo '{"name":"pack-test"}' > package.json
    ges init -n "Pack Test" -t generic-web-application -f "GDPR,OWASP"
    ls controls/
    ```

    2. Install the AI pack:

    ```bash
    ges policy install ai
    ls controls/
    cat controls/ai/controls.json | head -20
    ```

    3. Install the Blockchain pack:

    ```bash
    ges policy install blockchain
    ls controls/
    ```

    4. Remove the Blockchain pack:

    ```bash
    ges policy remove blockchain
    ls controls/
    ```

    5. Verify only `gdpr`, `owasp`, `cis`, and `ai` remain

!!! example "Exercise: Explore Control Definitions"

    Pick a control pack and read through its controls:

    ```bash
    # Pretty-print the GDPR controls
    cat controls/gdpr/controls.json | python3 -m json.tool | head -50
    ```

    For each control, identify:
    - The control ID (e.g., `GDPR-ART32-002`)
    - The GDPR article it maps to
    - The severity level
    - The check items (what the scanner looks for)
    - The implementation guidance

    !!! question "Questions"
        - How many GDPR Article 32 controls are there?
        - Which control has the most check items?
        - Which controls would apply to a database-heavy application?
