# 🔰 Green Engineering Standard Framework (GESF)

![GESF Compliance](badge.svg)
<!-- GESF-SCORE-START -->
> **GESF Compliance Score: 100% (A)**
>
> | Framework | Score | Grade | Controls |
> |-----------|-------|-------|----------|
> | GDPR | 100% | A | 22/22 passed |
> | OWASP | 100% | A | 6/6 passed |
> | CIS | 100% | A | 5/5 passed |
>
> _(Last evaluated: 2026-07-01)_
<!-- GESF-SCORE-END -->



Compliance-as-Code framework that automatically enforces GDPR, OWASP, NIST, and CIS engineering standards.

## Install

<details open>
<summary><b>🍺 &nbsp;Homebrew (macOS)</b></summary>

```bash
brew tap greenarmor/gesf
brew install ges
```

Installs Node.js automatically. One command, zero config.

</details>

<details>
<summary><b>📦 &nbsp;npm</b></summary>

```bash
npm install -g @greenarmor/ges
```

Requires Node.js >= 22. The `ges` command is available system-wide.

</details>

<details>
<summary><b>📦 &nbsp;pnpm</b></summary>

```bash
pnpm add -g @greenarmor/ges
```

</details>

<details>
<summary><b>⚡ &nbsp;npx (no install)</b></summary>

```bash
npx @greenarmor/ges init
```

Downloads and runs on demand. No global install. Best for CI/one-off use.

</details>

All methods produce the same `ges` CLI. Homebrew manages Node.js automatically. npm/pnpm require Node.js installed separately. npx requires nothing — it fetches everything at runtime.

<details>
<summary>Windows troubleshooting</summary>

If `ges` is not recognized after install, the npm global bin directory is not in your PATH:

```powershell
# Check where npm installs globals
npm config get prefix

# Use npx as a quick alternative (no PATH needed)
npx @greenarmor/ges --version

# Or add npm's prefix to PATH permanently
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$npmPrefix = "$(npm config get prefix)"
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;$npmPrefix", "User")
# Restart PowerShell, then:
ges --version
```

If you use nvm-windows, global packages don't carry over between Node versions — re-run `npm install -g @greenarmor/ges` after `nvm use`.

</details>

## Usage

```bash
cd your-project
ges init          # Set up GESF in your project
ges audit         # Scan for compliance issues
ges score         # View compliance score
ges infer         # AI-powered insights
ges dashboard     # Start web dashboard
```

## Quick Comparison

| Method | Install Command | Requires Node? | Best For |
|--------|:--|:---:|---|
| Homebrew | `brew tap greenarmor/gesf && brew install ges` | No (auto) | macOS developers |
| npm | `npm install -g @greenarmor/ges` | Yes (>=22) | JS/TS teams |
| pnpm | `pnpm add -g @greenarmor/ges` | Yes (>=22) | pnpm users |
| npx | `npx @greenarmor/ges <cmd>` | Yes (>=22) | One-off audits, CI |
