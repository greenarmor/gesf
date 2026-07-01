# Installation

GESF can be installed several ways — all produce the same `ges` CLI.

## Choose Your Install Method

=== ":fontawesome-brands-apple: Homebrew (macOS)"

    Installs Node.js and GESF in one command. Best for macOS developers.

    ```bash
    brew tap greenarmor/gesf
    brew install ges
    ```

    | Detail | Value |
    |--------|-------|
    | Requires Node? | No (auto-installed) |
    | Install time | ~5 seconds |
    | Best for | macOS daily use, teams |
    | Uninstall | `brew uninstall ges` |

=== ":material-package-variant-closed: npm"

    Best for teams already using npm.

    ```bash
    npm install -g @greenarmor/ges
    ```

    | Detail | Value |
    |--------|-------|
    | Requires Node? | Yes (>= 22) |
    | Install time | ~10 seconds |
    | Best for | JS/TS teams, npm workflows |
    | Uninstall | `npm uninstall -g @greenarmor/ges` |

=== ":material-package-variant-closed: pnpm"

    ```bash
    pnpm add -g @greenarmor/ges
    ```

    | Detail | Value |
    |--------|-------|
    | Requires Node? | Yes (>= 22) |
    | Install time | ~10 seconds |
    | Best for | pnpm users |

=== ":material-rocket-launch: npx"

    No install. Runs on demand.

    ```bash
    npx @greenarmor/ges init
    ```

    | Detail | Value |
    |--------|-------|
    | Requires Node? | Yes (>= 22) |
    | Install time | ~5 seconds (cached) |
    | Best for | One-off audits, CI pipelines |
    | Uninstall | N/A (not installed) |

=== ":material-github: Source"

    For contributors.

    ```bash
    git clone https://github.com/greenarmor/gesf.git
    cd gesf
    npm install -g pnpm
    pnpm install
    pnpm -r run build
    cd packages/cli && npm link
    ```

    | Detail | Value |
    |--------|-------|
    | Requires Node? | Yes (>= 22) |
    | Install time | ~60 seconds |
    | Best for | Developers, contributors |

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

## Prerequisites (npm/pnpm/npx only)

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
