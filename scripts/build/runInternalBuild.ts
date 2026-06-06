import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const IOS_SCHEME = 'kinshipSync';
const IOS_WORKSPACE = path.join(ROOT, 'ios', 'kinshipSync.xcworkspace');
const ANDROID_APK_SOURCE = path.join(
  ROOT,
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk',
);
const IOS_APP_SOURCE = path.join(
  ROOT,
  'ios',
  'build',
  'Build',
  'Products',
  'Release-iphoneos',
  `${IOS_SCHEME}.app`,
);
const IOS_ARCHIVE_PATH = path.join(ROOT, 'ios', 'build', `${IOS_SCHEME}.xcarchive`);
const EXPORT_OPTIONS_PLIST = path.join(__dirname, 'iosExportOptions.plist');

type BuildPlatform = 'android' | 'ios' | 'all';

interface InternalBuildOptions {
  platform: BuildPlatform;
  exportIpa: boolean;
}

class InternalBuildRunner {
  private readonly platform: BuildPlatform;
  private readonly exportIpa: boolean;
  private readonly version: string;
  private readonly distRoot: string;

  public constructor(options: InternalBuildOptions) {
    this.platform = options.platform;
    this.exportIpa = options.exportIpa;
    this.version = this.readAppVersion();
    this.distRoot = path.join(ROOT, 'dist', 'internal');
  }

  public run(): void {
    console.log('Local internal build (no EAS credits used).');
    console.log(`App version: ${this.version}`);
    console.log('Env vars from .env are inlined at bundle time via babel-plugin-inline-dotenv.\n');

    if (this.platform === 'android' || this.platform === 'all') {
      this.buildAndroid();
    }

    if (this.platform === 'ios' || this.platform === 'all') {
      this.buildIos();
    }

    console.log('\nInternal build complete.');
  }

