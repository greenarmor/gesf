# Contributing to GESF

Thank you for your interest in contributing to the **Green Engineering Standard Framework (GESF)**. This document provides the guidelines, standards, and processes for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Adding a New Package](#adding-a-new-package)
- [Adding a New Policy Pack](#adding-a-new-policy-pack)
- [Adding a New CLI Command](#adding-a-new-cli-command)
- [Testing](#testing)
- [Documentation](#documentation)
- [Security](#security)
- [License](#license)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

| Requirement | Minimum Version |
| ----------- | --------------- |
| Node.js | >= 22.0.0 |
| pnpm | >= 11.0.0 |
| Git | >= 2.40 |
| TypeScript | ^6.0.0 (dev dependency) |

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/greenarmor/gesf.git
cd gesf

# Install dependencies
pnpm install

# Build all packages
pnpm -r run build

# Verify the CLI works
node packages/cli/dist/cli.js --help
```

### Fork and Branch Workflow

1. **Fork** the repository to your GitHub account.
2. **Clone** your fork locally.
3. **Create a branch** from `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make changes**, commit, and push to your fork.
5. **Open a Pull Request** against the `master` branch.

## Development Environment

### Monorepo Structure

GESF is a pnpm monorepo. All packages live under `packages/` and share a common TypeScript configuration.

```
gesf/
├── packages/
│   ├── core/                    # @greenarmor/ges-core
│   ├── compliance-engine/       # @greenarmor/ges-compliance-engine
│   ├── audit-engine/            # @greenarmor/ges-audit-engine
│   ├── policy-engine/           # @greenarmor/ges-policy-engine
│   ├── rules-engine/            # @greenarmor/ges-rules-engine
│   ├── scoring-engine/          # @greenarmor/ges-scoring-engine
│   ├── scanner-integration/     # @greenarmor/ges-scanner-integration
│   ├── doc-generator/           # @greenarmor/ges-doc-generator
│   ├── cicd-generator/          # @greenarmor/ges-cicd-generator
│   ├── report-generator/        # @greenarmor/ges-report-generator
│   ├── mcp-server/              # @greenarmor/ges-mcp-server
│   └── cli/                     # @greenarmor/ges
├── docs/                        # Documentation site (MkDocs)
├── compliance/                  # Framework compliance documents
├── security/                    # Security policy documents
├── controls/                    # Control definitions (GDPR, OWASP, etc.)
├── policies/                    # Policy templates
├── checklists/                  # Compliance checklists
└── .github/workflows/           # CI/CD pipelines
```

### Useful Commands

```bash
# Build all packages
pnpm -r run build

# Build a single package
pnpm --filter @greenarmor/ges-core run build

# Clean all build artifacts
pnpm run clean

# Run linter
pnpm run lint

# Run tests across all packages
pnpm run test

# Run tests for a single package
pnpm --filter @greenarmor/ges-core run test

# Run CLI locally
node packages/cli/dist/cli.js --help

# Test MCP server
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n' | node packages/mcp-server/dist/server.js
```

## Project Structure

### Package Anatomy

Every package follows this structure:

```
packages/<package-name>/
├── src/
│   └── index.ts          # Main entry point, exports public API
├── dist/                  # Build output (gitignored)
├── package.json           # Package manifest
├── tsconfig.json          # TypeScript config (extends root)
└── README.md              # Package documentation
```

### Key Configuration Files

| File | Purpose |
| ---- | ------- |
| `tsconfig.base.json` | Shared TypeScript configuration for all packages |
| `pnpm-workspace.yaml` | Workspace definition |
| `package.json` | Root workspace scripts and dev dependencies |

## Development Workflow

### 1. Create an Issue

Before starting work, check if an issue exists. If not, create one describing:

- The problem or feature
- The proposed solution
- Which package(s) are affected
- Any breaking changes

### 2. Branch Naming

Use descriptive branch names with a prefix:

| Prefix | Purpose |
| ------ | ------- |
| `feature/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring |
| `security/` | Security fixes |
| `chore/` | Maintenance tasks |

Examples:
```
feature/add-nist-policy-pack
fix/scoring-engine-calculation
docs/mcp-server-setup-guide
```

### 3. Develop

```bash
# Create your branch
git checkout -b feature/my-feature

# Make changes and build
pnpm -r run build

# Test your changes
pnpm run test

# Lint
pnpm run lint
```

### 4. Verify

Before submitting a PR, ensure:

- [ ] All packages build: `pnpm -r run build`
- [ ] Linter passes: `pnpm run lint`
- [ ] Tests pass: `pnpm run test`
- [ ] No secrets committed: `gitleaks protect --staged`
- [ ] TypeScript types are correct
- [ ] New exports are documented in the package README

## Coding Standards

### TypeScript

- **ESM modules only** — All packages use `"type": "module"`.
- **No `__dirname`** — Use `import.meta.url` with `url.fileURLToPath`.
- **Strict mode** — All packages compile with `strict: true`.
- **Explicit return types** — Public functions must have explicit return type annotations.
- **No `any`** — Avoid `any`; use `unknown` with type guards when necessary.
- **Barrel exports** — Each package exports its public API through `src/index.ts`.

### Import Style

```typescript
// Use named imports
import { someFunction, SomeType } from '@greenarmor/ges-core';

// Use import.meta.url instead of __dirname
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### Error Handling

```typescript
// Use specific error types
export class ComplianceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ComplianceError';
  }
}
```

### Naming Conventions

| Element | Convention | Example |
| ------- | ---------- | ------- |
| Files | kebab-case | `compliance-engine.ts` |
| Classes | PascalCase | `AuditEngine` |
| Functions | camelCase | `evaluateCompliance` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `ComplianceResult` |
| Enums | PascalCase | `DataClassification` |

### Package.json Standards

Every package must include:

```json
{
  "name": "@greenarmor/ges-<name>",
  "version": "0.3.3",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist *.tsbuildinfo"
  },
  "peerDependencies": {},
  "dependencies": {},
  "devDependencies": {
    "typescript": "^6.0.0"
  }
}
```

### Build Output

- All packages compile to `dist/` using TypeScript (`tsc`).
- The MCP server uses an additional esbuild bundle step.
- Never commit `dist/` directories — they are gitignored.

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages in imperative mood:

```
Add NIST CSF policy pack to policy engine

Implement all 6 NIST CSF 2.0 functions (Govern, Identify, Protect,
Detect, Respond, Recover) with 23 categories and 145 checks.
```

### What to Include

- **What** changed and **why**.
- Reference related issues: `Fixes #123` or `Refs #456`.
- Note breaking changes explicitly.

### What Not to Commit

- `dist/` directories
- `node_modules/`
- Secrets, API keys, or credentials
- IDE-specific files (`.idea/`, `.vscode/settings.json`)
- Unrelated formatting changes mixed with functional changes

## Pull Request Process

### PR Template

When opening a PR, include:

1. **Description** — What does this PR do and why?
2. **Related Issues** — Links to related issues.
3. **Affected Packages** — Which `@greenarmor/ges-*` packages are changed.
4. **Breaking Changes** — Any breaking changes and migration notes.
5. **Testing** — How was this tested?
6. **Checklist:**
   - [ ] Code builds (`pnpm -r run build`)
   - [ ] Linter passes (`pnpm run lint`)
   - [ ] Tests pass (`pnpm run test`)
   - [ ] No secrets committed
   - [ ] Documentation updated (if applicable)
   - [ ] Package README updated (if applicable)

### Review Criteria

Maintainers will evaluate PRs on:

1. **Correctness** — Does it solve the stated problem?
2. **Security** — Does it introduce vulnerabilities?
3. **Architecture** — Does it fit the framework's module design?
4. **Consistency** — Does it follow existing patterns?
5. **Documentation** — Are new features documented?
6. **Testing** — Are there adequate tests?

### Merge Requirements

- All CI checks must pass (build, lint, security scan, secret scan).
- At least one maintainer approval.
- No unresolved review comments.
- Branch is up to date with `master`.

## Adding a New Package

To add a new package to the monorepo:

1. Create `packages/<name>/` with the standard structure.
2. Add `package.json` following the naming convention `@greenarmor/ges-<name>`.
3. Extend `tsconfig.base.json` in the package's `tsconfig.json`.
4. Add the package to any internal dependencies that need it.
5. Update `pnpm-workspace.yaml` if needed (it uses `packages/*` by default).
6. Add a `README.md` describing the package's purpose and API.
7. Update the root documentation to reference the new package.

## Adding a New Policy Pack

Policy packs live in `packages/policy-engine/src/packs/`. To add a new one:

1. Create a new file: `packages/policy-engine/src/packs/<framework>.ts`.
2. Define the policy pack with controls, rules, and evaluation criteria.
3. Export it from `packages/policy-engine/src/index.ts`.
4. Add the framework name to the CLI init wizard's supported frameworks list.
5. Add control definitions to `controls/<framework>/controls.json`.
6. Document the policy pack in `docs/`.

## Adding a New CLI Command

CLI commands live in `packages/cli/src/commands/`. To add a new one:

1. Create a new file: `packages/cli/src/commands/<command>.ts`.
2. Implement the command using Commander.js patterns from existing commands.
3. Register the command in `packages/cli/src/cli.ts`.
4. Add the command to `docs/reference/commands.md`.
5. Update the CLI's `--help` output.

## Testing

### Running Tests

```bash
# All packages
pnpm run test

# Single package
pnpm --filter @greenarmor/ges-core run test
```

### Test Standards

- Place test files alongside source files: `src/<module>.test.ts`.
- Use Node.js built-in test runner (`node:test`) or the package's chosen framework.
- Test both success and error paths.
- Test edge cases for compliance evaluation logic.
- Mock external dependencies (filesystem, network, processes).

### Test Coverage

Focus test coverage on:

- Compliance evaluation accuracy (GDPR controls must evaluate correctly).
- Scanner detection logic (must catch known vulnerability patterns).
- Scoring calculations (scores must be deterministic and reproducible).
- CLI command behavior (init wizard, audit, score, report).
- MCP server protocol handling (JSON-RPC message parsing).

## Documentation

### Documentation Site

GESF uses MkDocs for documentation. Source files are in `docs/`.

```bash
# Install MkDocs (if not installed)
pip install mkdocs mkdocs-material

# Serve documentation locally
mkdocs serve

# Build documentation
mkdocs build
```

### Documentation Standards

- **Package README** — Every package must have a README with: name, description, installation, API table.
- **Command docs** — Every CLI command must be documented in `docs/reference/commands.md`.
- **Inline docs** — Use JSDoc for all exported functions and types.
- **Examples** — Provide usage examples for non-trivial features.

### When to Update Documentation

Update documentation when you:

- Add a new CLI command
- Add a new policy pack
- Change the public API of any package
- Modify the project structure
- Change configuration options
- Add a new MCP tool

## Security

### Security-First Development

GESF is a security and compliance framework. All contributions must uphold:

- **Privacy by Design** — No collection of personal data without explicit purpose.
- **Security by Design** — No intentional weakening of security controls.
- **Compliance by Design** — Generated artifacts must meet stated compliance requirements.
- **Auditability by Design** — All significant actions must be auditable.

### Secret Prevention

```bash
# Run before committing
gitleaks protect --staged
```

Never commit:
- Passwords, API keys, tokens
- Private keys, certificates
- Database connection strings with credentials
- `.env` files containing real secrets

### Reporting Security Issues

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidelines. **Do not report security vulnerabilities in public issues.**

## License

By contributing to GESF, you agree that your contributions will be licensed under the [MIT License](LICENSE). You retain copyright to your own contributions but grant the project a perpetual, worldwide, non-exclusive license to use, modify, and distribute your contributions as part of GESF.
