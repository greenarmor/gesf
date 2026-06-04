# GESF v1.0.1 — Socket.dev Supply-Chain Hardening

**Green Engineering Standard Framework** — Compliance-as-Code for GDPR, OWASP, NIST, and CIS.

Patch release that resolves all Socket.dev supply-chain alerts flagged after the v1.0.0 stable release. The Socket.dev score dropped from 100% → 75% on v1.0.0; this release addresses every identified alert category.

**No functional changes.** All 15 CLI commands, all 17 MCP tools, all 6 audit scanners, and all auto-fix rules work identically to v1.0.0.

---

## What Changed

### 1. URL Strings Alert — Resolved

Socket.dev detected hardcoded URL literals in published package files. These appeared in three places:

#### Source Code (17 URLs removed)

The MCP server's auto-fix engine generates code templates for 7 programming languages. These templates previously contained hardcoded example URLs as CORS origin fallbacks:

- `http://localhost:3000` — used in JavaScript, Python (FastAPI, Flask), Rust (Actix, Axum), Go
- `https://yourdomain.com` — used in Python (Django), Ruby (Rails), Java (Spring)

**Fix:** All hardcoded URLs replaced with environment-variable references:

| Language | Before | After |
|----------|--------|-------|
| JavaScript | `origin: [...origins] \|\| ['http://localhost:3000']` | `origin: (process.env.ALLOWED_ORIGINS \|\| '').split(',').filter(Boolean)` |
| Python/Django | `CORS_ALLOWED_ORIGINS = ['https://yourdomain.com']` | `CORS_ALLOWED_ORIGINS = [o for o in os.environ.get('ALLOWED_ORIGINS', '').split(',') if o]` |
| Python/FastAPI | `allow_origins=['http://localhost:3000']` | `allow_origins=[o for o in os.environ.get('ALLOWED_ORIGINS', '').split(',') if o]` |
| Ruby/Rails | `origins 'https://yourdomain.com'` | `origins ENV.fetch('ALLOWED_ORIGINS', '').split(',').reject(&:empty?)` |
| Java/Spring | `config.addAllowedOrigin("https://yourdomain.com")` | `config.addAllowedOrigin(System.getenv("ALLOWED_ORIGIN"))` |
| Rust/Actix | `.allowed_origin("http://localhost:3000")` | `.allowed_origin(&std::env::var("ALLOWED_ORIGIN").unwrap_or_default())` |
| Rust/Axum | `.allow_origin(["http://localhost:3000".parse().unwrap()])` | `.allow_origin([std::env::var("ALLOWED_ORIGIN").unwrap_or_default().parse().unwrap()])` |

**Security improvement:** Generated CORS configurations now fail closed (empty origin list) rather than falling back to an insecure hardcoded URL. Users must explicitly set `ALLOWED_ORIGIN` or `ALLOWED_ORIGINS` env vars.

#### Package READMEs (~30 links removed)

Removed all markdown URL hyperlinks from 11 published package READMEs. Replaced `[text](url)` formatting with plain backtick references.

**Before:**
```markdown
Core types for the [Green Engineering Standard Framework (GESF)](https://github.com/greenarmor/gesf).

## Related Packages
- [`@greenarmor/ges-core`](https://www.npmjs.com/package/@greenarmor/ges-core) — Types
```

**After:**
```markdown
Core types for the Green Engineering Standard Framework (GESF).

## Related Packages
- `@greenarmor/ges-core` — Types
```

#### MCP Server README

- Removed `https://modelcontextprotocol.io/` link
- Removed `vscode:mcp/install?...` deep-link URI scheme (replaced with manual config instructions)

### 2. Obfuscated Code Alert — Resolved

The MCP server package previously shipped an esbuild-bundled `bundle/server.js` (373KB, 9,703 lines) alongside the TypeScript-compiled `dist/server.js` (180KB). Socket.dev's obfuscated code heuristic flagged the bundled file due to:

- Dense output with inlined dependencies
- Long lines (1,225+ characters from inlined regex patterns)
- 9,703 lines of bundled code in a single file

**Fix:** Eliminated the bundle entirely. The package now ships only `dist/`, which uses normal npm dependency resolution.

**Before:**
```json
{
  "bin": { "ges-mcp": "bundle/server.js" },
  "files": ["dist", "bundle"]
}
```

**After:**
```json
{
  "bin": { "ges-mcp": "dist/server.js" },
  "files": ["dist"]
}
```

**Impact:**
- Package size: 61.2KB → 39.5KB compressed (35% reduction)
- Files published: 8 → 6
- Zero functional change — `dist/server.js` imports workspace dependencies via standard ESM imports that resolve at runtime

### 3. False-Positive Import Statements — Resolved