  private readAppVersion(): string {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'),
    ) as { version: string };
    return packageJson.version;
  }

  private buildEnv(): NodeJS.ProcessEnv {
    return {
      ...process.env,
      EAS_BUILD_PROFILE: 'preview',
      REACT_NATIVE_PACKAGER_HOSTNAME: process.env.REACT_NATIVE_PACKAGER_HOSTNAME ?? 'localhost',
    };
  }

  private ensureNativeProject(platform: 'android' | 'ios'): void {
    const nativeDir = path.join(ROOT, platform);
    if (fs.existsSync(nativeDir)) {
      return;
    }

    console.log(`Native ${platform}/ project missing — running expo prebuild...`);
    this.runCommand('npx', ['expo', 'prebuild', '--platform', platform, '--no-install'], {
      cwd: ROOT,
      env: this.buildEnv(),
    });
  }

  private buildAndroid(): void {
    console.log('--- Android internal release APK ---');
    this.ensureNativeProject('android');

    this.runCommand(
      'npx',
      ['expo', 'run:android', '--variant', 'release', '--no-bundler'],
      { cwd: ROOT, env: this.buildEnv() },
    );

    if (!fs.existsSync(ANDROID_APK_SOURCE)) {
      console.error(`Expected APK not found at ${ANDROID_APK_SOURCE}`);
      process.exit(1);
    }

    const distDir = path.join(this.distRoot, 'android');
    fs.mkdirSync(distDir, { recursive: true });
    const apkDest = path.join(distDir, `kinshipsync-${this.version}-internal.apk`);
    fs.copyFileSync(ANDROID_APK_SOURCE, apkDest);
    console.log(`\nAndroid APK ready: ${apkDest}`);
  }

  private buildIos(): void {
    console.log('--- iOS internal release build ---');
    this.ensureNativeProject('ios');

    if (this.exportIpa) {
      this.exportIosIpa();
      return;
    }

    const deviceArgs = this.hasConnectedIosDevice() ? ['-d'] : [];
    if (deviceArgs.length === 0) {
      console.log('No physical iOS device detected — building for simulator.');
    }

    this.runCommand(
      'npx',
      [
        'expo',
        'run:ios',
        '--configuration',
        'Release',
        '--no-bundler',
        ...deviceArgs,
      ],
      { cwd: ROOT, env: this.buildEnv() },
    );

    if (fs.existsSync(IOS_APP_SOURCE)) {
      const distDir = path.join(this.distRoot, 'ios');
      fs.mkdirSync(distDir, { recursive: true });
      const appDest = path.join(distDir, `${IOS_SCHEME}-${this.version}-internal.app`);
      this.copyDirectory(IOS_APP_SOURCE, appDest);
      console.log(`\niOS app bundle ready: ${appDest}`);
      return;
    }

    console.log('\niOS build finished. Install from Xcode Devices or re-run with --export-ipa for an IPA.');
  }

  private exportIosIpa(): void {
    if (!fs.existsSync(IOS_WORKSPACE)) {
      console.error(`iOS workspace not found at ${IOS_WORKSPACE}`);
      process.exit(1);
    }

    console.log('Archiving iOS app for IPA export...');
    fs.mkdirSync(path.dirname(IOS_ARCHIVE_PATH), { recursive: true });

    this.runCommand(
      'xcodebuild',
      [
        '-workspace',
        IOS_WORKSPACE,
        '-scheme',
        IOS_SCHEME,
        '-configuration',
        'Release',
        '-archivePath',
        IOS_ARCHIVE_PATH,
        'archive',
      ],
      { cwd: ROOT, env: this.buildEnv() },
    );

    const exportDir = path.join(this.distRoot, 'ios');
    fs.mkdirSync(exportDir, { recursive: true });

    this.runCommand(
      'xcodebuild',
      [
        '-exportArchive',
        '-archivePath',
        IOS_ARCHIVE_PATH,
        '-exportPath',
        exportDir,
        '-exportOptionsPlist',
        EXPORT_OPTIONS_PLIST,
      ],
      { cwd: ROOT, env: this.buildEnv() },
    );

    const ipaPath = path.join(exportDir, `${IOS_SCHEME}.ipa`);
    const ipaDest = path.join(exportDir, `kinshipsync-${this.version}-internal.ipa`);
    if (fs.existsSync(ipaPath)) {
      fs.renameSync(ipaPath, ipaDest);
      console.log(`\niOS IPA ready: ${ipaDest}`);
      return;
    }

    const exportedIpa = fs
      .readdirSync(exportDir)
      .find((file) => file.endsWith('.ipa'));
    if (exportedIpa) {
      console.log(`\niOS IPA ready: ${path.join(exportDir, exportedIpa)}`);
      return;
    }

    console.error('IPA export finished but no .ipa file was found in dist/internal/ios');
    process.exit(1);
  }

  private hasConnectedIosDevice(): boolean {
    const result = spawnSync('xcrun', ['xctrace', 'list', 'devices'], {
      encoding: 'utf8',
    });
    if (result.status !== 0) {
      return false;
    }

    let inDevicesSection = false;
    for (const line of result.stdout.split('\n')) {
      if (line.includes('== Devices ==')) {
        inDevicesSection = true;
        continue;
      }
      if (inDevicesSection && line.includes('==') && !line.includes('== Devices ==')) {
        break;
      }
      if (inDevicesSection && line.trim().length > 0 && !line.includes('Simulator')) {
        return true;
      }
    }

    return false;
  }

  private runCommand(
    command: string,
    args: string[],
    options: { cwd?: string; env?: NodeJS.ProcessEnv },
  ): void {
    console.log(`\n> ${command} ${args.join(' ')}\n`);
    const result = spawnSync(command, args, {
      cwd: options.cwd ?? ROOT,
      env: options.env ?? process.env,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }

  private copyDirectory(source: string, destination: string): void {
    fs.rmSync(destination, { recursive: true, force: true });
    fs.cpSync(source, destination, { recursive: true });
  }
}

function parseArgs(): InternalBuildOptions {
  const args = process.argv.slice(2);
  let platform: BuildPlatform = 'all';
  let exportIpa = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--platform' && args[index + 1]) {
      const value = args[index + 1];
      if (value === 'android' || value === 'ios' || value === 'all') {
        platform = value;
      }
      index += 1;
      continue;
    }
    if (arg === '--export-ipa') {
      exportIpa = true;
    }
  }

  return { platform, exportIpa };
}

new InternalBuildRunner(parseArgs()).run();
