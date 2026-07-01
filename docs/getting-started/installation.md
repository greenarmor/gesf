# Installation

GESF can be installed several ways — pick the one that fits your workflow. All methods produce the same `ges` CLI.

## Option 1 — Homebrew (macOS, Recommended)

Installs Node.js and GESF in one command. Best for macOS developers.

```bash
brew tap greenarmor/gesf
brew install ges
```

This installs `@greenarmor/ges` globally via npm and symlinks the binary. Node.js >= 22 is installed automatically as a dependency.

## Option 2 — npm (Global Install)

Best for teams already using npm. Requires Node.js >= 22.

```bash
npm install -g @greenarmor/ges
```

Or with pnpm:

```bash
pnpm add -g @greenarmor/ges
```

After installation, the `ges` command is available system-wide.

## Option 3 — npx (Run Without Installing)

Download and run on demand. No global install. Best for one-off audits or CI pipelines.

```bash
npx @greenarmor/ges init
npx @greenarmor/ges audit
npx @greenarmor/ges score
```

Or with pnpm:

```bash
pnpm dlx @greenarmor/ges init
```

## Option 4 — Install from Source

For developers contributing to GESF.

```bash
git clone https://github.com/greenarmor/gesf.git
cd gesf
npm install -g pnpm    # if not already installed
pnpm install
pnpm -r run build
cd packages/cli && npm link
```

After linking, `ges` is available system-wide pointing to your local build.

---

## Quick Comparison

| Method | Requires Node? | Install Time | Best For |
|--------|:---:|:---:|---|
| Homebrew | No (auto) | ~5s | macOS daily use, teams |
| npm global | Yes (>=22) | ~10s | JS/TS teams, npm workflows |
| pnpm global | Yes (>=22) | ~10s | pnpm users |
| npx | Yes (>=22) | ~5s (cached) | One-off audits, CI |
| Source | Yes (>=22) | ~60s | Contributors, developers |

---

## Prerequisites (npm/npx only)

If using npm, pnpm, or npx, you need Node.js >= 22.

|| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Node.js | 22.0.0 or higher | `node --version` |
| npm | 8.0.0 or higher | `npm --version` |

!!! info "GESF scans any project"
    Your project can be Python, Rust, Go, Java, Ruby, PHP, .NET, or anything else. Node.js is only needed to run the `ges` command. It does not need to be part of your project's stack.

Install Node.js if you don't have it:

=== "nvm (recommended)"

    ```bash
    nvm install 22
    nvm use 22
    ```

=== "Homebrew (macOS)"

    ```bash
    brew install node
    ```

=== "apt (Ubuntu/Debian)"

    ```bash
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
    ```

=== "winget (Windows)"

    ```powershell
    winget install OpenJS.NodeJS.LTS
    ```

---

## Verify Installation

```bash
# Check version
ges --version

# Check available commands
ges --help

# Run a quick test
mkdir /tmp/test-project && cd /tmp/test-project
ges init -n "Test" -t generic-web-application -f "GDPR,OWASP" --force
ges audit
ges doctor
```

---

!!! example "Exercise 1: Install and Verify"

    Install GESF using your preferred method and verify it works.

    1. Choose an install method from the options above
    2. Run `ges --version` and confirm you see a version number
    3. Run `ges --help` and confirm you see at least 15 commands listed
    4. Create and audit a throwaway project:

    ```bash
    mkdir /tmp/gesf-test && cd /tmp/gesf-test
    ges init -n "My Test" -t saas -f "GDPR,OWASP" --force
    ls -la .ges/ compliance/ security/ controls/
    ```

    You should see the `.ges/`, `compliance/`, `security/`, and `controls/` directories created.

!!! example "Exercise 2: Compare Install Methods"

    If you have both npm and Homebrew available, try both install paths.

    1. Install via Homebrew:

    ```bash
    brew tap greenarmor/gesf && brew install ges
    which ges  # should show Homebrew path
    ges --version
    ```

    2. Uninstall, then install via npm:

    ```bash
    brew uninstall ges
    npm install -g @greenarmor/ges
    which ges  # should show npm global path
    ges --version
    ```

    3. Compare:
       - Which was faster to install?
       - Does `ges --version` produce the same output?
       - Run `ges doctor` in a test project — the behavior should be identical.

    !!! question "Questions"
        - Why might you choose brew over npm in a CI pipeline?
        - What are the tradeoffs between npx and a global install?
        - On a server without Node.js, which install methods work?
