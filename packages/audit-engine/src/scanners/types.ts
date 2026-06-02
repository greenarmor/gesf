export interface Finding {
  ruleId: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  file: string;
  line?: number;
  evidence: string;
  controlIds: string[];
  fix: string;
}

export interface ScanContext {
  root: string;
  files: string[];
  fileContents: Map<string, string>;
  config?: Record<string, unknown>;
  isWebProject?: boolean;
}

export interface Scanner {
  name: string;
  scan(ctx: ScanContext): Finding[];
}
