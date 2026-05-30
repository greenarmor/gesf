import type { Scanner, Finding, ScanContext } from "./types.js";

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"]);

export class AuthScanner implements Scanner {
  name = "auth";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];
    const content = ctx.fileContents;

    const hasAuthMiddleware = this.detectAuthMiddleware(content);
    const routesWithoutAuth = this.detectRoutesWithoutAuth(content, hasAuthMiddleware);
    const hasRateLimiting = this.detectRateLimiting(content);
    const hasSessionConfig = this.detectSessionConfig(content);
    const hasCORSSettings = this.detectCORSSettings(content);

    if (routesWithoutAuth.length > 0) {
      for (const route of routesWithoutAuth.slice(0, 20)) {
        findings.push({
          ruleId: "AUTH-001",
          severity: "high",
          category: "authentication",
          title: "Route without authentication",
          description: `Endpoint ${route.method} ${route.path} does not require authentication. All endpoints handling personal data must require auth.`,
          file: route.file,
          line: route.line,
          evidence: route.evidence,
          controlIds: ["GDPR-ART32-004", "OWASP-ASVS-003", "OWASP-ASVS-004"],
          fix: "Add authentication middleware to this route or apply globally.",
        });
      }
    }

    if (!hasRateLimiting) {
      findings.push({
        ruleId: "AUTH-002",
        severity: "high",
        category: "authentication",
        title: "No rate limiting detected",
        description: "No rate limiting library or configuration found. Rate limiting is required on authentication endpoints and API routes.",
        file: "project",
        evidence: "No rate limiter (express-rate-limit, etc.) found in codebase",
        controlIds: ["GDPR-ART32-004", "OWASP-ASVS-003"],
        fix: "Install and configure rate limiting: npm install express-rate-limit",
      });
    }

    if (!hasSessionConfig) {
      findings.push({
        ruleId: "AUTH-003",
        severity: "medium",
        category: "authentication",
        title: "No session timeout configuration detected",
        description: "No session expiration or timeout configuration found. Sessions must expire after a period of inactivity.",
        file: "project",
        evidence: "No session timeout configuration found",
        controlIds: ["GDPR-ART32-005"],
        fix: "Configure session expiration: maxAge, idle timeout, or JWT expiration.",
      });
    }

    if (hasCORSSettings === "wildcard") {
      findings.push({
        ruleId: "AUTH-004",
        severity: "high",
        category: "security",
        title: "CORS configured as wildcard (*)",
        description: "CORS is set to allow all origins. This is insecure for production. Restrict to known origins.",
        file: "project",
        evidence: "cors({ origin: '*' }) or Access-Control-Allow-Origin: *",
        controlIds: ["OWASP-ASVS-006"],
        fix: "Restrict CORS to specific origins: cors({ origin: ['https://yourdomain.com'] })",
      });
    }

    if (!this.detectMFA(content)) {
      findings.push({
        ruleId: "AUTH-005",
        severity: "high",
        category: "authentication",
        title: "No MFA implementation detected",
        description: "No multi-factor authentication implementation found. MFA is mandatory per GDPR Article 32.",
        file: "project",
        evidence: "No MFA/2FA/OTP/TOTP library found in dependencies or code",
        controlIds: ["GDPR-ART32-004"],
        fix: "Implement MFA using TOTP (otpauth, speakeasy) or WebAuthn.",
      });
    }

    return findings;
  }

  private detectAuthMiddleware(content: Map<string, string>): boolean {
    const authIndicators = [
      /jwt\.verify|jsonwebtoken|jwtDecode/i,
      /passport\.use|passport\.authenticate/i,
      /authMiddleware|authGuard|requireAuth|isAuthenticated/i,
      /session\s*\(\s*{/i,
      /bearer\s+token/i,
      /firebase.*auth/i,
      /nextAuth|next-auth/i,
      /supabase.*auth/i,
      /clerk/i,
      /auth0/i,
    ];
    return this.searchPatterns(content, authIndicators);
  }

  private detectRoutesWithoutAuth(
    content: Map<string, string>,
    hasGlobalAuth: boolean,
  ): Array<{ method: string; path: string; file: string; line: number; evidence: string }> {
    const routes: Array<{ method: string; path: string; file: string; line: number; evidence: string }> = [];

    if (hasGlobalAuth) return routes;

    const routePattern = /(?:app|router|route)\s*\.\s*(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]*)/gi;

    for (const [filePath, fileContent] of content) {
      const ext = filePath.substring(filePath.lastIndexOf("."));
      if (!SCAN_EXTENSIONS.has(ext)) continue;

      const lines = fileContent.split("\n");
      for (let i = 0; i < lines.length; i++) {
        routePattern.lastIndex = 0;
        const match = routePattern.exec(lines[i]);
        if (match) {
          const path = match[2];
          const publicPaths = ["/", "/health", "/healthz", "/status", "/ping", "/ready", "/readiness", "/version", "/public"];
          if (!publicPaths.some(p => path === p)) {
            routes.push({
              method: match[1].toUpperCase(),
              path,
              file: filePath,
              line: i + 1,
              evidence: lines[i].trim(),
            });
          }
        }
      }
    }

    return routes;
  }

  private detectRateLimiting(content: Map<string, string>): boolean {
    return this.searchPatterns(content, [
      /rate.?limit/i,
      /rateLimit|rate-limit/i,
      /express-rate-limit/i,
      /throttl/i,
    ]);
  }

  private detectSessionConfig(content: Map<string, string>): boolean {
    return this.searchPatterns(content, [
      /session\s*\(\s*{[^}]*maxAge/i,
      /maxAge\s*[:=]/i,
      /expiresIn\s*[:=]/i,
      /expires\s*[:=]/i,
      /cookie\s*:\s*{[^}]*maxAge/i,
      /idleTimeout/i,
    ]);
  }

  private detectCORSSettings(content: Map<string, string>): "wildcard" | "configured" | "none" {
    for (const [, fileContent] of content) {
      if (/cors\s*\(\s*{[^}]*origin\s*:\s*['"]\*['"]/s.test(fileContent) ||
          /Access-Control-Allow-Origin\s*:\s*\*/i.test(fileContent)) {
        return "wildcard";
      }
      if (/cors\s*\(/i.test(fileContent) || /Access-Control-Allow/i.test(fileContent)) {
        return "configured";
      }
    }
    return "none";
  }

  private detectMFA(content: Map<string, string>): boolean {
    return this.searchPatterns(content, [
      /mfa|multi.?factor|2fa|two.?factor/i,
      /totp|otpauth|speakeasy|otplib/i,
      /webauthn|fido2|passkey/i,
      /authenticator/i,
    ]);
  }

  private searchPatterns(content: Map<string, string>, patterns: RegExp[]): boolean {
    for (const [, fileContent] of content) {
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(fileContent)) return true;
      }
    }
    return false;
  }
}
