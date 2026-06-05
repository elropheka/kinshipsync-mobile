import { spawn, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const DEFAULT_METRO_URL = process.env.RUNTIME_SMOKE_METRO_URL ?? 'http://localhost:8081';
const DEFAULT_CAPTURE_SECONDS = Number(process.env.RUNTIME_SMOKE_LOG_SECONDS ?? '45');
const DEV_CLIENT_SCHEME = 'exp+kinshipsync://expo-development-client/';

class IosBootSmokeRunner {
  private readonly metroUrl: string;
  private readonly captureSeconds: number;

  public constructor(metroUrl: string, captureSeconds: number) {
    this.metroUrl = metroUrl;
    this.captureSeconds = captureSeconds;
  }

  public async run(): Promise<void> {
    this.assertMetroRunning();
    this.assertSimulatorBooted();

    const deepLink = `${DEV_CLIENT_SCHEME}?url=${encodeURIComponent(this.metroUrl)}`;
    console.log(`Opening dev client: ${deepLink}`);
    this.openDeepLink(deepLink);

    const logFile = path.join(os.tmpdir(), `kinshipsync-ios-smoke-${Date.now()}.log`);
    console.log(`Capturing logs for ${this.captureSeconds}s -> ${logFile}`);

    await this.captureLogs(logFile);
    this.runLogAudit(logFile);

    fs.unlinkSync(logFile);
    console.log('iOS boot smoke passed.');
  }

  private assertMetroRunning(): void {
    const result = spawnSync('curl', ['-sf', `${this.metroUrl}/status`], { encoding: 'utf8' });
    if (result.status !== 0) {
      console.error(`Metro is not reachable at ${this.metroUrl}/status`);
      console.error('Start Metro first: pnpm start:dev');
      process.exit(1);
    }
  }

  private assertSimulatorBooted(): void {
    const result = spawnSync('xcrun', ['simctl', 'list', 'devices', 'booted'], { encoding: 'utf8' });
    if (result.status !== 0 || !result.stdout.includes('Booted')) {
      console.error('No booted iOS simulator found. Boot one before running audit:runtime:ios.');
      process.exit(1);
    }
  }

  private openDeepLink(deepLink: string): void {
    const result = spawnSync('xcrun', ['simctl', 'openurl', 'booted', deepLink], { encoding: 'utf8' });
    if (result.status !== 0) {
      console.error('Failed to open dev-client deep link on simulator.');
      console.error(result.stderr || result.stdout);
      process.exit(1);
    }
  }

  private async captureLogs(logFile: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const logStream = spawn(
        'xcrun',
        [
          'simctl',
          'spawn',
          'booted',
          'log',
          'stream',
          '--style',
          'compact',
          '--predicate',
          `processImagePath CONTAINS "kinshipSync" OR subsystem CONTAINS "com.kinshipsyncapp" OR eventMessage CONTAINS "React" OR eventMessage CONTAINS "ErrorBoundary" OR eventMessage CONTAINS "TypeError"`,
        ],
        { stdio: ['ignore', 'pipe', 'pipe'] },
      );

      const chunks: Buffer[] = [];
      logStream.stdout?.on('data', (chunk: Buffer) => chunks.push(chunk));
      logStream.stderr?.on('data', (chunk: Buffer) => chunks.push(chunk));

      const timer = setTimeout(() => {
        logStream.kill('SIGTERM');
      }, this.captureSeconds * 1000);

      logStream.on('close', () => {
        clearTimeout(timer);
        fs.writeFileSync(logFile, Buffer.concat(chunks).toString('utf8'));
        resolve();
      });

      logStream.on('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  private runLogAudit(logFile: string): void {
    const auditScript = path.join(__dirname, 'runLogSmokeAudit.ts');
    const result = spawnSync('pnpm', ['exec', 'tsx', auditScript, logFile], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    });

    if (result.stdout) {
      process.stdout.write(result.stdout);
    }
    if (result.stderr) {
      process.stderr.write(result.stderr);
    }

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}

new IosBootSmokeRunner(DEFAULT_METRO_URL, DEFAULT_CAPTURE_SECONDS)
  .run()
  .catch((error: unknown) => {
    console.error('iOS boot smoke failed:', error);
    process.exit(1);
  });
