import type { Scanner, Finding, ScanContext } from "./types.js";

const K8S_KINDS = new Set([
  "Deployment", "StatefulSet", "DaemonSet", "Pod", "Job", "CronJob",
  "ReplicaSet", "ReplicationController",
]);

const SECRET_ENV_PATTERNS = [
  /(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?key|token|credential)/i,
];

export class KubernetesScanner implements Scanner {
  name = "kubernetes";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    for (const [filePath, content] of ctx.fileContents) {
      if (!this.isKubernetesManifest(filePath, content)) continue;
      this.scanManifest(filePath, content, findings);
    }

    return findings;
  }

  private isKubernetesManifest(filePath: string, content: string): boolean {
    const isYaml = filePath.endsWith(".yaml") || filePath.endsWith(".yml");
    const isJson = filePath.endsWith(".json");

    if (!isYaml && !isJson) return false;

    const hasApiVersion = /^apiVersion\s*:/m.test(content) || /"apiVersion"\s*:/.test(content);
    const hasKind = /^kind\s*:/m.test(content) || /"kind"\s*:/.test(content);

    if (!hasApiVersion || !hasKind) return false;

    const kindMatch = content.match(/^kind\s*:\s*(\w+)/m) || content.match(/"kind"\s*:\s*"(\w+)"/);
    if (!kindMatch) return false;

    return K8S_KINDS.has(kindMatch[1]);
  }

  private scanManifest(filePath: string, content: string, findings: Finding[]): void {
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();

      // Check for privileged: true
      if (lower.includes("privileged") && lower.includes("true")) {
        findings.push({
          ruleId: "K8S-003",
          severity: "critical",
          category: "container-security",
          title: "Privileged container in Kubernetes manifest",
          description: "privileged: true grants the container full access to host devices and kernel capabilities.",
          file: filePath,
          line: i + 1,
          evidence: line.trim(),
          controlIds: ["CIS-K8S-004"],
          fix: "Remove privileged: true. Add specific capabilities via securityContext.capabilities.add if needed.",
        });
      }

      // Check for hostNetwork: true
      if (lower.includes("hostnetwork") && lower.includes("true")) {
        findings.push({
          ruleId: "K8S-007",
          severity: "critical",
          category: "network-security",
          title: "hostNetwork enabled in Kubernetes manifest",
          description: "hostNetwork: true gives the pod access to the host's network namespace, bypassing network policies.",
          file: filePath,
          line: i + 1,
          evidence: line.trim(),
          controlIds: ["CIS-K8S-004"],
          fix: "Remove hostNetwork: true. Use proper service exposure (ClusterIP, Ingress) instead.",
        });
      }

      // Check for hostPID or hostIPC
      if ((lower.includes("hostpid") || lower.includes("hostipc")) && lower.includes("true")) {
        findings.push({
          ruleId: "K8S-008",
          severity: "high",
          category: "container-security",
          title: "hostPID or hostIPC enabled in Kubernetes manifest",
          description: "hostPID/hostIPC: true shares the host's process or IPC namespace with the pod, allowing host process visibility.",
          file: filePath,
          line: i + 1,
          evidence: line.trim(),
          controlIds: ["CIS-K8S-004"],
          fix: "Remove hostPID and hostIPC. Use proper pod isolation.",
        });
      }

      // Check for runAsNonRoot: false or absent + runAsUser: 0
      if (lower.includes("runasuser") && (lower.includes(": 0") || lower.includes(":0"))) {
        findings.push({
          ruleId: "K8S-001",
          severity: "critical",
          category: "container-security",
          title: "Container explicitly runs as root (runAsUser: 0)",
          description: "runAsUser: 0 forces the container to run as root, which is a major security risk.",
          file: filePath,
          line: i + 1,
          evidence: line.trim(),
          controlIds: ["CIS-K8S-007"],
          fix: "Set runAsUser to a non-zero UID (e.g., 1000) and runAsNonRoot: true.",
        });
      }

      // Check for :latest image
      if (lower.includes("image:") && lower.includes(":latest")) {
        findings.push({
          ruleId: "K8S-006",
          severity: "medium",
          category: "supply-chain",
          title: "Kubernetes manifest uses :latest image tag",
          description: "Using :latest makes deployments non-reproducible and can introduce unexpected changes.",
          file: filePath,
          line: i + 1,
          evidence: line.trim(),
          controlIds: ["CIS-K8S-006"],
          fix: "Pin the image to a specific version tag or SHA256 digest.",
        });
      }

      // Check for secrets in env vars (literal values)
      if (lower.includes("value:") && !lower.includes("valuefrom") && !lower.includes("secretkeyref")) {
        // Check surrounding lines for a secret-like name
        const context = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 1)).join(" ");
        for (const pattern of SECRET_ENV_PATTERNS) {
          if (pattern.test(context)) {
            findings.push({
              ruleId: "K8S-010",
              severity: "critical",
              category: "secrets",
              title: "Secret in Kubernetes env var (literal value)",
              description: "A potential secret is set as a literal environment variable value instead of using a Kubernetes Secret.",
              file: filePath,
              line: i + 1,
              evidence: line.trim().replace(/value:.*/i, "value: ***"),
              controlIds: ["GDPR-ART32-006", "CIS-K8S-011"],
              fix: "Move the secret to a Kubernetes Secret resource and reference it via secretKeyRef or valueFrom.",
            });
            break;
          }
        }
      }
    }

    // Check for missing securityContext
    if (!content.includes("securityContext")) {
      findings.push({
        ruleId: "K8S-004",
        severity: "high",
        category: "container-security",
        title: "No securityContext defined in Kubernetes manifest",
        description: "Without securityContext, containers run with default (insecure) settings — no runAsNonRoot, no capabilities drop.",
        file: filePath,
        evidence: "No securityContext found in manifest",
        controlIds: ["CIS-K8S-012"],
        fix: "Add securityContext at pod and container level: runAsNonRoot: true, capabilities.drop: [ALL], allowPrivilegeEscalation: false",
      });
    }

    // Check for missing runAsNonRoot
    if (content.includes("securityContext") && !content.includes("runAsNonRoot")) {
      findings.push({
        ruleId: "K8S-001",
        severity: "high",
        category: "container-security",
        title: "securityContext present but runAsNonRoot not set",
        description: "Without runAsNonRoot: true, the container may run as root even if securityContext is defined.",
        file: filePath,
        evidence: "securityContext found but runAsNonRoot: true missing",
        controlIds: ["CIS-K8S-007"],
        fix: "Add runAsNonRoot: true to the securityContext.",
      });
    }

    // Check for missing readOnlyRootFilesystem
    if (content.includes("securityContext") && !content.includes("readOnlyRootFilesystem")) {
      findings.push({
        ruleId: "K8S-005",
        severity: "medium",
        category: "container-security",
        title: "readOnlyRootFilesystem not set in Kubernetes manifest",
        description: "Without readOnlyRootFilesystem: true, attackers can write malicious files to the container's root filesystem.",
        file: filePath,
        evidence: "readOnlyRootFilesystem: true missing from securityContext",
        controlIds: ["CIS-K8S-008"],
        fix: "Add readOnlyRootFilesystem: true to container securityContext. Mount emptyDir for paths that need writes.",
      });
    }

    // Check for missing resource limits
    if (!content.includes("resources:") || (!content.includes("limits:") && !content.includes("requests:"))) {
      findings.push({
        ruleId: "K8S-002",
        severity: "medium",
        category: "resource-management",
        title: "No resource limits/requests defined in Kubernetes manifest",
        description: "Without resource limits, a single pod can monopolize cluster resources and cause DoS.",
        file: filePath,
        evidence: "No resources.limits or resources.requests found",
        controlIds: ["CIS-K8S-009"],
        fix: "Add resources.requests and resources.limits for CPU and memory to every container.",
      });
    }

    // Check for missing NetworkPolicy (informational)
    if (!this.hasNetworkPolicy(content)) {
      findings.push({
        ruleId: "K8S-009",
        severity: "low",
        category: "network-security",
        title: "No NetworkPolicy defined",
        description: "Without NetworkPolicies, all pods can communicate with each other by default. Consider defining default-deny policies.",
        file: filePath,
        evidence: "No NetworkPolicy resource found in manifest",
        controlIds: ["CIS-K8S-005"],
        fix: "Define a default-deny NetworkPolicy per namespace and specific allow rules for required traffic.",
      });
    }
  }

  private hasNetworkPolicy(content: string): boolean {
    return content.includes("NetworkPolicy") || content.includes("networkpolicy") ||
           content.includes("kind: NetworkPolicy");
  }
}
