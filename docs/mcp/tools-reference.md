# MCP Tools Reference

Once configured, the GESF MCP server provides 6 tools to your AI assistant. This page documents every tool with exact prompts you can copy and paste into your AI assistant.

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

### Prompts to Try

=== "Basic Check"

    ```
    Are we GDPR compliant?
    ```

    The assistant calls `check_compliance` with `project_type: "saas"` (default).

=== "Specific Project Type"

    ```
    Check compliance status for a healthcare application.
    ```

    The assistant calls `check_compliance` with `project_type: "healthcare-system"`.

=== "AI Application"

    ```
    I'm building an AI application. What's our compliance posture?
    ```

    The assistant calls `check_compliance` with `project_type: "ai-application"`.

=== "Blockchain Project"

    ```
    We have a blockchain wallet project. Check our compliance.
    ```

    The assistant calls `check_compliance` with `project_type: "wallet"`.

**Example response:**

```
  GDPR ................ 72%
  OWASP ............... 65%
  CIS ................. 80%
  NIST ................ 58%
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

### Prompts to Try

=== "GDPR Gaps"

    ```
    Show me missing GDPR controls.
    ```

    The assistant calls `list_missing_controls` with `framework: "GDPR"`.

=== "OWASP Gaps"

    ```
    What OWASP controls are we failing?
    ```

    The assistant calls `list_missing_controls` with `framework: "OWASP"`.

=== "CIS Controls"

    ```
    List missing CIS controls for our project.
    ```

    The assistant calls `list_missing_controls` with `framework: "CIS"`.

=== "NIST Posture"

    ```
    What NIST CSF controls do we need to implement?
    ```

    The assistant calls `list_missing_controls` with `framework: "NIST"`.

**Example response:**

```
- [CRITICAL] GDPR-ART32-002: Encryption at Rest
  Implement AES-256-GCM encryption for all stored personal data.

- [CRITICAL] GDPR-ART32-006: Audit Logging
  Implement audit trail for all access to personal data.

- [HIGH] GDPR-ART32-005: Automatic Session Timeout
  Configure automatic session expiration after 30 minutes of inactivity.

- [HIGH] GDPR-ART5-005: Storage Limitation
  Implement a data retention policy with defined retention periods.
