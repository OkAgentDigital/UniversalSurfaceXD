import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { homedir } from 'os';

import { spawn, execSync } from 'child_process';
import { EventEmitter } from 'events';

// ============================================================
// Types
// ============================================================

interface StackComponent {
  name: string;
  source: string;
  version: string;
  required?: boolean;
  config?: Record<string, any>;
}

interface StackBuildConfig {
  output: string;
  target_os: string[];
  target_arch: string[];
  icon?: string;
  notarize?: boolean;
  codesign?: boolean;
  static_linking?: boolean;
  strip_symbols?: boolean;
  compression?: string;
  no_cgo?: boolean;
  single_binary?: boolean;
  [key: string]: any;
}

interface StackRuntimeConfig {
  min_memory_mb: number;
  recommended_memory_mb: number;
  no_gui?: boolean;
  service_mode?: boolean;
  persistence?: boolean;
  auto_update?: boolean;
  readonly_root?: boolean;
  ephemeral?: boolean;
  game_mode?: boolean;
  no_persistence?: boolean;
  [key: string]: any;
}

interface StackConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  license?: string;
  components: StackComponent[];
  excluded_components?: string[];
  build: StackBuildConfig;
  runtime: StackRuntimeConfig;
  max_size_mb: number;
  actual_size_mb?: number;
}

interface StackBuildResult {
  success: boolean;
  outputPath?: string;
  sizeMb?: number;
  errors: string[];
}

interface StackValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================
// Stack Manager
// ============================================================

class StackManager extends EventEmitter {
  private stacksDir: string;
  private installedStacks: Map<string, StackConfig> = new Map();
  private registryCache: Map<string, boolean> = new Map();

  constructor() {
    super();
    this.stacksDir = join(homedir(), '.local', 'share', 'universui', 'stacks');
    this.ensureDirectories();
    this.loadInstalledStacks();
  }

  // ─── Initialization ───────────────────────────────────────

  private ensureDirectories(): void {
    if (!existsSync(this.stacksDir)) {
      mkdirSync(this.stacksDir, { recursive: true });
    }
  }

  private loadInstalledStacks(): void {
    const stacksIndex = join(this.stacksDir, 'index.json');
    if (existsSync(stacksIndex)) {
      try {
        const data = JSON.parse(readFileSync(stacksIndex, 'utf-8'));
        this.installedStacks = new Map(Object.entries(data));
      } catch (err) {
        console.warn('⚠️  Failed to load stack index, starting fresh:', (err as Error).message);
        this.installedStacks = new Map();
      }
    }
  }

  private saveIndex(): void {
    const indexPath = join(this.stacksDir, 'index.json');
    writeFileSync(indexPath, JSON.stringify(Object.fromEntries(this.installedStacks), null, 2));
  }

  // ─── Stack Definition Loading ─────────────────────────────

  /**
   * Load a stack definition from a YAML file
   */
  async loadStackDefinition(filePath: string): Promise<StackConfig> {
    const resolvedPath = resolve(filePath);
    if (!existsSync(resolvedPath)) {
      throw new Error(`Stack definition not found: ${resolvedPath}`);
    }

    const content = readFileSync(resolvedPath, 'utf-8');

    // Simple YAML parser (avoids dependency on js-yaml for now)
    const stack = this.parseYaml(content) as unknown as StackConfig;

    // Validate required fields
    if (!stack.name) throw new Error('Stack definition missing required field: name');
    if (!stack.version) throw new Error('Stack definition missing required field: version');
    if (!stack.components || !Array.isArray(stack.components)) {
      throw new Error('Stack definition missing required field: components');
    }
    if (!stack.build) throw new Error('Stack definition missing required field: build');
    if (!stack.runtime) throw new Error('Stack definition missing required field: runtime');

    return stack;
  }

