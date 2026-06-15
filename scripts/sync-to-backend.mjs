import { cpSync, copyFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(__dirname, '..');
const distDir = join(frontendRoot, 'dist', 'move-plus');
const backendStaticDir = resolve(frontendRoot, '..', 'moveplus-backend', 'src', 'main', 'resources', 'static', 'move-plus');

if (!existsSync(distDir)) {
  console.error(`Build output not found: ${distDir}`);
  console.error('Run "npm run build" first.');
  process.exit(1);
}

mkdirSync(dirname(backendStaticDir), { recursive: true });
rmSync(backendStaticDir, { recursive: true, force: true });
cpSync(distDir, backendStaticDir, { recursive: true });

const browserDir = join(backendStaticDir, 'browser');
const csrIndex = join(browserDir, 'index.csr.html');
const spaIndex = join(browserDir, 'index.html');

if (existsSync(csrIndex)) {
  copyFileSync(csrIndex, spaIndex);
  console.log('Created browser/index.html from index.csr.html');
}

console.log(`Synced frontend build to ${backendStaticDir}`);
