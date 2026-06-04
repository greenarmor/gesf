# Using GESF with Code Assistants

Practical guide for using GESF's MCP integration with each supported AI assistant. Each section includes setup instructions, example prompts, and hands-on exercises.

## Claude Desktop

### Setup

```bash
ges mcp setup claude
```

Then quit and reopen Claude Desktop.

### How to Use

1. Start a new conversation
2. Ask compliance questions in natural language
3. Claude will automatically call GESF tools when it detects a compliance question
4. You do not need to mention "GESF" or "MCP" — just ask naturally

### Example Session

```
You: I'm building a SaaS app called "DataVault". Are we GDPR compliant?

Claude: Let me check your compliance status.
[Calls check_compliance with project_type: "saas"]

Your GDPR compliance is at 72%. Here's the breakdown:
- 16/22 controls are passing
- 4 controls are failing
- 2 controls have warnings

Would you like me to show the missing controls?

You: Yes, show me what's missing.

Claude: [Calls list_missing_controls with framework: "GDPR"]

Here are the GDPR controls that need attention:
1. [CRITICAL] Encryption at Rest — Your data is not encrypted at rest
2. [CRITICAL] Audit Logging — Missing audit trail implementation
3. [HIGH] Session Timeout — No automatic session expiration
4. [HIGH] Storage Limitation — No data retention policy in place

You: Generate a retention policy for DataVault.

Claude: [Calls generate_retention_policy with project_name: "DataVault"]

Here's your retention policy:
...
```

!!! example "Exercise: Full Compliance Audit with Claude"

    Open Claude Desktop and complete this conversation sequence. Copy each prompt one at a time:

    **Step 1 — Check status:**
    ```
    I'm building a SaaS platform called "MyApp" that stores user data.
    Check our GDPR compliance.
    ```

    **Step 2 — Identify gaps:**
    ```
    What GDPR controls are we missing?
    ```

    **Step 3 — Understand OWASP gaps too:**
    ```
    Now show me the missing OWASP controls.
    ```

    **Step 4 — Generate documents:**
    ```
    Generate a retention policy and incident response plan for MyApp.
    ```

    **Step 5 — Full remediation package:**
    ```
    Now generate a risk assessment and DPA for MyApp as well.
    ```

    Record:
    - Did Claude call the correct tool for each prompt?
    - How many tool calls were made in total?
    - Did Claude maintain context across the conversation?

### Tips

- Be specific about your project type for accurate compliance checks
- Ask follow-up questions to drill into specific controls
- Request generated documents by name
- Claude maintains conversation context — build on previous answers

---

## VS Code (Copilot)

### Setup

```bash
ges mcp setup vscode
```

This creates `.vscode/mcp.json` in your project. Then reload the VS Code window.

!!! danger "Invalid config causes startup errors"

    Do **not** add `cwd`, `envFile`, `sandboxEnabled`, `dev`, or `inputs` to `.vscode/mcp.json`. These fields are not supported in MCP configs and will cause `CodeExpectedError: Variable 'cwd' must be defined` on startup. If you see this error, re-run `ges mcp setup vscode` to regenerate a clean config.

### How to Use

1. Open Copilot Chat (`Cmd+I` or click the chat icon)
2. Switch to **Agent mode** (required for MCP tool use)
3. Click the tools icon (hammer/wrench) to verify `gesf` appears
4. Ask compliance questions while working in your code

### Example: Inline Compliance Check

While reviewing code in VS Code, highlight a file and ask:

```
@workspace Are there any GDPR compliance issues in this project?
```

Copilot calls `check_compliance` and `list_missing_controls` to give you a report right in the editor.

### Example: Pre-Commit Review

Before committing changes:

```
I've updated src/auth.ts to use argon2 hashing. Check if our
OWASP compliance improved and show any remaining issues.
```

