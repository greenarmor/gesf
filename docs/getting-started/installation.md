# Installation

## Prerequisites

GESF's CLI requires Node.js to run, but it scans **any** project regardless of programming language.

|| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Node.js | 22.0.0 or higher | `node --version` |
| npm | 8.0.0 or higher | `npm --version` |

!!! info "Node.js is the CLI runtime, not a project requirement"
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

## Option 1 — Global Install (Recommended)

Best for teams and individuals who want `ges` available everywhere.

```bash
npm install -g @greenarmor/ges
```

Or with pnpm:

```bash
pnpm add -g @greenarmor/ges
```

After installation, the `ges` command is available system-wide.

## Option 2 — Run Without Installing

Run directly without a global install. Downloads and executes on demand.

```bash
npx @greenarmor/ges init
npx @greenarmor/ges audit
npx @greenarmor/ges score
```

Or with pnpm:

```bash
pnpm dlx @greenarmor/ges init
```

## Option 3 — Install from Source

For developers contributing to GESF or building from source.

```bash
# Clone the repository
git clone https://github.com/greenarmor/gesf.git
cd gesf

# Install pnpm if not available
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm -r run build

# Link the CLI globally
cd packages/cli
npm link
```

After linking, `ges` is available system-wide pointing to your local build.

---

## Verify Installation

```bash
# Check version
ges --version

# Check available commands
ges --help

# Run a quick test (any project type works)
mkdir /tmp/test-project && cd /tmp/test-project
ges init --name "Test" --type "generic-web-application" --frameworks "GDPR,OWASP"
ges audit
ges doctor
```

!!! example "Exercise: Verify Your Install"

    1. Run `ges --version` and confirm it outputs a version number
    2. Run `ges --help` and confirm you see at least 14 commands listed
    3. Create a throwaway project and initialize it:

    ```bash
    mkdir /tmp/gesf-test && cd /tmp/gesf-test
    ges init -n "My Test" -t saas -f "GDPR,OWASP"
    ls -la .ges/ compliance/ security/ controls/
    ```

    You should see the `.ges/`, `compliance/`, `security/`, and `controls/` directories created.
