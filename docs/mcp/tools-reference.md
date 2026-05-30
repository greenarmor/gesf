# MCP Tools Reference

Once configured, the GESF MCP server provides 6 tools to your AI assistant.

## Tool Overview

| Tool | Description | Parameters |
|------|-------------|------------|
| `check_compliance` | Check GDPR compliance status for a project type | `project_type` (string) |
| `list_missing_controls` | Show compliance controls that are not passing | `framework` (string) |
| `generate_retention_policy` | Generate a data retention policy template | `project_name` (string) |
| `generate_incident_response` | Generate an incident response plan template | `project_name` (string) |
| `generate_risk_assessment` | Generate a risk assessment template | `project_name` (string) |
| `generate_dpa` | Generate a Data Processing Agreement template | `project_name` (string) |

---

## `check_compliance`

Returns the compliance score for a given project type, showing which policy packs apply and their control status.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_type` | string | No | Project type (default: `saas`) |

**Valid `project_type` values:**

`saas`, `ai-application`, `mcp-server`, `blockchain`, `wallet`, `government-system`, `healthcare-system`, `event-platform`, `photo-storage-platform`, `vulnerability-scanner`, `generic-web-application`, `api-backend`, `mobile-application`

**Example prompt:**

```
Check compliance status for a SaaS application.
```

**Example response:**

```
  GDPR ................ 72%
  OWASP ............... 65%
  Overall ............. 69%
```

---

## `list_missing_controls`

Shows compliance controls that are not in a passing state for a given framework.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `framework` | string | No | Framework name (default: `GDPR`) |

**Valid `framework` values:** `GDPR`, `OWASP`, `CIS`, `NIST`

**Example prompt:**

```
Show me missing GDPR controls.
```

**Example response:**

```
- [CRITICAL] GDPR-ART32-002: Encryption at Rest
- [CRITICAL] GDPR-ART32-006: Audit Logging
- [HIGH] GDPR-ART32-005: Automatic Session Timeout
- [HIGH] GDPR-ART5-005: Storage Limitation
```

---

## `generate_retention_policy`

Generates a data retention policy template with standard retention periods.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

**Example prompt:**

```
Generate a retention policy for My SaaS App.
```

---

## `generate_incident_response`

Generates an incident response plan template with severity levels and GDPR breach notification timelines.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

**Example prompt:**

```
Generate an incident response plan for Project Alpha.
```

---

## `generate_risk_assessment`

Generates a risk assessment template with common risk categories and mitigation strategies.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

**Example prompt:**

```
Generate a risk assessment for our healthcare platform.
```

---

## `generate_dpa`

Generates a Data Processing Agreement template based on GDPR Article 28 requirements.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

**Example prompt:**

```
Generate a Data Processing Agreement for Customer Portal.
```

---

## Combining Tools

AI assistants can call multiple tools in sequence. Try compound prompts:

```
We're building a new SaaS platform called "CloudMetrics".
Check our compliance status, show what's missing for GDPR,
and generate a risk assessment and retention policy.
```

The assistant will:
1. Call `check_compliance` with `project_type: "saas"`
2. Call `list_missing_controls` with `framework: "GDPR"`
3. Call `generate_risk_assessment` with `project_name: "CloudMetrics"`
4. Call `generate_retention_policy` with `project_name: "CloudMetrics"`

!!! example "Exercise: Test Every Tool"

    In your AI assistant, try each tool one at a time. Record the response:

    | Prompt Used | Tool Called | Response Quality |
    |-------------|------------|-----------------|
    | "Are we GDPR compliant?" | | |
    | "Show missing OWASP controls" | | |
    | "Generate a retention policy for MyApp" | | |
    | "Generate an incident response plan for MyApp" | | |
    | "Generate a risk assessment for MyApp" | | |
    | "Generate a DPA for MyApp" | | |

    !!! question "Questions"
        - Which tool produces the most detailed response?
        - Which tool would be most useful during an audit?
        - Can you think of a tool that's missing? What would it do?

!!! example "Exercise: Multi-Tool Workflow"

    Ask your AI assistant to perform a complete compliance check with a single prompt:

    ```
    I'm building a healthcare application called "MedTrack".
    Check compliance for healthcare-system type, list all
    missing GDPR controls, and generate both a risk assessment
    and a data processing agreement.
    ```

    Observe how the assistant chains multiple tool calls together.
