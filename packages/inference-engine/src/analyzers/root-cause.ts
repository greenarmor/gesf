import type { InferenceFinding, RootCauseNode, RootCauseResult } from "../types.js";

const SEVERITY_WEIGHT: Record<string, number> = {
  critical: 40,
  high: 20,
  medium: 8,
  low: 2,
};

/**
 * Root Cause Analysis via bipartite graph (findings ↔ files ↔ controls).
 *
 * Builds a bipartite graph: findings connect to files, findings connect to controls.
 * Computes each file/control node's:
 *   - severityScore: weighted sum of connected finding severities
 *   - betweenness: fraction of all findings this node is connected to (simplified)
 *   - connectedFindings: which findings touch this node
 *
 * The "root cause" is the file or control with the highest severityScore × betweenness.
 */
export function analyzeRootCause(findings: InferenceFinding[]): RootCauseResult {
  if (findings.length === 0) {
    return {
      nodes: [],
      topCause: null,
      summary: "No findings to analyze.",
      totalFindingsTraced: 0,
      maxSeverityScore: 0,
    };
  }

  // Build adjacency: file → finding indices, control → finding indices
  const fileToFindings = new Map<string, number[]>();
  const controlToFindings = new Map<string, number[]>();

  for (let i = 0; i < findings.length; i++) {
    const f = findings[i];

    // File mapping
    if (!fileToFindings.has(f.file)) fileToFindings.set(f.file, []);
    fileToFindings.get(f.file)!.push(i);

    // Control mapping
    for (const cid of f.controlIds) {
      if (!controlToFindings.has(cid)) controlToFindings.set(cid, []);
      controlToFindings.get(cid)!.push(i);
    }
  }

  // Collect unique frameworks
  const frameworkSet = new Set<string>();

  // Build nodes for files
  const fileNodes: RootCauseNode[] = [];
  for (const [file, findIndices] of fileToFindings) {
    const severityScore = findIndices.reduce((sum, idx) => {
      return sum + (SEVERITY_WEIGHT[findings[idx].severity] ?? 1);
    }, 0);

    const frameworks = new Set<string>();
    for (const idx of findIndices) {
      for (const cid of findings[idx].controlIds) {
        const prefix = cid.split("-")[0];
        if (prefix) frameworks.add(prefix);
      }
    }

    const node: RootCauseNode = {
      type: "file",
      identifier: file,
      connectedFindings: findIndices,
      severityScore,
      betweenness: findIndices.length / findings.length,
      frameworks: [...frameworks].sort(),
    };

    fileNodes.push(node);
    for (const fw of frameworks) frameworkSet.add(fw);
  }

  // Build framework name mapping from known prefixes
  const prefixMap: Record<string, string> = {
    GDPR: "GDPR",
    OWASP: "OWASP",
    CIS: "CIS",
    NIST: "NIST",
    GOVP: "GDPR",
    AI: "GDPR",
    GOV: "GDPR",
    SOC2: "SOC2",
    HIPAA: "HIPAA",
    PCI: "PCI-DSS",
    ISO: "ISO27001",
  };

  // Build nodes for controls
  const controlNodes: RootCauseNode[] = [];
  for (const [control, findIndices] of controlToFindings) {
    const severityScore = findIndices.reduce((sum, idx) => {
      return sum + (SEVERITY_WEIGHT[findings[idx].severity] ?? 1);
    }, 0);

    const prefix = control.split("-")[0];
    const framework = prefixMap[prefix] ?? prefix;

    const node: RootCauseNode = {
      type: "control",
      identifier: control,
      connectedFindings: findIndices,
      severityScore,
      betweenness: findIndices.length / findings.length,
      frameworks: [framework],
    };

    controlNodes.push(node);
    frameworkSet.add(framework);
  }

  // Combine and sort by severityScore × betweenness (composite impact)
  const allNodes = [...fileNodes, ...controlNodes].sort((a, b) => {
    const scoreA = a.severityScore * a.betweenness;
    const scoreB = b.severityScore * b.betweenness;
    return scoreB - scoreA;
  });

  const topCause = allNodes.length > 0 ? allNodes[0] : null;

  const maxSeverityScore = allNodes.length > 0
    ? Math.max(...allNodes.map((n) => n.severityScore))
    : 0;

  let summary: string;
  if (topCause) {
    const pct = Math.round(topCause.betweenness * 100);
    const nodeLabel = topCause.type === "file" ? "file" : "control";
    summary = `${topCause.identifier} is the primary root cause, connected to ${topCause.connectedFindings.length} of ${findings.length} findings (${pct}%).`;
  } else {
    summary = "No root cause identified.";
  }

  return {
    nodes: allNodes,
    topCause,
    summary,
    totalFindingsTraced: findings.length,
    maxSeverityScore,
  };
}
