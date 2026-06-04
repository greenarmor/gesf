# External Scanners

The `ges scan` command integrates with external security tools that must be installed on your system. Unlike `ges audit` (which uses built-in source code scanners), `ges scan` runs third-party tools. It is **language-agnostic** — it auto-detects your project's ecosystem and runs the correct dependency auditor.

## Basic Usage

```bash
ges scan
```

## Ecosystem Detection

When you run `ges scan`, GESF automatically detects your project's programming language and package manager by scanning for lockfiles and marker files:

```
  Detected ecosystem: node (pnpm)
  Running security scans...
```

### How Detection Works

| Ecosystem | Detected By | Package Manager Detected By |
|-----------|-------------|-----------------------------|
| Node.js | `package.json` | `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, `package-lock.json` → npm |
| Python | `requirements.txt`, `pyproject.toml` | `uv.lock` → uv, `pdm.lock` → pdm, `poetry.lock` → poetry, `Pipfile.lock` → pipenv, `requirements.txt` → pip |
| Rust | `Cargo.toml`, `Cargo.lock` | cargo (implied) |
| Go | `go.mod`, `go.sum` | go modules (implied) |
| Ruby | `Gemfile`, `Gemfile.lock` | bundler (implied) |
| Java | `pom.xml`, `build.gradle` | maven/gradle (implied) |
| PHP | `composer.json`, `composer.lock` | composer (implied) |
| .NET | `packages.lock.json`, `nuget.config` | nuget (implied) |

If no known ecosystem is detected, the scan skips the dependency audit step but still runs language-agnostic scanners (Trivy, Gitleaks, Semgrep).

## Supported Scanners

### Dependency Auditors (ecosystem-specific)

The correct auditor is selected based on your detected package manager. Only the **matching** auditor runs — no cross-contamination between ecosystems.

| Ecosystem | Auditor | Install |
|-----------|---------|---------|
| Node.js (pnpm) | `pnpm audit` | Built into pnpm |
| Node.js (npm) | `npm audit` | Built into npm |
| Node.js (yarn) | `yarn audit` | Built into yarn |
| Node.js (bun) | `bun audit` | Built into bun |
| Python | `pip-audit` | `pip install pip-audit` |
| Rust | `cargo audit` | `cargo install cargo-audit` |
| Go | `govulncheck` | `go install golang.org/x/vulncheck/cmd/govulncheck@latest` |
| Ruby | `bundle-audit` | `gem install bundler-audit` |
| Java | `OWASP Dependency-Check` | [Download](https://owasp.org/www-project-dependency-check/) |
| PHP | `composer audit` | Built into composer |
| .NET | `dotnet list package --vulnerable` | Built into .NET CLI |

### Language-Agnostic Scanners (always run)

| Scanner | What It Detects | Install |
|---------|----------------|---------|
| **Trivy** | Container and dependency vulnerabilities | `brew install trivy` |
| **Gitleaks** | Secrets committed to git history | `brew install gitleaks` |
| **Semgrep** | Code pattern matching for security issues | `pip install semgrep` |

### SBOM Scanners (Software Bill of Materials)

| Scanner | What It Does | Install |
|---------|-------------|---------|
| **Syft** | Generates SBOM in CycloneDX format | `brew install syft` |
| **Trivy SBOM** | Generates SBOM via Trivy | Included with Trivy |
| **Grype** | Scans SBOM for vulnerabilities | `brew install grype` |

Scanners that are not installed are reported as **"N/A"** (not a failure).

## CI Mode

```bash
ges scan --ci
```

Exits with code **1** if any scanner reports failures. Use this in CI/CD pipelines.

## Example Output

### Node.js project with pnpm

```
  Detected ecosystem: node (pnpm)
  Running security scans...

  Security Scan Results
  -------------------
  pnpm audit                     PASS
  Trivy                          N/A
  Gitleaks                       N/A
  Semgrep                        N/A
  Syft (SBOM)                    N/A
  Trivy SBOM                     N/A
  Grype (SBOM scan)              N/A
```

### Python project

```
  Detected ecosystem: python (pip)
  Running security scans...

  Security Scan Results
  -------------------
  Dependency Audit               N/A
  Trivy                          N/A
  Gitleaks                       N/A
  Semgrep                        N/A
  Syft (SBOM)                    N/A
  Trivy SBOM                     N/A
  Grype (SBOM scan)              N/A
```

### Rust project

```
  Detected ecosystem: rust
  Running security scans...

  Security Scan Results
  -------------------
  Dependency Audit               N/A
  Trivy                          PASS
  Gitleaks                       PASS
  Semgrep                        N/A
```

## How It Differs from `ges audit`

| Aspect | `ges audit` | `ges scan` |
|--------|------------|-----------|
| Scanners | 6 built-in (no install needed) | External tools (must be installed) |
| What it scans | Source code patterns | Dependencies, git history, container images, SBOMs |
| Language support | Pattern-matching across 20+ file types | Auto-detects ecosystem, runs matching auditor |
| External deps | None | Trivy, Gitleaks, Semgrep, ecosystem-specific auditors (optional) |
| Finds | Code-level issues | Known CVEs, leaked secrets in git, dependency vulnerabilities |
| SBOM | No | Yes (Syft, Trivy, Grype) |

**Use both** for comprehensive coverage: `ges audit` catches code patterns, `ges scan` catches dependency and history issues.

!!! example "Exercise: Run All Scanners"

    1. In any GESF-initialized project, run:

    ```bash
    ges scan
    ```

    2. Note which ecosystem was detected and which dependency auditor ran
    3. Install one additional scanner and re-run:

    ```bash
    # Install Gitleaks (macOS)
    brew install gitleaks

    # Re-run
    ges scan
    ```

    Notice how the Gitleaks result changes from `N/A` to `PASS` or `FAIL`.

!!! example "Exercise: Compare Ecosystems"

    Test detection across different project types:

    ```bash
    # Node.js (pnpm)
    mkdir /tmp/test-node && cd /tmp/test-node
    echo '{"name":"test"}' > package.json && pnpm install
    mkdir .ges && echo 'project_name: test' > .ges/config.yaml
    ges scan

    # Python
    mkdir /tmp/test-py && cd /tmp/test-py
    echo 'flask==2.0' > requirements.txt
    mkdir .ges && echo 'project_name: test' > .ges/config.yaml
    ges scan

    # Rust
    mkdir /tmp/test-rust && cd /tmp/test-rust
    echo '[package]\nname="test"\nversion="0.1.0"\nedition="2021"' > Cargo.toml
    mkdir .ges && echo 'project_name: test' > .ges/config.yaml
    ges scan
    ```

    Observe how each project detects a different ecosystem and runs a different dependency auditor.

!!! example "Exercise: Compare audit vs scan"

    ```bash
    # Built-in code scanners — finds code patterns
    ges audit

    # External tools — finds dependency vulns and git secrets
    ges scan
    ```

    !!! question "Questions"
        - Do `ges audit` and `ges scan` find overlapping issues or different ones?
        - Which command catches hardcoded secrets in current files?
        - Which command catches secrets in git history (already committed)?
        - What ecosystem was detected for your project?