```

---

## `generate_retention_policy`

Generates a data retention policy template with standard retention periods aligned to GDPR Article 5(1)(e) storage limitation principle.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

### Prompts to Try

=== "Simple"

    ```
    Generate a retention policy for My SaaS App.
    ```

=== "Contextual"

    ```
    We're building a SaaS platform called "CloudMetrics" that stores
    user data, billing records, and audit logs. Generate a retention
    policy that covers all these data categories.
    ```

=== "Post-Audit"

    ```
    Our GDPR compliance check showed we're missing a retention policy.
    Generate one for our project "DataVault".
    ```

**What the generated policy includes:**

- Purpose and scope
- Data categories with specific retention periods
- Disposal procedures
- Legal basis references
- Review schedule

---

## `generate_incident_response`

Generates an incident response plan template with severity levels, response procedures, and GDPR breach notification timelines (72-hour requirement from Article 33).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

### Prompts to Try

=== "Simple"

    ```
    Generate an incident response plan for Project Alpha.
    ```

=== "Contextual"

    ```
    Our healthcare platform "MedTrack" handles patient data.
    Create an incident response plan that covers GDPR breach
    notification requirements and HIPAA considerations.
    ```

=== "Emergency Preparation"

    ```
    We need to prepare for potential data breaches. Generate
    a comprehensive incident response plan for "SecurePay"
    that includes the 72-hour GDPR notification timeline.
    ```

**What the generated plan includes:**

- Severity classification (Critical, High, Medium, Low)
- Response team roles and responsibilities
- Detection and triage procedures
- Containment and eradication steps
- GDPR Article 33 notification timeline (72 hours)
- GDPR Article 34 data subject communication
- Post-incident review template

---

## `generate_risk_assessment`

Generates a risk assessment template with common risk categories, likelihood/impact ratings, and mitigation strategies.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

### Prompts to Try

=== "Simple"

    ```
    Generate a risk assessment for our healthcare platform.
    ```

=== "Contextual"

    ```
    We process payment card data and personal information in
    our e-commerce platform "ShopSecure". Generate a risk
    assessment covering data breach, unauthorized access, and
    compliance violation scenarios.
    ```

=== "Post-Compliance Check"

    ```
    Our compliance check showed several failing controls.
    Generate a risk assessment for "DataVault" that accounts
    for our current compliance gaps.
    ```

**What the generated assessment includes:**

- Risk register with categories (operational, technical, compliance, legal)
- Likelihood and impact ratings (1-5 scale)
- Risk score matrix
- Mitigation strategies per risk
- Residual risk acceptance
- Review schedule

---

## `generate_dpa`

Generates a Data Processing Agreement template based on GDPR Article 28 requirements. A DPA is the legally required contract between a data controller and data processor.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

### Prompts to Try

=== "Simple"

    ```
    Generate a Data Processing Agreement for Customer Portal.
    ```

=== "Vendor Relationship"

    ```
    We're hiring a cloud provider to process customer data for
    "DataVault". Generate a DPA that covers Article 28 requirements
    including sub-processor management and data deletion obligations.
    ```

=== "Multi-Party"

    ```
    Generate a DPA for our platform "CloudMetrics" where we act
    as both a data controller (for our own users) and a data
    processor (for our enterprise customers' data).
    ```

**What the generated DPA includes:**

- Parties and roles (controller, processor, sub-processor)
- Processing scope and purposes
- Data subject rights handling
- Security measures (Article 32)
- Breach notification obligations
- Sub-processor management
- Data deletion and return
- Audit rights
- Liability and indemnification

---

## Combining Tools — Real-World Prompt Patterns

AI assistants can call multiple tools in sequence. Here are compound prompts that chain tools together for real-world compliance workflows:

### Pattern 1: New Project Compliance Kickoff

```
I'm starting a new SaaS platform called "CloudMetrics" that will
process EU user data. Check our compliance status, show what's
missing for GDPR, and generate a risk assessment.
```

The assistant will:
1. Call `check_compliance` with `project_type: "saas"`
2. Call `list_missing_controls` with `framework: "GDPR"`
3. Call `generate_risk_assessment` with `project_name: "CloudMetrics"`

### Pattern 2: Pre-Audit Document Package

```
We have an upcoming GDPR audit for "DataVault". Generate all
the documents we'll need: retention policy, incident response
plan, risk assessment, and a DPA template.
```

The assistant will call all 4 generation tools with `project_name: "DataVault"`.

### Pattern 3: Gap Analysis and Remediation Plan

```
Check compliance for our healthcare application. Then show me
what's missing for both GDPR and NIST frameworks, and generate
a risk assessment that accounts for those gaps.
```

The assistant will:
1. Call `check_compliance` with `project_type: "healthcare-system"`
2. Call `list_missing_controls` with `framework: "GDPR"`
3. Call `list_missing_controls` with `framework: "NIST"`
4. Call `generate_risk_assessment` with `project_name: "MedTrack"`

### Pattern 4: Vendor Onboarding

```
We're onboarding a new payment processor for "ShopSecure".
Check our compliance, generate a DPA, and create a risk
assessment for the vendor relationship.
```

### Pattern 5: Incident Preparation

```
We had a near-miss security incident today. Check our current
compliance posture, generate an incident response plan, and
create a risk assessment for our platform "SecurePay".
```

---

## Prompt Writing Tips

### Good Prompts

| Prompt | Why It Works |
|--------|-------------|
| "Check compliance for a SaaS application" | Specific project type triggers accurate results |
| "Show missing GDPR controls" | Explicit framework name avoids ambiguity |
| "Generate a DPA for DataVault" | Project name personalizes the document |
| "Check compliance, show missing OWASP controls, and generate a risk assessment for CloudMetrics" | Compound prompt chains multiple tools |

### Bad Prompts

| Prompt | Why It Fails |
|--------|-------------|
| "Is everything ok?" | Too vague — no compliance context |
| "Tell me about security" | No specific question for a tool to answer |
| "Fix my code" | GESF tools analyze compliance, they don't edit code |

### Getting the Best Results

1. **Always name your project** — Generated documents use the project name
2. **Specify the project type** — "SaaS", "healthcare", "blockchain" — for accurate compliance checks
3. **Name the framework** — "GDPR", "OWASP", "CIS", "NIST" — for targeted control analysis
4. **Chain requests** — Ask for compliance check + gap analysis + document generation in one prompt
5. **Be specific about context** — "We process healthcare data" produces better risk assessments than "generate a risk assessment"

!!! example "Exercise: Test Every Tool Individually"

    In your AI assistant, try each tool one at a time. Record the response:

    | # | Prompt Used | Tool Called | Response Quality (1-5) |
    |---|-------------|------------|----------------------|
    | 1 | "Are we GDPR compliant?" | | |
    | 2 | "Show missing OWASP controls" | | |
    | 3 | "Show missing NIST controls" | | |
    | 4 | "Show missing CIS controls" | | |
    | 5 | "Generate a retention policy for MyApp" | | |
    | 6 | "Generate an incident response plan for MyApp" | | |
    | 7 | "Generate a risk assessment for MyApp" | | |
    | 8 | "Generate a DPA for MyApp" | | |

    !!! question "Questions"
        - Which tool produces the most detailed response?
        - Which tool would be most useful during a real audit?
        - Did the assistant always call the correct tool, or did it sometimes answer without using a tool?

!!! example "Exercise: Compound Prompt Progression"

    Start with a simple prompt, then add complexity. See how the assistant handles each:

    **Round 1 — Single tool:**
    ```
    Check compliance for a SaaS application.
    ```

    **Round 2 — Two tools:**
    ```
    Check compliance for a SaaS application called "CloudMetrics"
    and show missing GDPR controls.
    ```

    **Round 3 — Three tools:**
    ```
    Check compliance for a SaaS application called "CloudMetrics",
    show missing GDPR controls, and generate a risk assessment.
    ```

    **Round 4 — Full workflow:**
    ```
    I'm building a SaaS platform called "CloudMetrics".
    Check our compliance, show missing controls for GDPR,
    OWASP, and NIST, then generate a retention policy,
    incident response plan, and DPA.
    ```

    Observe:
    - How many tool calls does the assistant make in each round?
    - Does the assistant maintain context between calls?
    - Does the compound prompt produce better results than individual calls?

!!! example "Exercise: Multi-Tool Workflow"

    Ask your AI assistant to perform a complete compliance check with a single prompt:

    ```
    I'm building a healthcare application called "MedTrack".
    Check compliance for healthcare-system type, list all
    missing GDPR controls, and generate both a risk assessment
    and a data processing agreement.
    ```

    Observe how the assistant chains multiple tool calls together.

!!! example "Exercise: Prompt Engineering Challenge"

    Try to trigger all 6 tools with a single prompt:

    ```
    We're launching "SecureBank", a financial SaaS platform.
    We need a full compliance review: check our status, show
    every missing control across all frameworks, and generate
    all policy documents (retention policy, incident response,
    risk assessment, and DPA).
    ```

    Count:
    - How many tool calls did the assistant make?
    - Were all 6 tools called?
    - Which tools were missed, if any?

!!! example "Exercise: Wrong Project Type Experiment"

    Try checking compliance with different project types and compare:

    ```
    Check compliance for a blockchain wallet project.
    ```

    vs

    ```
    Check compliance for a government system.
    ```

    vs

    ```
    Check compliance for a SaaS application.
    ```

    !!! question "Questions"
        - How do the policy packs differ between project types?
        - Which project type has the most controls to satisfy?
        - Which controls are common across all project types?

!!! example "Exercise: Document Quality Comparison"

    Generate the same document twice with different context:

    **Without context:**
    ```
    Generate a risk assessment for MyApp.
    ```

    **With context:**
    ```
    We run "MyApp", a photo storage platform that processes
    biometric data (face detection), stores images in S3, uses
    AI for image tagging, and serves EU customers. Generate
    a risk assessment covering all these specific areas.
    ```

    Compare the two outputs — does context improve the quality?