  /**
   * List all available stack definitions in the stacks directory
   */
  async listAvailableStacks(): Promise<{ name: string; path: string }[]> {
    const stacksDir = join(process.cwd(), 'stacks');
    if (!existsSync(stacksDir)) return [];

    const files = readdirSync(stacksDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    return files.map(f => ({
      name: f.replace(/\.(yaml|yml)$/, ''),
      path: join(stacksDir, f)
    }));
  }

  // ─── Validation ───────────────────────────────────────────

  /**
   * Validate a stack definition for correctness and compatibility
   */
  async validateStack(stack: StackConfig): Promise<StackValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required components aren't excluded
    const required = stack.components.filter(c => c.required);
    const excluded = stack.excluded_components || [];

    for (const comp of required) {
      if (excluded.includes(comp.name)) {
        errors.push(`Required component '${comp.name}' cannot be excluded`);
      }
    }

    // Check for duplicate component names
    const names = stack.components.map(c => c.name);
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    if (duplicates.length > 0) {
      errors.push(`Duplicate component names: ${Array.from(new Set(duplicates)).join(', ')}`);

    }

    // Check component existence in registry
    for (const comp of stack.components) {
      if (excluded.includes(comp.name)) continue;

      const exists = await this.componentExists(comp.source, comp.version);
      if (!exists) {
        warnings.push(`Component '${comp.name}' (${comp.source}@${comp.version}) not found in registry`);
      }
    }

    // Check target OS/arch compatibility
    const currentOS = process.platform;
    const currentArch = process.arch;
    const osMap: Record<string, string> = {
      darwin: 'macos',
      linux: 'linux',
      win32: 'windows'
    };

    const mappedOS = osMap[currentOS] || currentOS;
    if (!stack.build.target_os.includes(mappedOS) && !stack.build.target_os.includes('all')) {
      warnings.push(`Current OS (${mappedOS}) not in target_os list: [${stack.build.target_os.join(', ')}]`);
    }

    const archMap: Record<string, string> = {
      x64: 'x64',
      arm64: 'arm64',
      arm: 'armv7l'
    };
    const mappedArch = archMap[currentArch] || currentArch;
    if (!stack.build.target_arch.includes(mappedArch) && !stack.build.target_arch.includes('all')) {
      warnings.push(`Current arch (${mappedArch}) not in target_arch list: [${stack.build.target_arch.join(', ')}]`);
    }

    // Check size target
    if (stack.actual_size_mb && stack.actual_size_mb > stack.max_size_mb) {
      warnings.push(`Actual size (${stack.actual_size_mb}MB) exceeds max target (${stack.max_size_mb}MB)`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  // ─── Component Registry ───────────────────────────────────

  /**
   * Check if a component exists in the npm registry
   */
  async componentExists(source: string, version: string): Promise<boolean> {
    const cacheKey = `${source}@${version}`;
    if (this.registryCache.has(cacheKey)) {
      return this.registryCache.get(cacheKey)!;
    }

    // Check npm public registry
    try {
      const result = execSync(`npm view ${source}@${version} version 2>/dev/null`, {
        encoding: 'utf-8',
        timeout: 5000
      });
      const exists = !!result.trim();
      this.registryCache.set(cacheKey, exists);
      return exists;
    } catch {
      // Check GitHub Packages registry
      try {
        const result = execSync(
          `npm view ${source}@${version} version --registry=https://npm.pkg.github.com 2>/dev/null`,
          { encoding: 'utf-8', timeout: 5000 }
        );
        const exists = !!result.trim();
        this.registryCache.set(cacheKey, exists);
        return exists;
      } catch {
        this.registryCache.set(cacheKey, false);
        return false;
      }
    }
  }

  // ─── Installation ─────────────────────────────────────────

  /**
   * Install a stack and all its components
   */
  async installStack(stack: StackConfig, options?: { dryRun?: boolean }): Promise<void> {
    const dryRun = options?.dryRun || false;

    console.log(`\n📦 ${dryRun ? '[DRY RUN] Would install' : 'Installing'} stack: ${stack.name} v${stack.version}`);
    console.log(`   Description: ${stack.description}`);
    console.log(`   Components: ${stack.components.length}`);
    console.log(`   Excluded: ${(stack.excluded_components || []).length || 'none'}\n`);

    if (dryRun) {
      console.log('   Components to install:');
      for (const comp of stack.components) {
        if (stack.excluded_components?.includes(comp.name)) {
          console.log(`     ⏭️  ${comp.name} (excluded)`);
        } else {
          console.log(`     📥 ${comp.name} (${comp.source}@${comp.version})`);
        }
      }
      return;
    }

    // Create stack directory
    const stackDir = join(this.stacksDir, stack.name);
    mkdirSync(stackDir, { recursive: true });

    // Install each component
    for (const comp of stack.components) {
      if (stack.excluded_components?.includes(comp.name)) {
        console.log(`   ⏭️  Skipping ${comp.name} (excluded)`);
        continue;
      }

      console.log(`   📥 Installing ${comp.name} (${comp.source}@${comp.version})...`);

      try {
        // Install via npm
        execSync(`npm install ${comp.source}@${comp.version} --prefix ${stackDir} --no-audit --no-fund 2>&1`, {
          stdio: 'inherit'
        });

        // Write component config if provided
        if (comp.config && Object.keys(comp.config).length > 0) {
          const configPath = join(stackDir, `${comp.name}.config.json`);
          writeFileSync(configPath, JSON.stringify(comp.config, null, 2));
          console.log(`     ✅ Config written to ${comp.name}.config.json`);
        }
      } catch (err) {
        console.error(`     ❌ Failed to install ${comp.name}:`, (err as Error).message);
        throw new Error(`Component installation failed: ${comp.name}`);
      }
    }

    // Save stack metadata
    const metadataPath = join(stackDir, 'stack.yaml');
    writeFileSync(metadataPath, this.toYaml(stack));

    // Update index
    this.installedStacks.set(stack.name, stack);
    this.saveIndex();

    console.log(`\n✅ Stack '${stack.name}' installed to ${stackDir}`);
    this.emit('stack:installed', { name: stack.name, path: stackDir });
  }

  // ─── Building ─────────────────────────────────────────────

  /**
   * Build a stack into a distributable binary
   */
  async buildStack(
    stack: StackConfig,
    outputDir?: string
  ): Promise<StackBuildResult> {
    const buildDir = outputDir || join(process.cwd(), 'dist', 'stacks', stack.name);
    mkdirSync(buildDir, { recursive: true });

    const errors: string[] = [];

    console.log(`\n🔨 Building stack: ${stack.name} v${stack.version}`);
    console.log(`   Output: ${buildDir}`);
    console.log(`   Target: ${stack.build.target_os.join('/')} (${stack.build.target_arch.join(', ')})\n`);

    // Build each component
    for (const comp of stack.components) {
      if (stack.excluded_components?.includes(comp.name)) continue;

      console.log(`   🔧 Building ${comp.name}...`);
      const componentDir = join(this.stacksDir, stack.name, 'node_modules', comp.source);

      if (!existsSync(componentDir)) {
        errors.push(`Component '${comp.name}' not installed. Run installStack first.`);
        continue;
      }

      // Run component build script if exists
      const buildScript = join(componentDir, 'scripts', 'build.sh');
      if (existsSync(buildScript)) {
        try {
          execSync(`chmod +x "${buildScript}" && "${buildScript}" "${buildDir}"`, {
            stdio: 'inherit',
            timeout: 120000 // 2 min timeout per component
          });
          console.log(`     ✅ Built ${comp.name}`);
        } catch (err) {
          errors.push(`Failed to build ${comp.name}: ${(err as Error).message}`);
        }
      } else {
        // Copy component files as fallback
        console.log(`     📋 Copying ${comp.name} files...`);
        execSync(`cp -r "${componentDir}/." "${buildDir}/"`, { stdio: 'inherit' });
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Create final binary
    const outputName = stack.build.output;
    const outputPath = join(buildDir, outputName);

    console.log(`\n   📦 Assembling final binary: ${outputPath}`);

    // Measure size
    const sizeResult = execSync(`du -sm "${buildDir}" 2>/dev/null || echo "0"`, { encoding: 'utf-8' });
    const sizeMb = parseInt(sizeResult.split('\t')[0] || '0', 10);

    console.log(`   📏 Built size: ${sizeMb}MB`);

    // Compare to target
    if (sizeMb > stack.max_size_mb) {
      console.log(`   ⚠️  Warning: Size (${sizeMb}MB) exceeds target (${stack.max_size_mb}MB)`);
    } else {
      console.log(`   ✅ Size within target (${stack.max_size_mb}MB)`);
    }

    console.log(`\n✅ Build complete: ${outputPath}`);

    this.emit('stack:built', { name: stack.name, path: outputPath, sizeMb });

    return {
      success: true,
      outputPath,
      sizeMb,
      errors: []
    };
  }

  // ─── Running ──────────────────────────────────────────────

  /**
   * Run an installed stack
   */
  async runStack(stackName: string, args?: string[]): Promise<void> {
    const stack = this.installedStacks.get(stackName);
    if (!stack) {
      throw new Error(`Stack '${stackName}' not installed. Install it first with installStack().`);
    }

    console.log(`\n🚀 Running stack: ${stack.name} v${stack.version}\n`);

    // Build first if not already built
    const binaryPath = join(process.cwd(), 'dist', 'stacks', stack.name, stack.build.output);
    if (!existsSync(binaryPath)) {
      console.log('   🔨 Stack not built yet, building...');
      const result = await this.buildStack(stack);
      if (!result.success) {
        throw new Error(`Failed to build stack: ${result.errors.join(', ')}`);
      }
    }

    // Execute based on runtime config
    if (stack.runtime.no_gui) {
      // Headless mode
      const proc = spawn(binaryPath, args || [], {
        stdio: 'inherit',
        detached: stack.runtime.service_mode || false,
        env: {
          ...process.env,
          UNIVERSUI_MODE: 'headless',
          UNIVERSUI_STACK: stack.name
        }
      });

      if (stack.runtime.service_mode) {
        proc.unref();
        console.log(`   🌀 Running in service mode (detached)`);
      } else {
        await new Promise<void>((resolve, reject) => {
          proc.on('exit', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Process exited with code ${code}`));
          });
          proc.on('error', reject);
        });
      }
    } else {
      // GUI mode
      const proc = spawn(binaryPath, args || [], {
        stdio: 'inherit',
        env: {
          ...process.env,
          UNIVERSUI_STACK: stack.name
        }
      });

      await new Promise<void>((resolve, reject) => {
        proc.on('exit', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Process exited with code ${code}`));
        });
        proc.on('error', reject);
      });
    }
  }

  // ─── Management ───────────────────────────────────────────

  /**
   * List all installed stacks
   */
  listStacks(): StackConfig[] {
    return Array.from(this.installedStacks.values());
  }

  /**
   * Get info about a specific installed stack
   */
  getStack(name: string): StackConfig | undefined {
    return this.installedStacks.get(name);
  }

  /**
   * Remove an installed stack
   */
  async removeStack(stackName: string): Promise<void> {
    const stackDir = join(this.stacksDir, stackName);
    if (existsSync(stackDir)) {
      execSync(`rm -rf "${stackDir}"`);
      console.log(`   🗑️  Removed stack directory: ${stackDir}`);
    }

    this.installedStacks.delete(stackName);
    this.saveIndex();

    console.log(`\n✅ Removed stack: ${stackName}`);
    this.emit('stack:removed', { name: stackName });
  }

  /**
   * Get the storage path for stacks
   */
  getStacksPath(): string {
    return this.stacksDir;
  }

  // ─── YAML Parsing (Simple) ────────────────────────────────

  /**
   * Simple YAML parser for stack definitions
   * Handles the subset of YAML used in our stack files
   */
  private parseYaml(content: string): Record<string, any> {
    const result: Record<string, any> = {};
    const lines = content.split('\n');
    const stack: Record<string, any>[] = [];
    let currentSection: string | null = null;
    let currentList: any[] | null = null;
    let currentListItem: Record<string, any> | null = null;
    let indentLevel = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;

      const indent = line.search(/\S/);
      const isKeyValue = trimmed.includes(':');
      const isListItem = trimmed.startsWith('- ');

      if (isListItem) {
        // List item
        const itemContent = trimmed.substring(2).trim();
        if (itemContent.includes(':')) {
          // Object in list
          if (currentListItem && indent <= indentLevel) {
            if (currentList) currentList.push(currentListItem);
            currentListItem = null;
          }
          if (!currentListItem) {
            currentListItem = {};
            indentLevel = indent;
          }
          const [key, ...valParts] = itemContent.split(':');
          const val = valParts.join(':').trim();
          currentListItem[key.trim()] = this.parseYamlValue(val);
        } else {
          // Simple list value
          if (!currentList) currentList = [];
          currentList.push(this.parseYamlValue(itemContent));
        }
      } else if (isKeyValue) {
        // Key-value pair
        const [key, ...valParts] = trimmed.split(':');
        const val = valParts.join(':').trim();
        const cleanKey = key.trim();

        if (currentListItem && indent <= indentLevel) {
          if (currentList) currentList.push(currentListItem);
          currentListItem = null;
        }

        if (val === '' || val === '|') {
          // Section start
          currentSection = cleanKey;
          result[currentSection] = {};
        } else if (val.startsWith('[') && val.endsWith(']')) {
          // Array value
          const arr = val.substring(1, val.length - 1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
          if (currentSection) {
            result[currentSection][cleanKey] = arr;
          } else {
            result[cleanKey] = arr;
          }
        } else {
          // Simple value
          const parsedVal = this.parseYamlValue(val);
          if (currentSection) {
            result[currentSection][cleanKey] = parsedVal;
          } else {
            result[cleanKey] = parsedVal;
          }
        }
      }

      // Handle end of list
      if (!isListItem && currentList && !isKeyValue) {
        // Flush list
        if (currentSection && currentListItem) {
          currentList.push(currentListItem);
          currentListItem = null;
        }
        // Assign list to appropriate place
        if (currentSection && !result[currentSection]) {
          result[currentSection] = currentList;
        }
        currentList = null;
      }
    }

    // Flush remaining list item
    if (currentListItem && currentList) {
      currentList.push(currentListItem);
    }

    // Handle components specially
    if (currentList && currentList.length > 0) {
      // Find where to put this list
      for (const key of Object.keys(result)) {
        if (typeof result[key] === 'object' && !Array.isArray(result[key])) {
          // Check if any sub-key should be this list
        }
      }
    }

    return result;
  }

  private parseYamlValue(val: string): any {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === 'null' || val === '~') return null;
    if (/^\d+$/.test(val)) return parseInt(val, 10);
    if (/^\d+\.\d+$/.test(val)) return parseFloat(val);
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      return val.substring(1, val.length - 1);
    }
    return val;
  }

  public toYaml(obj: any, indent: number = 0): string {

    const prefix = '  '.repeat(indent);
    let result = '';

    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === 'object' && item !== null) {
          result += `${prefix}- ${Object.keys(item)[0]}: ${Object.values(item)[0]}\n`;
          for (const [k, v] of Object.entries(item).slice(1)) {
            result += `${prefix}  ${k}: ${v}\n`;
          }
        } else {
          result += `${prefix}- ${item}\n`;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          result += `${prefix}${key}:\n${this.toYaml(value, indent + 1)}`;
        } else {
          result += `${prefix}${key}: ${value}\n`;
        }
      }
    }

    return result;
  }
}

