import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');

interface Baselines {
  mockData: { maxViolations: number };
  brandCompliance: { hexInApp: number; backgroundLightInStylesApp: number };
  deadCodePatterns: { filesOnDisk: number };
  navigationBack: { missingBackScreens: number; duplicateHeaderScreens: number };
}

class CleanAuditRunner {
  private readonly strict: boolean;

  public constructor(strict: boolean) {
    this.strict = strict;
  }

  public run(): void {
    const baselines = this.loadBaselines();
    const violations: string[] = [];

    const mockCount = this.countMockViolations();
    if (mockCount > (this.strict ? 0 : baselines.mockData.maxViolations)) {
      violations.push(`mockData: ${mockCount} violations (max ${this.strict ? 0 : baselines.mockData.maxViolations})`);
    }

    const hexCount = this.countPatternInDir(
      path.join(ROOT, 'app'),
      /#666|#888|#333|#0000ff|#4A90E2|color="gray"/g,
    );
    if (hexCount > (this.strict ? 0 : baselines.brandCompliance.hexInApp)) {
      violations.push(`brandCompliance.hexInApp: ${hexCount} (max ${this.strict ? 0 : baselines.brandCompliance.hexInApp})`);
    }

    const backgroundLightCount = this.countPatternInDir(
      path.join(ROOT, 'styles/app'),
      /backgroundLight/g,
    );
    if (
      backgroundLightCount >
      (this.strict ? 0 : baselines.brandCompliance.backgroundLightInStylesApp)
    ) {
      violations.push(
        `brandCompliance.backgroundLightInStylesApp: ${backgroundLightCount} (max ${this.strict ? 0 : baselines.brandCompliance.backgroundLightInStylesApp})`,
      );
    }

    const deadFiles = this.countDeadFilesOnDisk();
    if (deadFiles > (this.strict ? 0 : baselines.deadCodePatterns.filesOnDisk)) {
      violations.push(`deadCodePatterns.filesOnDisk: ${deadFiles} (max ${this.strict ? 0 : baselines.deadCodePatterns.filesOnDisk})`);
    }

    const navIssues = this.countNavigationIssues();
    if (navIssues > (this.strict ? 0 : baselines.navigationBack.missingBackScreens)) {
      violations.push(`navigationBack: ${navIssues} issues`);
    }

    if (violations.length > 0) {
      console.error('Clean audit failed:\n' + violations.map((v) => `  - ${v}`).join('\n'));
      process.exit(1);
    }

    console.log('Clean audit passed.');
  }

  private loadBaselines(): Baselines {
    const raw = fs.readFileSync(path.join(__dirname, 'baselines.json'), 'utf8');
    return JSON.parse(raw) as Baselines;
  }

  private walk(dir: string, onFile: (filePath: string) => void): void {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        this.walk(full, onFile);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        onFile(full);
      }
    }
  }

  private countPatternInDir(dir: string, pattern: RegExp): number {
    let count = 0;
    this.walk(dir, (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    });
    return count;
  }

  private countMockViolations(): number {
    let count = 0;
    const mockDir = path.join(ROOT, 'constants/mock');
    if (fs.existsSync(mockDir)) count += 1;

    const scanDirs = ['app', 'components'];
    const patterns = [
      /@\/constants\/mock/g,
      /pm_mock/g,
      /unsplash\.com/g,
      /mock-organizer/g,
    ];

    for (const dirName of scanDirs) {
      this.walk(path.join(ROOT, dirName), (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        for (const pattern of patterns) {
          const matches = content.match(pattern);
          if (matches) count += matches.length;
        }
      });
    }

    return count;
  }

  private countDeadFilesOnDisk(): number {
    const denylist = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'deadCodeDenylist.json'), 'utf8'),
    ) as string[];

    return denylist.filter((rel) => fs.existsSync(path.join(ROOT, rel))).length;
  }

  private countNavigationIssues(): number {
    let issues = 0;

    const mainLayout = fs.readFileSync(path.join(ROOT, 'app/(main)/_layout.tsx'), 'utf8');
    const pushedScreens = ['teams', 'notifications', 'settings', 'subscriptionPlans', 'deleteAccount'];
    for (const screen of pushedScreens) {
      if (!mainLayout.includes(`name="${screen}"`) || !mainLayout.includes('tabPushedScreenOptions')) {
        issues += 1;
        break;
      }
    }

    const chatLayout = fs.readFileSync(path.join(ROOT, 'app/(chat)/_layout.tsx'), 'utf8');
    if (
      !chatLayout.includes('StackBackButton') ||
      !chatLayout.includes('rustSurfaceOptions') ||
      chatLayout.includes('HeaderTheme.lightOptions')
    ) {
      issues += 1;
    }

    const chatScreens = ['chatArea.tsx', 'messages.tsx', 'newChat.tsx', 'conversationSettings.tsx'];
    for (const screen of chatScreens) {
      const source = fs.readFileSync(path.join(ROOT, 'app/(chat)', screen), 'utf8');
      if (source.includes('<Stack.Screen')) {
        issues += 1;
        break;
      }
    }

    const editEvent = fs.readFileSync(path.join(ROOT, 'app/(events)/editEvent.tsx'), 'utf8');
    if (editEvent.includes('Stack.Screen options={{ title: "Edit Event" }}')) {
      issues += 1;
    }

    const eventsLayout = fs.readFileSync(path.join(ROOT, 'app/(events)/_layout.tsx'), 'utf8');
    if (eventsLayout.includes('name="chatArea"')) {
      issues += 1;
    }

    if (fs.existsSync(path.join(ROOT, 'app/(auth)/deleteAccount.tsx'))) {
      issues += 1;
    }

    const signIn = fs.readFileSync(path.join(ROOT, 'app/(auth)/signIn.tsx'), 'utf8');
    if (!signIn.includes('chevron-back')) {
      issues += 1;
    }

    return issues;
  }
}

const strict = process.argv.includes('--strict');
new CleanAuditRunner(strict).run();
