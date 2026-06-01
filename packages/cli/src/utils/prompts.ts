import * as readline from "node:readline";

function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}

function createRL(): readline.Interface {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

type InquirerModule = typeof import("@inquirer/prompts") | null;
let cachedInquirer: InquirerModule | undefined;

async function getInquirer(): Promise<InquirerModule> {
  if (cachedInquirer !== undefined) return cachedInquirer;
  try {
    cachedInquirer = await import("@inquirer/prompts");
  } catch {
    cachedInquirer = null;
  }
  return cachedInquirer;
}

export async function input(options: { message: string; default?: string }): Promise<string> {
  if (!isInteractive()) {
    return options.default ?? "";
  }

  const inquirer = await getInquirer();
  if (inquirer) {
    return inquirer.input({ message: options.message, default: options.default });
  }

  const rl = createRL();
  const suffix = options.default ? ` (${options.default})` : "";
  return new Promise((resolve) => {
    rl.question(`  ${options.message}${suffix}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || options.default || "");
    });
  });
}

export async function select<T = string>(options: { message: string; choices: { name: string; value: T }[] }): Promise<T> {
  if (!isInteractive()) {
    return options.choices[0].value;
  }

  const inquirer = await getInquirer();
  if (inquirer) {
    return inquirer.select({ message: options.message, choices: options.choices }) as Promise<T>;
  }

  console.log(`\n  ${options.message}:\n`);
  options.choices.forEach((c, i) => {
    console.log(`    ${i + 1}) ${c.name}`);
  });

  const rl = createRL();
  return new Promise((resolve) => {
    rl.question(`\n  Enter choice [1-${options.choices.length}]: `, (answer) => {
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

export async function checkbox<T = string>(options: { message: string; choices: { name: string; value: T; checked?: boolean }[] }): Promise<T[]> {
  if (!isInteractive()) {
    return options.choices.filter(c => c.checked).map(c => c.value);
  }

  const inquirer = await getInquirer();
  if (inquirer) {
    return inquirer.checkbox({ message: options.message, choices: options.choices }) as Promise<T[]>;
  }

  console.log(`\n  ${options.message} (comma-separated numbers):\n`);
  options.choices.forEach((c, i) => {
    const marker = c.checked ? "[x]" : "[ ]";
    console.log(`    ${marker} ${i + 1}) ${c.name}`);
  });

  const rl = createRL();
  return new Promise((resolve) => {
    rl.question(`\n  Enter choices [1-${options.choices.length}]: `, (answer) => {
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
