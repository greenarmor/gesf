# Dependency Analysis

The dependency analysis module inspects your project's dependencies for vulnerabilities, deprecated packages, license issues, and outdated versions. It supports **Node.js**, **Python**, **Rust**, and **Go** projects.

## How It Works

The `analyzeDependencies()` function is part of the `@greenarmor/ges-scanner-integration` package. It:

1. Detects your project's language ecosystem from manifest files
2. Runs the appropriate dependency auditor (`npm audit`, `pip-audit`, `cargo audit`, `govulncheck`)
3. Checks for deprecated packages and copyleft licenses
4. Returns a structured report with findings and recommendations

## Supported Ecosystems

| Ecosystem | Manifest Files | Vulnerability Scanner |
|-----------|---------------|----------------------|
| Node.js | `package.json` | `npm audit` |
| Python | `requirements.txt`, `pyproject.toml` | `pip-audit` |
| Rust | `Cargo.toml` | `cargo audit` |
| Go | `go.mod` | `govulncheck` |

## Finding Types

Each finding has a type that determines its category:

| Type | Severity | Description |
|------|----------|-------------|
| `vulnerability` | Varies | Known security vulnerability in a dependency |
| `deprecated` | Medium | Package is deprecated or unmaintained |
| `license` | Medium | Package may use a copyleft license (GPL, AGPL) |
| `outdated` | Low | Package is behind the latest version |

## Report Structure

```typescript
interface DependencyReport {
  totalDeps: number;
  findings: DependencyFinding[];
  licenseSummary: Record<string, number>;
  outdatedCount: number;
  deprecatedCount: number;
  vulnerabilityCount: number;
}
```

### DependencyFinding

```typescript
interface DependencyFinding {
  package: string;
  version: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "vulnerability" | "license" | "outdated" | "deprecated";
  description: string;
  recommendation: string;
}
```

## Programmatic Usage

```typescript
import { analyzeDependencies } from "@greenarmor/ges-scanner-integration";

const report = analyzeDependencies("./my-project");

console.log(`Total dependencies: ${report.totalDeps}`);
console.log(`Vulnerabilities: ${report.vulnerabilityCount}`);
console.log(`Deprecated: ${report.deprecatedCount}`);
console.log(`Outdated: ${report.outdatedCount}`);

for (const finding of report.findings) {
  if (finding.type === "vulnerability") {
    console.log(`[${finding.severity}] ${finding.package}@${finding.version}`);
    console.log(`  ${finding.description}`);
    console.log(`  Fix: ${finding.recommendation}`);
  }
}
```

## Node.js Analysis

For Node.js projects, the analysis:

1. **Parses `package.json`** — counts all dependencies and devDependencies
2. **Checks for deprecated packages** — flags known deprecated packages with alternatives
3. **Checks for copyleft licenses** — identifies GPL/AGPL licensed packages
4. **Runs `npm audit`** — detects known vulnerabilities from the npm advisory database
5. **Runs `npm outdated`** — identifies packages behind their latest version

Example finding:

```json
{
  "package": "lodash",
  "version": "4.17.20",
  "severity": "high",
  "type": "vulnerability",
  "description": "Vulnerability in \"lodash\": Prototype pollution",
  "recommendation": "Update to 4.17.21"
}
```

## Python Analysis

For Python projects:

1. **Counts dependencies** from `requirements.txt` or `pyproject.toml`
2. **Runs `pip-audit`** — checks the Python Packaging Advisory Database

## Rust Analysis

For Rust projects:

1. **Runs `cargo audit`** — checks the RustSec advisory database

## Go Analysis

For Go projects:

1. **Runs `govulncheck`** — checks the Go vulnerability database

## Deprecated Package Detection

The analysis includes a curated list of commonly deprecated Node.js packages:

| Deprecated Package | Recommended Alternative |
|-------------------|----------------------|
| `request` | `node-fetch`, `axios`, `got` |
| `node-uuid` | `uuid` |
| `left-pad` | Native `String.padStart()` |
| `core-js@2` | `core-js@3` |
| `babel-polyfill` | `core-js` + `regenerator-runtime` |

## License Compliance

The analysis flags packages that may use copyleft licenses (GPL, AGPL, LGPL). These licenses have requirements that may affect your project's licensing model.

```json
{
  "package": "some-gpl-package",
  "version": "1.0.0",
  "severity": "medium",
  "type": "license",
  "description": "Package \"some-gpl-package\" may use a copyleft license (GPL, AGPL).",
  "recommendation": "Review the package license. Consider an alternative with a permissive license (MIT, Apache-2.0, BSD)."
}
```

The `licenseSummary` in the report provides a count:

```json
{
  "permissive": 145,
  "copyleft": 3
}
```

## Integration with External Scanners

Dependency analysis works alongside `ges scan`, which runs external tools (Trivy, Gitleaks, Semgrep, SBOM scanners). Use both together:

```bash
# Built-in dependency analysis + external scanner integration
ges audit    # Includes source code scanning
ges scan     # Runs external dependency auditors and SBOM tools
```

!!! tip "Run both for full coverage"

    `ges audit` scans your source code patterns. `ges scan` runs external tools like Trivy and Gitleaks. Together they provide defense in depth.

!!! example "Exercise: Analyze Dependencies in a Node.js Project"

    1. Create a test project with some dependencies:

    ```bash
    mkdir /tmp/dep-test && cd /tmp/dep-test
    npm init -y
    npm install request@2.88.2  # Deprecated
    npm install lodash@4.17.20  # Has known vuln
    ```

    2. Initialize GESF:

    ```bash
    ges init -n "Dep Test" -t generic-web-application -f "GDPR,OWASP"
    ```

    3. Run the external scanner:

    ```bash
    ges scan
    ```

    4. Observe the findings — deprecated packages and vulnerabilities

    5. Fix the issues:

    ```bash
    npm uninstall request
    npm install axios
    npm install lodash@latest
    ```

    6. Re-run `ges scan` to verify the findings are gone

    !!! question "Questions"
        - How many dependencies had known vulnerabilities?
        - Were any packages deprecated? What were the recommended alternatives?
        - Did any packages have copyleft license concerns?
