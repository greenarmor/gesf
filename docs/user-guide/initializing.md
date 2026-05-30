# Initializing Your Project

The first step to using GESF is initializing it in your project directory. This creates the compliance structure, generates documentation templates, and installs the policy packs appropriate for your project type.

## Interactive Mode

```bash
cd your-project
ges init
```

You will be prompted for three things:

1. **Project name** — Defaults to the directory name
2. **Project type** — Select from a list of 13 types
3. **Compliance frameworks** — Select which frameworks to enforce (space to toggle, enter to confirm)

Example interactive session:

```
  Green Engineering Standard Framework (GESF) v0.1.0
  ─────────────────────────────────────────────

? Project name: my-saas-app
? Select project type: SaaS
? Select compliance frameworks: (Press space to select)
  ◉ GDPR
  ◉ OWASP
  ❯◉ CIS
   ◉ NIST
```

## Non-Interactive Mode (CI/Scripts)

Skip all prompts with flags:

```bash
ges init --name "My SaaS App" --type saas --frameworks "GDPR,OWASP,CIS,NIST"
```

Or with short flags:

```bash
ges init -n "My API" -t api-backend -f "GDPR,OWASP"
```

## What Gets Generated

After running `ges init`, GESF creates the following:

| Directory/File | Purpose |
|---------------|---------|
| `.ges/config.yaml` | Human-readable project configuration |
| `.ges/config.json` | Machine-readable project configuration |
| `.ges/metadata.json` | Project metadata (name, type, version, timestamps) |
| `.ges/score.json` | Compliance score data (updated by `ges audit`) |
| `.ges/framework-version.json` | Policy pack version tracking |
| `compliance/` | 7 GDPR/compliance document templates |
| `security/` | 7 security policy document templates |
| `controls/` | JSON files with all control definitions per policy pack |
| `policies/` | Policy definitions |
| `checklists/` | Compliance checklists |
| `docs/` | Additional documentation |
| `reports/` | Generated reports (output directory) |
| `.github/workflows/` | 4 CI/CD security workflows |

If you run `ges init` in a directory that already has a `.ges/` folder, it will refuse to overwrite and exit with an error.

## Choosing a Project Type

The project type determines which policy packs are installed:

| Type | Flag Value | Policy Packs |
|------|-----------|--------------|
| SaaS | `saas` | GDPR, OWASP, CIS, NIST |
| AI Application | `ai-application` | GDPR, OWASP, AI |
| MCP Server | `mcp-server` | GDPR, AI |
| Blockchain | `blockchain` | GDPR, Blockchain |
| Wallet | `wallet` | GDPR, Blockchain |
| Government System | `government-system` | GDPR, Government |
| Healthcare System | `healthcare-system` | GDPR, OWASP, CIS |
| Event Platform | `event-platform` | GDPR, OWASP |
| Photo Storage Platform | `photo-storage-platform` | GDPR, OWASP |
| Vulnerability Scanner | `vulnerability-scanner` | GDPR, OWASP |
| Generic Web Application | `generic-web-application` | GDPR, OWASP, CIS |
| API Backend | `api-backend` | GDPR, OWASP |
| Mobile Application | `mobile-application` | GDPR, OWASP |

!!! tip "Not sure which type to pick?"

    Choose **`generic-web-application`** for any web-based project. You can always install additional policy packs later with `ges policy install <pack-id>`.

## Choosing Frameworks

| Framework | Controls | What It Covers |
|-----------|----------|---------------|
| **GDPR** | 22 controls | Articles 5, 25, 30, 32, 33, 34 |
| **OWASP ASVS** | 6 controls | Input validation, auth, secrets, encryption |
| **CIS Controls** | 5 controls | Asset management, configuration, vulnerability mgmt |
| **NIST CSF** | 6 controls | Identify, Protect, Detect, Respond, Recover |
| **AI System** | 6 controls | Prompt logging, PII detection, output validation |
| **Blockchain** | 6 controls | Signatures, key rotation, on-chain data rules |
| **Government** | 5 controls | Data sovereignty, chain of custody, tamper evidence |

!!! example "Exercise: Initialize Three Different Project Types"

    Create three test projects with different types and compare what gets installed:

    ```bash
    # SaaS — gets GDPR, OWASP, CIS, NIST
    mkdir /tmp/saas-app && cd /tmp/saas-app && echo '{"name":"saas"}' > package.json
    ges init -n "SaaS App" -t saas -f "GDPR,OWASP,CIS,NIST"
    ls controls/

    # AI Application — gets GDPR, OWASP, AI
    mkdir /tmp/ai-app && cd /tmp/ai-app && echo '{"name":"ai"}' > package.json
    ges init -n "AI App" -t ai-application -f "GDPR,OWASP"
    ls controls/

    # Blockchain — gets GDPR, Blockchain
    mkdir /tmp/chain-app && cd /tmp/chain-app && echo '{"name":"chain"}' > package.json
    ges init -n "Chain App" -t blockchain -f "GDPR"
    ls controls/
    ```

    Observe how each project type installs different control packs in `controls/`.
