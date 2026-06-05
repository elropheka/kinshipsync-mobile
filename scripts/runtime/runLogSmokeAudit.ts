import * as fs from 'fs';
import * as path from 'path';

interface DenylistPattern {
  id: string;
  pattern: string;
  message: string;
}

interface DenylistConfig {
  patterns: DenylistPattern[];
}

class LogSmokeAuditRunner {
  private readonly strict: boolean;
  private readonly inputPath: string | null;

  public constructor(strict: boolean, inputPath: string | null) {
    this.strict = strict;
    this.inputPath = inputPath;
  }

  public run(): void {
    const config = this.loadDenylist();
    const content = this.readInput();
    const violations = this.scan(content, config.patterns);

    if (violations.length > 0) {
      console.error('Runtime log audit failed:\n' + violations.map((v) => `  - ${v}`).join('\n'));
      process.exit(1);
    }

    console.log('Runtime log audit passed.');
  }

  private loadDenylist(): DenylistConfig {
    const raw = fs.readFileSync(path.join(__dirname, 'logDenylist.json'), 'utf8');
    return JSON.parse(raw) as DenylistConfig;
  }

  private readInput(): string {
    if (this.inputPath) {
      if (!fs.existsSync(this.inputPath)) {
        console.error(`Log file not found: ${this.inputPath}`);
        process.exit(1);
      }
      return fs.readFileSync(this.inputPath, 'utf8');
    }

    if (process.stdin.isTTY) {
      console.error('Usage: pnpm audit:runtime:logs <log-file>');
      console.error('   or: pnpm ios 2>&1 | pnpm audit:runtime:logs');
      process.exit(1);
    }

    return fs.readFileSync(0, 'utf8');
  }

  private scan(content: string, patterns: DenylistPattern[]): string[] {
    const lines = content.split('\n');
    const violations: string[] = [];
    const seen = new Set<string>();

    for (const entry of patterns) {
      const regex = new RegExp(entry.pattern, this.strict ? '' : 'i');
      const matchingLines = lines
        .map((line, index) => ({ line, index: index + 1 }))
        .filter(({ line }) => regex.test(line));

      if (matchingLines.length === 0) {
        continue;
      }

      for (const match of matchingLines.slice(0, 3)) {
        const key = `${entry.id}:${match.index}`;
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        violations.push(`${entry.id}: ${entry.message} (line ${match.index}: ${match.line.trim()})`);
      }

      if (matchingLines.length > 3) {
        violations.push(`${entry.id}: ${matchingLines.length - 3} additional match(es) omitted`);
      }
    }

    return violations;
  }
}

const strict = process.argv.includes('--strict');
const inputPath = process.argv.find((arg) => !arg.startsWith('-') && arg !== process.argv[0] && arg !== process.argv[1]) ?? null;

new LogSmokeAuditRunner(strict, inputPath).run();
