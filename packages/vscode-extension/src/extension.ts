import * as vscode from "vscode";
import * as fs from "node:fs";
import * as path from "node:path";

let diagnosticCollection: vscode.DiagnosticCollection;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection("gesf");
  context.subscriptions.push(diagnosticCollection);

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  statusBarItem.command = "gesf.showScore";
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand("gesf.runAudit", runAudit),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("gesf.showScore", showScore),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("gesf.generateReport", generateReport),
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(() => checkProject()),
  );
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => checkProject()),
  );

  checkProject();
}

function getProjectRoot(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return undefined;
  const root = folders[0].uri.fsPath;
  if (fs.existsSync(path.join(root, ".ges", "config.json"))) return root;
  return undefined;
}

function checkProject() {
  const root = getProjectRoot();
  if (!root) {
    statusBarItem.hide();
    return;
  }

  const warnings = detectComplianceWarnings(root);
  const diagnostics: vscode.Diagnostic[] = [];

  for (const warning of warnings) {
    const uri = vscode.Uri.file(path.join(root, warning.file));
    const line = warning.line || 0;
    const range = new vscode.Range(line, 0, line, 100);
    const severity =
      warning.severity === "critical"
        ? vscode.DiagnosticSeverity.Error
        : warning.severity === "high"
          ? vscode.DiagnosticSeverity.Warning
          : vscode.DiagnosticSeverity.Information;
    const diag = new vscode.Diagnostic(range, `[GESF] ${warning.message}`, severity);
    diag.source = "gesf";
    diagnostics.push(diag);
  }

  diagnosticCollection.clear();
  for (const warning of warnings) {
    const uri = vscode.Uri.file(path.join(root, warning.file));
    const fileDiags = diagnostics.filter((_, i) => warnings[i].file === warning.file);
    diagnosticCollection.set(uri, fileDiags);
  }

  updateStatusBar(root);
}

interface ComplianceWarning {
  file: string;
  line?: number;
  severity: string;
  message: string;
}

function detectComplianceWarnings(root: string): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];
  const configPath = path.join(root, ".ges", "config.json");

  if (!fs.existsSync(configPath)) {
    warnings.push({
      file: "package.json",
      severity: "high",
      message: "GESF not initialized. Run 'ges init' to set up compliance controls.",
    });
    return warnings;
  }

  let config: Record<string, unknown>;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch {
    return warnings;
  }

  const pkgPath = path.join(root, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.express && !deps.helmet) {
        warnings.push({
          file: "package.json",
          severity: "high",
          message: "Missing security headers. Install 'helmet' middleware.",
        });
      }

      if (deps.express && !deps.cors) {
        warnings.push({
          file: "package.json",
          severity: "medium",
          message: "No CORS configuration detected. Install 'cors' package.",
        });
      }
    } catch {}
  }

  if (!fs.existsSync(path.join(root, ".gitignore"))) {
    warnings.push({
      file: ".gitignore",
      severity: "high",
      message: "No .gitignore file. Secrets may be committed accidentally.",
    });
  }

  const gitignorePath = path.join(root, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, "utf-8");
    if (!gitignore.includes(".env")) {
      warnings.push({
        file: ".gitignore",
        severity: "critical",
        message: ".env not in .gitignore. Environment secrets may be committed.",
      });
    }
  }

  const requirements = config.requirements as Record<string, { required: boolean }> | undefined;
  if (requirements?.mfa?.required) {
    const hasMFA = checkForMFA(root);
    if (!hasMFA) {
      warnings.push({
        file: "package.json",
        severity: "high",
        message: "MFA is required by GESF config but no MFA implementation detected.",
      });
    }
  }

  if (requirements?.encryption?.required) {
    const hasEncryption = checkForEncryption(root);
    if (!hasEncryption) {
      warnings.push({
        file: "package.json",
        severity: "critical",
        message: "Encryption is required by GESF config but no encryption detected.",
      });
    }
  }

  if (requirements?.retention_policy?.required) {
    if (!fs.existsSync(path.join(root, "compliance", "retention-policy.md"))) {
      warnings.push({
        file: "compliance/retention-policy.md",
        severity: "medium",
        message: "Retention policy document missing. Run 'ges generate --docs'.",
      });
    }
  }

  return warnings;
}

function checkForMFA(root: string): boolean {
  const pkgPath = path.join(root, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const mfaLibs = ["otpauth", "speakeasy", "otplib", "@simplewebauthn", "node-2fa"];
      return mfaLibs.some((lib) => deps[lib] !== undefined);
    } catch {}
  }
  return false;
}

function checkForEncryption(root: string): boolean {
  const dirs = ["src", "lib", "crypto", "security"];
  const patterns = [/aes-256/i, /AES_256_GCM/i, /createCipheriv/i, /ChaCha20/i, /crypto\.encrypt/i];

  for (const dir of dirs) {
    const dirPath = path.join(root, dir);
    if (!fs.existsSync(dirPath)) continue;
    try {
      const entries = fs.readdirSync(dirPath, { recursive: true });
      for (const entry of entries) {
        const filePath = path.join(dirPath, entry.toString());
        if (!fs.statSync(filePath).isFile()) continue;
        const ext = path.extname(filePath);
        if (![".ts", ".js"].includes(ext)) continue;
        const content = fs.readFileSync(filePath, "utf-8");
        if (patterns.some((p) => p.test(content))) return true;
      }
    } catch {}
  }
  return false;
}

function updateStatusBar(root: string) {
  const scorePath = path.join(root, ".ges", "score.json");
  if (fs.existsSync(scorePath)) {
    try {
      const score = JSON.parse(fs.readFileSync(scorePath, "utf-8"));
      const overall = score.overall || 0;
      const grade = score.overall_grade || "?";
      const icon = overall >= 80 ? "$(checkmark)" : overall >= 50 ? "$(warning)" : "$(error)";
      statusBarItem.text = `${icon} GESF: ${overall}% (${grade})`;
    } catch {
      statusBarItem.text = "$(question) GESF: No score";
    }
  } else {
    statusBarItem.text = "$(warning) GESF: Run audit";
  }
  statusBarItem.show();
}

async function runAudit() {
  const terminal = vscode.window.createTerminal("GESF Audit");
  terminal.show();
  terminal.sendText("ges audit");
}

async function showScore() {
  const terminal = vscode.window.createTerminal("GESF Score");
  terminal.show();
  terminal.sendText("ges score");
}

async function generateReport() {
  const format = await vscode.window.showQuickPick(["markdown", "html", "pdf"], {
    placeHolder: "Select report format",
  });
  if (!format) return;
  const terminal = vscode.window.createTerminal("GESF Report");
  terminal.show();
  terminal.sendText(`ges report --format ${format}`);
}

export function deactivate() {
  diagnosticCollection?.clear();
  statusBarItem?.hide();
}
