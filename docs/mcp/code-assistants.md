# Using GESF with Code Assistants

Practical guide for using GESF's MCP integration with each supported AI assistant.

## Claude Desktop

### Setup

```bash
ges mcp setup claude
```

Then quit and reopen Claude Desktop.

### Usage

1. Start a new conversation
2. Ask compliance questions in natural language
3. Claude will automatically call GESF tools when relevant

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

### Tips

- Be specific about your project type for accurate compliance checks
- Ask follow-up questions to drill into specific controls
- Request generated documents by name

---

## VS Code (Copilot)

### Setup

```bash
ges mcp setup vscode
```

This creates `.vscode/mcp.json` in your project. Then reload the VS Code window.

### Usage

1. Open Copilot Chat
2. Switch to **Agent mode** (required for MCP tool use)
3. Click the tools icon (hammer/wrench) to verify `gesf` appears
4. Ask compliance questions while working in your code

### Example: Inline Compliance Check

While reviewing code in VS Code:

```
You: @workspace Are there any GDPR compliance issues in this project?

Copilot: [Calls check_compliance and list_missing_controls]
```

### Tips

- Agent mode is required — tools won't work in standard chat mode
- The config is project-level (`.vscode/mcp.json`), so each project needs its own setup
- Use `@workspace` to give Copilot context about your full codebase

---

## Cursor

### Setup

```bash
ges mcp setup cursor
```

This creates `.cursor/mcp.json`. Then restart Cursor.

### Usage

1. Open Cursor's AI chat panel
2. GESF tools are available automatically
3. Ask compliance questions

### Tips

- Cursor's agent mode can also edit files based on GESF recommendations
- Ask "Fix the GDPR compliance issues in src/config.ts" for combined audit + fix suggestions

---

## OpenCode

### Setup

```bash
ges mcp setup opencode
```

Creates `opencode.json` in the project root or global config. Then restart OpenCode.

### Usage

GESF tools are available in the AI session. Ask compliance questions naturally.

---

## Crush

### Setup

```bash
ges mcp setup crush
```

Modifies `~/.local/share/crush/crush.json` (global). Then restart Crush.

### Usage

GESF tools appear in the available tools list. Use them in any Crush session.

### Tips

- Check `crush_info` to verify the MCP server is connected
- The config is global — GESF is available in all Crush sessions

---

## Windsurf

### Setup

```bash
ges mcp setup windsurf
```

Creates `.windsurf/mcp.json` in your project. Then restart Windsurf.

### Usage

Open the AI chat and ask compliance questions. GESF tools are available automatically.

---

## General Best Practices

Regardless of which assistant you use:

1. **Be specific about your project type** — "Check compliance for an AI application" is better than "Are we compliant?"
2. **Name your project** — Generated documents use the project name you provide
3. **Chain tools with compound prompts** — "Check compliance, show missing GDPR controls, and generate a risk assessment"
4. **Use alongside the CLI** — MCP is for real-time guidance; CLI (`ges audit`) is for thorough scanning
5. **Re-audit after AI-suggested fixes** — Always run `ges audit` to verify fixes actually resolved findings

!!! example "Exercise: Compare AI Assistants"

    If you have access to multiple AI assistants, try the same prompt in each:

    ```
    Check compliance for a SaaS application and show
    missing GDPR controls.
    ```

    Compare:
    - Which assistant gave the most detailed response?
    - Which one suggested actionable next steps?
    - Did any assistant make up information instead of using the tools?

!!! example "Exercise: Real-World Compliance Conversation"

    Have an extended conversation with your AI assistant about compliance:

    ```
    Round 1: "What compliance frameworks should a healthcare SaaS follow?"
    Round 2: "Check compliance for a healthcare-system project."
    Round 3: "Show missing controls for GDPR."
    Round 4: "Generate a risk assessment for MedTrack."
    Round 5: "Generate an incident response plan for MedTrack."
    Round 6: "Generate a data processing agreement for MedTrack."
    Round 7: "Summarize what I need to do to become GDPR compliant."
    ```

    Evaluate the quality and completeness of the assistant's compliance guidance.