// ============================================================
// CLI Interface
// ============================================================

async function main() {
  const manager = new StackManager();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'list':
    case 'ls': {
      const installed = manager.listStacks();
      const available = await manager.listAvailableStacks();

      console.log('\n📋 Installed Stacks:');
      if (installed.length === 0) {
        console.log('   (none)');
      } else {
        for (const stack of installed) {
          console.log(`   ✅ ${stack.name} v${stack.version} - ${stack.description}`);
        }
      }

      console.log('\n📋 Available Stack Definitions:');
      if (available.length === 0) {
        console.log('   (none found in stacks/)');
      } else {
        for (const s of available) {
          console.log(`   📄 ${s.name} (${s.path})`);
        }
      }
      break;
    }

    case 'install': {
      const stackName = args[1];
      if (!stackName) {
        console.error('Usage: stack install <stack-name|path-to-yaml>');
        process.exit(1);
      }

      let stack: StackConfig;
      if (stackName.endsWith('.yaml') || stackName.endsWith('.yml')) {
        stack = await manager.loadStackDefinition(stackName);
      } else {
        // Look in stacks/ directory
        const available = await manager.listAvailableStacks();
        const found = available.find(s => s.name === stackName);
        if (!found) {
          console.error(`Stack '${stackName}' not found. Available: ${available.map(s => s.name).join(', ')}`);
          process.exit(1);
        }
        stack = await manager.loadStackDefinition(found.path);
      }

      const validation = await manager.validateStack(stack);
      if (!validation.valid) {
        console.error('\n❌ Validation errors:');
        for (const err of validation.errors) {
          console.error(`   • ${err}`);
        }
        process.exit(1);
      }
      if (validation.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        for (const warn of validation.warnings) {
          console.log(`   • ${warn}`);
        }
      }

      await manager.installStack(stack);
      break;
    }

    case 'build': {
      const stackName = args[1];
      const outputDir = args[2];

      if (!stackName) {
        console.error('Usage: stack build <stack-name> [output-dir]');
        process.exit(1);
      }

      const stack = manager.getStack(stackName);
      if (!stack) {
        console.error(`Stack '${stackName}' not installed. Install it first.`);
        process.exit(1);
      }

      const result = await manager.buildStack(stack, outputDir);
      if (!result.success) {
        console.error('\n❌ Build failed:');
        for (const err of result.errors) {
          console.error(`   • ${err}`);
        }
        process.exit(1);
      }
      break;
    }

    case 'run': {
      const stackName = args[1];
      const runArgs = args.slice(2);

      if (!stackName) {
        console.error('Usage: stack run <stack-name> [args...]');
        process.exit(1);
      }

      try {
        await manager.runStack(stackName, runArgs);
      } catch (err) {
        console.error(`\n❌ Failed to run stack:`, (err as Error).message);
        process.exit(1);
      }
      break;
    }

    case 'remove':
    case 'rm': {
      const stackName = args[1];
      if (!stackName) {
        console.error('Usage: stack remove <stack-name>');
        process.exit(1);
      }
      await manager.removeStack(stackName);
      break;
    }

    case 'info': {
      const stackName = args[1];
      if (!stackName) {
        console.error('Usage: stack info <stack-name>');
        process.exit(1);
      }
      const stack = manager.getStack(stackName);
      if (!stack) {
        console.error(`Stack '${stackName}' not installed.`);
        process.exit(1);
      }
      console.log(`\n📊 Stack: ${stack.name}`);
      console.log(`   Version: ${stack.version}`);
      console.log(`   Description: ${stack.description}`);
      console.log(`   Author: ${stack.author}`);
      console.log(`   Components: ${stack.components.length}`);
      console.log(`   Excluded: ${(stack.excluded_components || []).join(', ') || 'none'}`);
      console.log(`   Max Size: ${stack.max_size_mb}MB`);
      console.log(`   Actual Size: ${stack.actual_size_mb || 'unknown'}MB`);
      console.log(`   Target OS: ${stack.build.target_os.join(', ')}`);
      console.log(`   Target Arch: ${stack.build.target_arch.join(', ')}`);
      console.log(`   GUI: ${stack.runtime.no_gui ? 'No' : 'Yes'}`);
      console.log(`   Service Mode: ${stack.runtime.service_mode ? 'Yes' : 'No'}`);
      break;
    }

    case 'validate':
    case 'check': {
      const filePath = args[1];
      if (!filePath) {
        console.error('Usage: stack validate <path-to-yaml>');
        process.exit(1);
      }
      const stack = await manager.loadStackDefinition(filePath);
      const validation = await manager.validateStack(stack);
      if (validation.valid) {
        console.log(`\n✅ Stack '${stack.name}' is valid`);
      } else {
        console.log(`\n❌ Stack '${stack.name}' has errors:`);
        for (const err of validation.errors) {
          console.log(`   • ${err}`);
        }
      }
      if (validation.warnings.length > 0) {
        console.log(`\n⚠️  Warnings:`);
        for (const warn of validation.warnings) {
          console.log(`   • ${warn}`);
        }
      }
      break;
    }

    case 'create': {
      console.log('\n🆕 Interactive Stack Creator\n');
      // Simple interactive creator
      const readline = (await import('readline')).createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const ask = (q: string): Promise<string> => new Promise(r => readline.question(q, r));

      const name = await ask('Stack name: ');
      const version = await ask('Version [1.0.0]: ') || '1.0.0';
      const description = await ask('Description: ');
      const author = await ask('Author: ');

      readline.close();

      const stack: StackConfig = {
        name,
        version,
        description,
        author,
        components: [
          { name: 'core', source: '@universui/core', version: '^1.3.0', required: true }
        ],
        build: {
          output: name,
          target_os: ['macos', 'windows', 'linux'],
          target_arch: ['x64', 'arm64']
        },
        runtime: {
          min_memory_mb: 128,
          recommended_memory_mb: 512
        },
        max_size_mb: 50
      };

      const outputPath = join(process.cwd(), 'stacks', `${name}.yaml`);
      writeFileSync(outputPath, manager.toYaml(stack));
      console.log(`\n✅ Created stack definition: ${outputPath}`);
      break;
    }

    default:
      console.log(`
╔══════════════════════════════════════════════╗
║        DevStudio Stack Manager v1.0          ║
╚══════════════════════════════════════════════╝

Usage:
  stack list|ls                    List installed and available stacks
  stack install <name|file>        Install a stack
  stack build <name> [output-dir]  Build a stack into a binary
  stack run <name> [args...]       Run an installed stack
  stack remove|rm <name>           Remove a stack
  stack info <name>                Show stack details
  stack validate|check <file>      Validate a stack definition
  stack create                     Interactive stack creator

Examples:
  stack install full               Install the full desktop stack
  stack build full ./dist          Build the full stack
  stack run cloud --service        Run cloud stack as a service
  stack validate stacks/ci.yaml    Validate a stack definition
`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
  });
}

export { StackManager, StackConfig, StackComponent, StackBuildResult, StackValidationResult };
export default StackManager;
