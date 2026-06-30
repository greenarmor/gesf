import { describe, it, expect } from "vitest";
import { KubernetesScanner } from "./kubernetes-scanner.js";
import type { ScanContext } from "./types.js";

function makeCtx(files: Record<string, string>): ScanContext {
  const fileContents = new Map(Object.entries(files));
  return {
    root: "/test",
    files: Object.keys(files),
    fileContents,
  };
}

const BASE_MANIFEST = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-app
spec:
  replicas: 1
  template:
    spec:
      containers:
        - name: app
          image: app:1.0.0
`;

describe("KubernetesScanner", () => {
  const scanner = new KubernetesScanner();

  it("should detect missing securityContext", () => {
    const ctx = makeCtx({ "deploy.yaml": BASE_MANIFEST });
    const findings = scanner.scan(ctx);
    const scFinding = findings.find(f => f.ruleId === "K8S-004");
    expect(scFinding).toBeDefined();
    expect(scFinding!.severity).toBe("high");
    expect(scFinding!.controlIds).toContain("CIS-K8S-012");
  });

  it("should detect privileged: true", () => {
    const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: test
spec:
  template:
    spec:
      containers:
        - name: app
          image: app:1.0
          securityContext:
            privileged: true
`;
    const ctx = makeCtx({ "deploy.yaml": manifest });
    const findings = scanner.scan(ctx);
    const privFinding = findings.find(f => f.ruleId === "K8S-003");
    expect(privFinding).toBeDefined();
    expect(privFinding!.severity).toBe("critical");
    expect(privFinding!.controlIds).toContain("CIS-K8S-004");
  });

  it("should detect hostNetwork: true", () => {
    const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: test
spec:
  template:
    spec:
      hostNetwork: true
      containers:
        - name: app
          image: app:1.0
`;
    const ctx = makeCtx({ "deploy.yaml": manifest });
    const findings = scanner.scan(ctx);
    const hnFinding = findings.find(f => f.ruleId === "K8S-007");
    expect(hnFinding).toBeDefined();
    expect(hnFinding!.severity).toBe("critical");
  });

  it("should detect runAsUser: 0", () => {
    const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: test
spec:
  template:
    spec:
      containers:
        - name: app
          image: app:1.0
          securityContext:
            runAsUser: 0
            runAsNonRoot: false
`;
    const ctx = makeCtx({ "deploy.yaml": manifest });
    const findings = scanner.scan(ctx);
    const rootFinding = findings.find(f => f.ruleId === "K8S-001" && f.severity === "critical");
    expect(rootFinding).toBeDefined();
    expect(rootFinding!.controlIds).toContain("CIS-K8S-007");
  });

  it("should detect :latest image tag", () => {
    const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: test
spec:
  template:
    spec:
      containers:
        - name: app
          image: app:latest
`;
    const ctx = makeCtx({ "deploy.yaml": manifest });
    const findings = scanner.scan(ctx);
    const latestFinding = findings.find(f => f.ruleId === "K8S-006");
    expect(latestFinding).toBeDefined();
    expect(latestFinding!.controlIds).toContain("CIS-K8S-006");
  });

  it("should detect secrets in env vars", () => {
    const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: test
spec:
  template:
    spec:
      containers:
        - name: app
          image: app:1.0
          env:
            - name: DATABASE_PASSWORD
              value: "super-secret-123"
`;
    const ctx = makeCtx({ "deploy.yaml": manifest });
    const findings = scanner.scan(ctx);
    const secretFinding = findings.find(f => f.ruleId === "K8S-010");
    expect(secretFinding).toBeDefined();
    expect(secretFinding!.severity).toBe("critical");
  });

  it("should detect missing resource limits", () => {
    const ctx = makeCtx({ "deploy.yaml": BASE_MANIFEST });
    const findings = scanner.scan(ctx);
    const resFinding = findings.find(f => f.ruleId === "K8S-002");
    expect(resFinding).toBeDefined();
    expect(resFinding!.controlIds).toContain("CIS-K8S-009");
  });

  it("should detect missing readOnlyRootFilesystem", () => {
    const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: test
spec:
  template:
    spec:
      containers:
        - name: app
          image: app:1.0
          securityContext:
            runAsNonRoot: true
            capabilities:
              drop: [ALL]
`;
    const ctx = makeCtx({ "deploy.yaml": manifest });
    const findings = scanner.scan(ctx);
    const roFinding = findings.find(f => f.ruleId === "K8S-005");
    expect(roFinding).toBeDefined();
  });

  it("should not flag non-K8s YAML files", () => {
    const ctx = makeCtx({
      "config.yaml": "server:\n  port: 3000\n  host: localhost\n",
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("should not flag clean K8s manifest", () => {
    const manifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: test
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
        - name: app
          image: app:1.0.0
          securityContext:
            readOnlyRootFilesystem: true
            allowPrivilegeEscalation: false
            capabilities:
              drop: [ALL]
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
`;
    const ctx = makeCtx({ "deploy.yaml": manifest });
    const findings = scanner.scan(ctx);
    const criticals = findings.filter(f => f.severity === "critical");
    expect(criticals.length).toBe(0);
  });
});