!!! example "Exercise: Compliance-Guided Development in VS Code"

    Complete this workflow inside VS Code Copilot Chat (Agent mode):

    **Step 1 — Open a project in VS Code and check compliance:**
    ```
    @workspace Check our GDPR compliance status for this project.
    ```

    **Step 2 — Ask about specific code:**
    ```
    @workspace Look at the authentication code. Are we following
    GDPR Article 32 security of processing requirements?
    ```

    **Step 3 — Get actionable recommendations:**
    ```
    @workspace Show me the missing GDPR controls and suggest
    code changes to fix the critical ones.
    ```

    **Step 4 — Generate missing documents:**
    ```
    Generate a retention policy for this project.
    ```

    **Step 5 — Verify after fixes:**
    After making suggested changes:
    ```
    @workspace Re-check our compliance. Has anything improved?
    ```

    !!! question "Questions"
        - Did Copilot use the GESF tools or try to answer without them?
        - Were the code suggestions aligned with the missing controls?
        - Did `@workspace` context help Copilot give better answers?

!!! example "Exercise: Compare Chat vs Agent Mode"

    Try the same prompt in both modes:

    **In Chat mode (no tools):**
    ```
    What GDPR controls might this project be missing?
    ```

    **In Agent mode (with tools):**
    ```
    What GDPR controls are we missing?
    ```

    Compare:
    - Which mode gave a project-specific answer?
    - Which mode cited actual control IDs?
    - Why does Agent mode produce better results for compliance questions?

### Tips

- **Agent mode is required** — tools won't work in standard chat mode
- The config is project-level (`.vscode/mcp.json`), so each project needs its own setup
- Use `@workspace` to give Copilot context about your full codebase
- Combine tool results with Copilot's code analysis for best results

---

## Cursor

### Setup

```bash
ges mcp setup cursor
```

This creates `.cursor/mcp.json`. Then restart Cursor.

### How to Use

1. Open Cursor's AI chat panel
2. GESF tools are available automatically
3. Ask compliance questions in natural language

### Example: Compliance-Aware Code Generation

```
I need to add a new API endpoint that returns user profiles.
Check our GDPR compliance and make sure the endpoint follows
all required controls, especially around audit logging and
data minimisation.
```

Cursor will call `check_compliance` and `list_missing_controls`, then generate code that satisfies the relevant controls.

!!! example "Exercise: Compliance-Driven Feature Development in Cursor"

    **Step 1 — Set the compliance context:**
    ```
    We're building a SaaS app called "DataVault". Check our
    compliance and show missing GDPR controls.
    ```

    **Step 2 — Ask Cursor to write compliant code:**
    ```
    Write a user registration endpoint that satisfies all the
    missing GDPR controls you identified. Include proper audit
    logging, input validation, and encryption.
    ```

    **Step 3 — Verify the generated code:**
    ```
    Review the code you just wrote against the GDPR controls.
    Are there any remaining gaps?
    ```

    **Step 4 — Generate missing documents:**
    ```
    Generate an incident response plan for DataVault.
    ```

    !!! question "Questions"
        - Did Cursor proactively use GESF tools, or did you have to explicitly ask?
        - Was the generated code compliant with the identified controls?
        - Could Cursor fix its own compliance gaps when asked?

### Tips

- Cursor's agent mode can also edit files based on GESF recommendations
- Ask "Fix the GDPR compliance issues in src/config.ts" for combined audit + fix suggestions
- Use Cursor's composer/agent mode for multi-file compliance fixes

---

## OpenCode

### Setup

```bash
ges mcp setup opencode
```

Creates `opencode.json` in the project root or global config. Then restart OpenCode.

### How to Use

GESF tools are available in the AI session. Ask compliance questions naturally.

!!! example "Exercise: OpenCode Compliance Session"

    Start an OpenCode session in your project directory and try:

    **Step 1 — Check project compliance:**
    ```
    Check compliance for this project.
    ```

    **Step 2 — Find gaps:**
    ```
    What GDPR controls are we missing?
    ```

    **Step 3 — Generate documents:**
    ```
    Generate a risk assessment and retention policy for this project.
    ```

    **Step 4 — Compound request:**
    ```
    Check our OWASP compliance, show missing controls, and generate
    an incident response plan.
    ```

---

## Crush

### Setup

```bash
ges mcp setup crush
```

Modifies `~/.local/share/crush/crush.json` (global). Adds the `mcp.gesf` entry with `"type": "stdio"`. Then restart Crush.

### How to Use

GESF tools appear in the available tools list. Use them in any Crush session.

