import * as readline from "node:readline";
import { chalk, DIM, BOLD, GREEN, CYAN, GRAY, YELLOW } from "./ui.js";

function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}

function createRL(): readline.Interface {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

interface InquirerModule {
  input(options: { message: string; default?: string; transformer?: (val: string) => string }): Promise<string>;
  select<T>(options: { message: string; choices: { name: string; value: T; description?: string; short?: string }[]; theme?: unknown; pageSize?: number }): Promise<T>;
  checkbox<T>(options: { message: string; choices: { name: string; value: T; checked?: boolean; description?: string }[]; theme?: unknown; pageSize?: number }): Promise<T[]>;
  confirm(options: { message: string; default?: boolean; theme?: unknown }): Promise<boolean>;
}
let cachedInquirer: InquirerModule | null | undefined;

async function getInquirer(): Promise<InquirerModule | null> {
  if (cachedInquirer !== undefined) return cachedInquirer;
  try {
    const mod: InquirerModule = await import(String("@inquirer/prompts"));
    cachedInquirer = mod;
  } catch {
    cachedInquirer = null;
  }
  return cachedInquirer;
}

const selectTheme = {
  prefix: { idle: chalk.gray("?"), done: chalk.green("✓") },
  helpMode: "always" as const,
};

const checkboxTheme = {
  prefix: { idle: chalk.gray("?"), done: chalk.green("✓") },
  helpMode: "always" as const,
};

const inputTheme = {
  prefix: { idle: chalk.gray("?"), done: chalk.green("✓") },
};

export async function input(options: { message: string; default?: string }): Promise<string> {
  if (!isInteractive()) {
    return options.default ?? "";
  }

  const inquirer = await getInquirer();
  if (inquirer) {
    return inquirer.input({ message: options.message, default: options.default });
  }

  const rl = createRL();
  const suffix = options.default ? DIM(` (${options.default})`) : "";
  return new Promise((resolve) => {
    rl.question(`  ${GRAY("?")} ${options.message}${suffix}${GRAY(":")} `, (answer) => {
      rl.close();
      resolve(answer.trim() || options.default || "");
    });
  });
}

export async function select<T = string>(options: { message: string; choices: { name: string; value: T; description?: string }[]; pageSize?: number }): Promise<T> {
  if (!isInteractive()) {
    return options.choices[0].value;
  }

  const inquirer = await getInquirer();
  if (inquirer) {
    return inquirer.select({
      message: options.message,
      choices: options.choices,
      theme: selectTheme as Record<string, unknown>,
      pageSize: options.pageSize ?? 10,
    }) as Promise<T>;
  }

  console.log(`\n  ${CYAN(options.message)}:\n`);
  options.choices.forEach((c, i) => {
    const num = GRAY(`${String(i + 1).padStart(2)}.`);
    console.log(`    ${num} ${c.name}`);
  });

  const rl = createRL();
  return new Promise((resolve) => {
    rl.question(`\n  ${GRAY("Enter choice")} [1-${options.choices.length}]: `, (answer) => {
      rl.close();
      const num = parseInt(answer.trim(), 10);
      if (num >= 1 && num <= options.choices.length) {
        resolve(options.choices[num - 1].value);
      } else {
        resolve(options.choices[0].value);
      }
    });
  });
}

export async function checkbox<T = string>(options: { message: string; choices: { name: string; value: T; checked?: boolean; description?: string }[]; pageSize?: number }): Promise<T[]> {
  if (!isInteractive()) {
    return options.choices.filter(c => c.checked).map(c => c.value);
  }

  const inquirer = await getInquirer();
  if (inquirer) {
    return inquirer.checkbox({
      message: options.message,
      choices: options.choices,
      theme: checkboxTheme as Record<string, unknown>,
      pageSize: options.pageSize ?? 10,
    }) as Promise<T[]>;
  }

  console.log(`\n  ${CYAN(options.message)} ${GRAY("(comma-separated numbers)")}\n`);
  options.choices.forEach((c, i) => {
    const marker = c.checked ? GREEN("[x]") : GRAY("[ ]");
    const num = `${String(i + 1).padStart(2)}.`;
    console.log(`    ${marker} ${GRAY(num)} ${c.name}`);
  });

  const rl = createRL();
  return new Promise((resolve) => {
    rl.question(`\n  ${GRAY("Enter choices")} [1-${options.choices.length}]: `, (answer) => {
      rl.close();
      const trimmed = answer.trim();
      if (!trimmed) {
        resolve(options.choices.filter(c => c.checked).map(c => c.value));
        return;
      }
      const indices = trimmed.split(",").map(s => parseInt(s.trim(), 10) - 1).filter(n => n >= 0 && n < options.choices.length);
      if (indices.length === 0) {
        resolve(options.choices.filter(c => c.checked).map(c => c.value));
        return;
      }
      resolve([...new Set(indices)].map(i => options.choices[i].value));
    });
  });
}

export async function confirm(options: { message: string; default?: boolean }): Promise<boolean> {
  if (!isInteractive()) {
    return options.default ?? false;
  }

  const inquirer = await getInquirer();
  if (inquirer) {
    return inquirer.confirm({
      message: options.message,
      default: options.default,
      theme: inputTheme as Record<string, unknown>,
    });
  }

  const suffix = options.default !== undefined ? ` (${options.default ? "Y/n" : "y/N"})` : " (y/n)";
  const rl = createRL();
  return new Promise((resolve) => {
    rl.question(`  ${GRAY("?")} ${options.message}${suffix}: `, (answer) => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();
      if (!trimmed) {
        resolve(options.default ?? false);
      } else {
        resolve(trimmed === "y" || trimmed === "yes");
      }
    });
  });
}
