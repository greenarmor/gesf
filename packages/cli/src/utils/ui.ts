import chalk from "chalk";

const DIM = chalk.dim;
const BOLD = chalk.bold;
const GREEN = chalk.green;
const RED = chalk.red;
const YELLOW = chalk.yellow;
const CYAN = chalk.cyan;
const MAGENTA = chalk.magenta;
const GRAY = chalk.gray;

const icons = {
  success: GREEN("✓"),
  error: RED("✕"),
  warn: YELLOW("!"),
  info: CYAN("○"),
  arrow: GRAY("→"),
  bullet: GRAY("•"),
  check: GREEN("✓"),
  cross: RED("✕"),
  dash: GRAY("—"),
};

export function banner(title: string, subtitle?: string): void {
  const line = "═".repeat(52);
  console.log();
  console.log(CYAN(BOLD(`  ${title}`)));
  if (subtitle) {
    console.log(DIM(`  ${subtitle}`));
  }
  console.log(GRAY(`  ${line}`));
  console.log();
}

export function divider(width = 52): void {
  console.log(GRAY(`  ${"─".repeat(width)}`));
}

export function blank(): void {
  console.log();
}

export function success(message: string, detail?: string): void {
  console.log(`  ${icons.success} ${GREEN(message)}${detail ? DIM(` ${detail}`) : ""}`);
}

export function error(message: string, detail?: string): void {
  console.error(`  ${icons.error} ${RED(message)}${detail ? DIM(` ${detail}`) : ""}`);
}

export function warn(message: string, detail?: string): void {
  console.log(`  ${icons.warn} ${YELLOW(message)}${detail ? DIM(` ${detail}`) : ""}`);
}

export function info(message: string, detail?: string): void {
  console.log(`  ${icons.info} ${CYAN(message)}${detail ? DIM(` ${detail}`) : ""}`);
}

export function step(n: number, total: number, message: string): void {
  const counter = DIM(`[${n}/${total}]`);
  console.log(`\n  ${counter} ${BOLD(message)}`);
  console.log(GRAY(`  ${"─".repeat(40)}`));
}

export function kv(key: string, value: string, indent = 4): void {
  const pad = Math.max(key.length, 16);
  console.log(`${" ".repeat(indent)}${DIM(key.padEnd(pad))}  ${value}`);
}

export function label(text: string, color: typeof GREEN = CYAN): void {
  console.log(`\n  ${color(BOLD(text))}`);
}

export function item(text: string, value?: string): void {
  const v = value ? DIM(GRAY(` ${value}`)) : "";
  console.log(`    ${icons.bullet} ${text}${v}`);
}

export function group(title: string, lines: string[]): void {
  console.log(`\n  ${BOLD(title)}`);
  for (const line of lines) {
    console.log(`    ${icons.bullet} ${line}`);
  }
}

export function progressBar(current: number, total: number, width = 30): string {
  const pct = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  const bar = GREEN("█".repeat(filled)) + GRAY("░".repeat(empty));
  return `${bar} ${pct}%`;
}

export function statusBadge(status: string): string {
  const badges: Record<string, string> = {
    pass: GREEN("● PASS"),
    fail: RED("● FAIL"),
    warning: YELLOW("● WARN"),
    "not-implemented": GRAY("○ N/I"),
    "not-applicable": CYAN("◐ N/A"),
    approved: GREEN("● APPROVED"),
    rejected: RED("✕ REJECTED"),
    conditional: YELLOW("◔ CONDITIONAL"),
    "pending-review": YELLOW("◐ PENDING"),
    draft: GRAY("○ DRAFT"),
    expired: RED("⚠ EXPIRED"),
    valid: GREEN("✓ VALID"),
  };
  return badges[status] || GRAY(`○ ${status.toUpperCase()}`);
}

export function severityBadge(severity: string): string {
  const badges: Record<string, string> = {
    critical: RED(BOLD("CRITICAL")),
    high: RED("HIGH"),
    medium: YELLOW("MEDIUM"),
    low: CYAN("LOW"),
  };
  return badges[severity] || GRAY(severity.toUpperCase());
}

export function gradeColor(grade: string): string {
  if (grade === "A") return GREEN(BOLD(grade));
  if (grade === "B") return CYAN(BOLD(grade));
  if (grade === "C") return YELLOW(BOLD(grade));
  if (grade === "D") return MAGENTA(BOLD(grade));
  return RED(BOLD(grade));
}

export function updateNoticeBox(current: string, latest: string): void {
  const inner = `  ${YELLOW(BOLD("↻"))}  ${BOLD("Update available")}  ${DIM(GRAY(current))} ${GRAY("→")} ${GREEN(latest)}`;
  const innerLine2 = `     ${DIM("Run")} ${CYAN("ges update")} ${DIM("to upgrade, or")} ${CYAN("npm i -g @greenarmor/ges@latest")}`;
  const width = Math.max(inner.replace(/\x1b\[[0-9;]*m/g, "").length, 56) + 4;
  const top = GRAY(`  ┌${"─".repeat(width)}┐`);
  const mid1 = GRAY("  │") + " ".repeat(Math.max(0, (width - stripAnsi(inner).length) / 2 | 0)) + inner + " ".repeat(Math.max(0, width - stripAnsi(inner).length - ((width - stripAnsi(inner).length) / 2 | 0))) + GRAY("│");
  const mid2 = GRAY("  │") + " ".repeat(Math.max(0, (width - stripAnsi(innerLine2).length) / 2 | 0)) + innerLine2 + " ".repeat(Math.max(0, width - stripAnsi(innerLine2).length - ((width - stripAnsi(innerLine2).length) / 2 | 0))) + GRAY("│");
  const bot = GRAY(`  └${"─".repeat(width)}┘`);
  console.log();
  console.log(top);
  console.log(mid1);
  console.log(mid2);
  console.log(bot);
  console.log();
}

function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

export function updateNoticeLine(current: string, latest: string): void {
  console.error(`  ${YELLOW("↻")} ${DIM("Update available:")} ${current} ${GRAY("→")} ${latest}  ${DIM("Run")} ${CYAN("ges update")}`);
}

export { chalk, icons, DIM, BOLD, GREEN, RED, YELLOW, CYAN, MAGENTA, GRAY };