!!! example "Exercise: Crush Compliance Workflow"

    Start a Crush session and try:

    **Step 1 — Verify connection:**
    ```
    Check our GDPR compliance for a SaaS application.
    ```

    If you get a compliance score, the MCP server is working.

    **Step 2 — Deep dive:**
    ```
    Show me every missing GDPR and NIST control, then generate
    a complete risk assessment.
    ```

    **Step 3 — Document generation:**
    ```
    Generate all compliance documents we need: retention policy,
    incident response plan, risk assessment, and DPA. Project
    name is "MyApp".
    ```

    Record how many tools were called in total.

### Tips

- Check `crush_info` to verify the MCP server is connected
- The config is global — GESF is available in all Crush sessions
- The CLI automatically adds `"type": "stdio"` required by Crush's MCP format

---

## Windsurf

### Setup

```bash
ges mcp setup windsurf
```

Creates `.windsurf/mcp.json` in your project. Then restart Windsurf.

### How to Use

Open the AI chat and ask compliance questions. GESF tools are available automatically.

!!! example "Exercise: Windsurf Cascade with GESF"

    Use Windsurf's Cascade feature with GESF tools:

    **Step 1 — Compliance check:**
    ```
    Check our compliance for an API backend project and show
    all missing controls.
    ```

    **Step 2 — Fix with Cascade:**
    ```
    Based on the missing controls, fix our code to satisfy
    the GDPR encryption and audit logging requirements.
    ```

    **Step 3 — Verify:**
    ```
    Re-check our compliance. Did the fixes help?
    ```

---

## General Best Practices

Regardless of which assistant you use:

### 1. Be Specific About Your Project Type

"Check compliance for an AI application" is better than "Are we compliant?"

The project type determines which policy packs apply and what controls are evaluated.

### 2. Name Your Project

Generated documents use the project name you provide. "Generate a DPA for DataVault" produces better results than "Generate a DPA".

### 3. Chain Tools with Compound Prompts

Instead of asking one question at a time, combine them:

```
Check compliance, show missing GDPR controls, and generate
a risk assessment and retention policy.
```

### 4. Use Alongside the CLI

MCP is for real-time guidance while coding. The CLI (`ges audit`) is for thorough scanning. Use both:

```bash
# Before starting to code
ges audit

# While coding, ask your assistant compliance questions

# After making changes
ges audit
```

### 5. Re-Audit After AI-Suggested Fixes

Always run `ges audit` to verify that fixes suggested by the AI actually resolved findings. AI assistants can make mistakes — the audit provides ground truth.

### 6. Iterate on Generated Documents

Documents generated by the MCP tools are **templates**. Ask your assistant to refine them:

```
That retention policy looks good, but we also need to cover
email marketing data with a 30-day retention period. Update it.
```

!!! example "Exercise: Compare AI Assistants"

    If you have access to multiple AI assistants, try the same prompt in each:

    ```
    We're building a healthcare application called "MedTrack".
    Check our compliance, show missing GDPR controls, and generate
    a risk assessment.
    ```

    Compare:
    - Which assistant gave the most detailed response?
    - Which one suggested actionable next steps?
    - Did any assistant make up information instead of using the tools?
    - Which one chained all three tool calls correctly?

!!! example "Exercise: The Full Compliance Sprint"

    Simulate a complete compliance sprint using only your AI assistant (no CLI commands):

    **Hour 1 — Assessment:**
    ```
    I'm building a SaaS platform called "CloudMetrics" that processes
    EU user data, stores files in S3, and uses AI for analytics.
    Check our compliance for saas type and show missing controls
    for GDPR, OWASP, and NIST.
    ```

    **Hour 2 — Documentation:**
    ```
    Generate all compliance documents we need for our audit:
    retention policy, incident response plan, risk assessment,
    and DPA. All for "CloudMetrics".
    ```

    **Hour 3 — Code Review:**
    ```
    Based on the missing controls you identified, review our
    codebase and list the specific files that need changes to
    achieve compliance.
    ```

    **Hour 4 — Verification:**
    ```
    Re-check our compliance. Based on the documents we generated
    and code changes we discussed, what should our new score be?
    ```

    !!! question "Reflection"
        - Could you complete a full compliance assessment using only the AI assistant?
        - At what point did you need to fall back to the CLI?
        - What additional tools would make the MCP integration more useful?
