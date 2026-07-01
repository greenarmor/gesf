import type { InferenceFinding, FindingCluster, ClusteringResult } from "../types.js";

const SEVERITY_RANK: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Tokenize a string into normalized n-gram tokens.
 * Lowercase, strip non-alphanumeric, split on whitespace, then generate 2-grams + 3-grams.
 */
function tokenize(text: string): string[] {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
  if (!cleaned) return [];
  const words = cleaned.split(/\s+/).filter((w) => w.length > 1);

  const tokens = [...words];
  for (let i = 0; i < words.length - 1; i++) {
    tokens.push(`${words[i]} ${words[i + 1]}`);
  }
  for (let i = 0; i < words.length - 2; i++) {
    tokens.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  return tokens;
}

/**
 * Build a term-frequency map from a set of tokens.
 */
function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) ?? 0) + 1);
  }
  return tf;
}

/**
 * Compute cosine similarity between two term-frequency vectors.
 */
function cosineSimilarity(tfA: Map<string, number>, tfB: Map<string, number>): number {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  const keys = new Set([...tfA.keys(), ...tfB.keys()]);
  for (const key of keys) {
    const a = tfA.get(key) ?? 0;
    const b = tfB.get(key) ?? 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

const SIMILARITY_THRESHOLD = 0.55;

/**
 * Cluster findings using cosine similarity on n-gram token vectors.
 * Two findings are in the same cluster if they share the same ruleId,
 * or if their text similarity exceeds the threshold.
 *
 * Uses a greedy union-join approach: iterate findings, assign to the first
 * sufficiently similar existing cluster, or create a new one.
 */
export function clusterFindings(findings: InferenceFinding[]): ClusteringResult {
  if (findings.length === 0) {
    return {
      totalFindings: 0,
      clusterCount: 0,
      clusters: [],
      reductionRatio: 0,
    };
  }

  // Pre-compute term-frequency vectors for each finding
  const tfVectors = findings.map((f) => {
    const combinedText = `${f.ruleId} ${f.category} ${f.title} ${f.description} ${f.evidence}`;
    return termFrequency(tokenize(combinedText));
  });

  // Union-Find data structure
  const parent = findings.map((_, i) => i);

  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  function union(x: number, y: number): void {
    const px = find(x);
    const py = find(y);
    if (px !== py) parent[py] = px;
  }

  // Compare all pairs — O(n²) but finding counts in GESF are typically < 500
  for (let i = 0; i < findings.length; i++) {
    for (let j = i + 1; j < findings.length; j++) {
      if (find(i) === find(j)) continue;

      // Same ruleId → always cluster together
      if (findings[i].ruleId === findings[j].ruleId) {
        union(i, j);
        continue;
      }

      const similarity = cosineSimilarity(tfVectors[i], tfVectors[j]);
      if (similarity >= SIMILARITY_THRESHOLD) {
        union(i, j);
      }
    }
  }

  // Group findings by cluster root
  const clusterMap = new Map<number, number[]>();
  for (let i = 0; i < findings.length; i++) {
    const root = find(i);
    if (!clusterMap.has(root)) clusterMap.set(root, []);
    clusterMap.get(root)!.push(i);
  }

  // Build cluster objects
  const clusters: FindingCluster[] = [];
  let clusterIdx = 0;
  for (const [root, indices] of clusterMap) {
    const memberFindings = indices.map((i) => findings[i]);

    // Pick the highest-severity finding as representative
    const representativeIdx = indices.reduce((best, current) => {
      const bestSev = SEVERITY_RANK[findings[best].severity] ?? 0;
      const curSev = SEVERITY_RANK[findings[current].severity] ?? 0;
      return curSev > bestSev ? current : best;
    }, indices[0]);
    const representative = findings[representativeIdx];

    // Aggregate unique files
    const fileSet = new Set(memberFindings.map((f) => f.file));

    // Determine cluster severity (max of members)
    const maxSeverity = memberFindings.reduce((max, f) => {
      return (SEVERITY_RANK[f.severity] ?? 0) > (SEVERITY_RANK[max] ?? 0) ? f.severity : max;
    }, memberFindings[0].severity as string);

    // Generate a pattern description from the most common ruleId
    const ruleIdCounts = new Map<string, number>();
    for (const f of memberFindings) {
      ruleIdCounts.set(f.ruleId, (ruleIdCounts.get(f.ruleId) ?? 0) + 1);
    }
    const dominantRuleId = [...ruleIdCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];

    clusters.push({
      clusterId: `CLUSTER-${String(clusterIdx + 1).padStart(3, "0")}`,
      pattern: dominantRuleId,
      ruleId: dominantRuleId,
      category: representative.category,
      severity: maxSeverity as InferenceFinding["severity"],
      findingCount: indices.length,
      files: [...fileSet].sort(),
      representativeTitle: representative.title,
      representativeFix: representative.fix,
      findingIndices: indices,
    });
    clusterIdx++;
  }

  // Sort clusters by finding count descending
  clusters.sort((a, b) => b.findingCount - a.findingCount);

  const reductionRatio = findings.length > 0
    ? (1 - clusters.length / findings.length) * 100
    : 0;

  return {
    totalFindings: findings.length,
    clusterCount: clusters.length,
    clusters,
    reductionRatio: Math.round(reductionRatio * 10) / 10,
  };
}