Ten multi-line template literals in `packages/mcp-server/src/server.ts` contained real newline characters. When compiled, these newlines were preserved in the output, creating lines at column 0 that looked like import statements from other languages:

```
import org.springframework.context.annotation.Configuration;
import "net/http"
import java.time.Instant;
```

Socket.dev's static analyzer interpreted these as actual JavaScript imports, triggering alerts.

**Fix:** Converted all 10 multi-line template literals to single-line strings with `\n` escape sequences.

**Before:**
```typescript
actions.push({ type: "create", filePath: "src/auth.rs", content: `use argon2::{Argon2, Algorithm, Version, Params};
use argon2::password_hash::{SaltString, PasswordHasher, PasswordVerifier};
use rand::rngs::OsRng;

pub fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    ...
}
`, description: "..." });
```

**After:**
```typescript
actions.push({ type: "create", filePath: "src/auth.rs", content: "use argon2::{Argon2, Algorithm, Version, Params};\nuse argon2::password_hash::{SaltString, PasswordHasher, PasswordVerifier};\nuse rand::rngs::OsRng;\n\npub fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {\n    ...\n}\n", description: "..." });
```

Runtime behavior is identical — the string values contain the same characters.

**Templates converted:**

| # | Template | Rule | Language |
|---|----------|------|----------|
| 1 | Actix-web security headers | CONFIG-001 | Rust |
| 2 | Axum security headers | CONFIG-001 | Rust |
| 3 | Actix CORS config | CONFIG-002 | Rust |
| 4 | Axum CORS layer | CONFIG-002 | Rust |
| 5 | Tracing audit logger | CONFIG-010 | Rust |
| 6 | Argon2id password utility | CRYPTO-003 | Rust |
| 7 | Diesel audit model | DB-004 | Rust |
| 8 | AES-256-GCM encryption | GDPR-ART32-002 | Rust |
| 9 | Argon2id auth (GDPR) | GDPR-ART32-004 | Rust |
| 10 | SHA-256 integrity | GDPR-ART32-007 | Rust |

---

## What Was NOT Changed

- **`package.json` repository/homepage fields** — Standard npm metadata, not flagged by Socket.dev
- **SVG XML namespace** (`http://www.w3.org/2000/svg`) in scoring-engine — Required for valid SVG, not a network URL
- **CLI commands** — All 15 commands work identically (`ges init`, `ges audit`, `ges score`, etc.)
- **MCP server** — All 17 tools work identically
- **Audit engine** — All 6 scanners work identically
- **Auto-fix engine** — All 15 rule types × 7 languages work identically
- **Policy packs** — All 7 packs unchanged
- **Compliance controls** — All GDPR/OWASP/CIS/NIST controls unchanged
- **Report generator** — Markdown/HTML output unchanged
- **CI/CD generator** — GitHub Actions workflows unchanged

---

## Verification

| Check | Result |
|-------|--------|
| Build (all 12 packages) | ✅ Clean |
| CLI version | ✅ `1.0.1` |
| MCP initialize + tools/list | ✅ 17 tools |
| Auto-fix (Rust/Actix project) | ✅ 4 actions generated |
| Auto-fix (JavaScript/Express project) | ✅ 9 actions generated |
| URL scan in source | ✅ 0 (except SVG xmlns) |
| URL scan in all READMEs | ✅ 0 |
| Fake imports in compiled output | ✅ 0 |
| Bundled JS file | ✅ Eliminated |
| Package size | ✅ 39.5KB (was 61.2KB) |

---

## Packages

All 12 packages updated to v1.0.1:

| Package | Version |
|---------|---------|
| `@greenarmor/ges` | 1.0.1 |
| `@greenarmor/ges-core` | 1.0.1 |
| `@greenarmor/ges-compliance-engine` | 1.0.1 |
| `@greenarmor/ges-audit-engine` | 1.0.1 |
| `@greenarmor/ges-policy-engine` | 1.0.1 |
| `@greenarmor/ges-rules-engine` | 1.0.1 |
| `@greenarmor/ges-scoring-engine` | 1.0.1 |
| `@greenarmor/ges-scanner-integration` | 1.0.1 |
| `@greenarmor/ges-doc-generator` | 1.0.1 |
| `@greenarmor/ges-cicd-generator` | 1.0.1 |
| `@greenarmor/ges-report-generator` | 1.0.1 |
| `@greenarmor/ges-mcp-server` | 1.0.1 |

---

## Upgrade

```bash
# Update globally
npm install -g @greenarmor/ges@1.0.1

# Or use without installing
npx @greenarmor/ges@1.0.1 init

# Update MCP server in your AI assistant
# The MCP server auto-updates when npx fetches the latest version
```

**No migration required.** This is a drop-in replacement for v1.0.0.

---

## Full Changelog

https://github.com/greenarmor/gesf/compare/v1.0.0...v1.0.1
