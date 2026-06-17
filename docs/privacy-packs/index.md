# Global Privacy Compliance Packs

GESF provides a layered privacy compliance framework: a universal **Privacy Core** baseline plus **15 country-specific packs** covering every major jurisdiction worldwide. Each pack contains article-level controls with detailed implementation guidance and verification checks.

---

## Architecture

```
                    ┌─────────────────────┐
                    │   privacy-core      │  40 controls, 10 domains
                    │   (universal)       │  installed for every project
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
  ┌────────┴────────┐ ┌───────┴───────┐ ┌────────┴────────┐
  │  Country Pack   │ │ Country Pack  │ │ Country Pack    │
  │  (br-lgpd)      │ │ (sg-pdpa)     │ │ (us-cpra)       │
  │  10 controls    │ │ 12 controls   │ │ 9 controls      │
  └─────────────────┘ └───────────────┘ └─────────────────┘
```

Install only the packs for countries you operate in. Each country scores independently in the dashboard.

---

## Available Packs (172 Total Controls)

### Universal Baseline

| Pack ID | Controls | Domains | Documentation |
|---------|----------|---------|---------------|
| `privacy-core` | 40 | 10 | [Privacy Core](privacy-core.md) |

### Europe

| Pack ID | Country | Controls | Law | Documentation |
|---------|---------|----------|-----|---------------|
| `uk-gdpr` | United Kingdom | 14 | UK GDPR + DPA 2018 | [Europe Packs](europe.md) |
| `ch-fadp` | Switzerland | 8 | revFADP 2023 | [Europe Packs](europe.md) |

### Asia-Pacific

| Pack ID | Country | Controls | Law | Documentation |
|---------|---------|----------|-----|---------------|
| `sg-pdpa` | Singapore | 12 | PDPA 2012 (amended 2020/2021) | [Asia-Pacific Packs](asia-pacific.md) |
| `ph-dpa` | Philippines | 10 | Data Privacy Act 2012 | [Asia-Pacific Packs](asia-pacific.md) |
| `jp-appi` | Japan | 10 | APPI (2022 amendment) | [Asia-Pacific Packs](asia-pacific.md) |
| `kr-pipa` | South Korea | 10 | PIPA (2023 amendment) | [Asia-Pacific Packs](asia-pacific.md) |
| `cn-pipl` | China | 11 | PIPL (2021) | [Asia-Pacific Packs](asia-pacific.md) |
| `in-dpdpa` | India | 8 | DPDPA (2023) | [Asia-Pacific Packs](asia-pacific.md) |

### Americas

| Pack ID | Country | Controls | Law | Documentation |
|---------|---------|----------|-----|---------------|
| `br-lgpd` | Brazil | 10 | LGPD (Law 13,709/2018) | [Americas Packs](americas.md) |
| `ca-pipeda` | Canada | 10 | PIPEDA (10 Fair Information Principles) | [Americas Packs](americas.md) |
| `us-cpra` | California, USA | 9 | CCPA/CPRA (2020) | [Americas Packs](americas.md) |

### Africa and Middle East

| Pack ID | Country | Controls | Law | Documentation |
|---------|---------|----------|-----|---------------|
| `za-popia` | South Africa | 8 | POPIA (Act 4 of 2013) | [Africa and Middle East Packs](africa-middle-east.md) |
| `ae-pdpl` | UAE | 6 | Federal Decree-Law 45/2021 | [Africa and Middle East Packs](africa-middle-east.md) |
| `sa-pdpl` | Saudi Arabia | 6 | PDPL (Royal Decree M/19, amended M/148/2023) | [Africa and Middle East Packs](africa-middle-east.md) |

---

## Country Selection During Init

When you run `ges init`, you are asked to select your project's country of origin. The matching privacy pack is auto-installed alongside `privacy-core`.

```bash
# Interactive
ges init

# Non-interactive with country flag
ges init --name "MyApp" --type saas --frameworks GDPR,OWASP --country BR
```

### Country Codes

| Code | Country | Pack |
|------|---------|------|
| `EU` | European Union (EEA) | gdpr |
| `GB` | United Kingdom | uk-gdpr |
| `CH` | Switzerland | ch-fadp |
| `SG` | Singapore | sg-pdpa |
| `PH` | Philippines | ph-dpa |
| `JP` | Japan | jp-appi |
| `KR` | South Korea | kr-pipa |
| `CN` | China | cn-pipl |
| `IN` | India | in-dpdpa |
| `BR` | Brazil | br-lgpd |
| `CA` | Canada | ca-pipeda |
| `US-CA` | California (USA) | us-cpra |
| `ZA` | South Africa | za-popia |
| `AE` | United Arab Emirates | ae-pdpl |
| `SA` | Saudi Arabia | sa-pdpl |

---

## Installing Additional Country Packs

If your project operates in multiple jurisdictions, install additional packs at any time:

```bash
ges policy install uk-gdpr
ges policy install sg-pdpa
```

Or use the MCP `suggest_packs` tool to get AI-driven recommendations based on codebase analysis.

---

## Control Structure

Every control across all packs follows the same structure:

| Field | Description |
|-------|-------------|
| **ID** | Unique identifier (e.g., `LGPD-01`, `PIPL-03`) |
| **Name** | Short descriptive name |
| **Description** | What the control requires |
| **Category** | One of 10 privacy domains (see below) |
| **Framework** | The privacy framework name (e.g., `LGPD`, `PIPL`) |
| **Severity** | `critical`, `high`, `medium`, or `low` |
| **Implementation Guidance** | Detailed instructions with legal article references |
| **Checks** | 2-4 specific verification items |

### Privacy Categories

| Category | Description |
|----------|-------------|
| `privacy-governance` | DPO appointment, policies, DPIAs, accountability |
| `data-inventory` | Data mapping, ROPA, classification, accuracy |
| `consent-management` | Consent collection, withdrawal, legal basis, purpose limitation |
| `data-subject-rights` | Access, correction, deletion, portability, objection |
| `security-controls` | Encryption, access control, safeguards |
| `incident-management` | Breach notification, incident response |
| `vendor-management` | Processor contracts, due diligence, outsourcing |
| `cross-border-transfers` | Transfer mechanisms, adequacy, data localization |
| `data-retention` | Retention schedules, disposal, minimization |
| `privacy-training` | Employee training, awareness programs |

---

!!! example "Exercise: Explore Your Country Pack"

    1. Find your country in the table above
    2. Install the pack:

    ```bash
    ges policy install <pack-id>
    ```

    3. Read through the controls:

    ```bash
    cat controls/<pack-id>/controls.json | python3 -m json.tool | less
    ```

    4. Run an audit to see your compliance score:

    ```bash
    ges audit
    ges score
    ```

    !!! question "Questions"
        - How many controls does your country pack have?
        - Which controls are marked `critical` severity?
        - Which legal articles are referenced in the implementation guidance?

!!! example "Exercise: Compare Two Countries"

    1. Install two country packs (e.g., your country and a neighboring country)
    2. Compare the breach notification timelines
    3. Compare the DSR response deadlines
    4. Note which controls exist in one but not the other

    | Aspect | Country A | Country B |
    |--------|-----------|-----------|
    | Breach notification deadline | | |
    | DSR response deadline | | |
    | Requires data localization? | | |
    | Has consent withdrawal? | | |
    | Requires local-language policy? | | |
