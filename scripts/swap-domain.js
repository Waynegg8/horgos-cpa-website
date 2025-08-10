/*
  Swap domain from hugo-accounting.com to horgoscpa.com across source files (exclude public/)
  - Protocol-aware URL replacement: http/https
  - Email replacement: *@hugo-accounting.com -> *@horgoscpa.com
*/

const fs = require('fs');
const path = require('path');

const targets = [
  'content',
  path.join('workers', 'src'),
  path.join('assets'),
  path.join('layouts'),
  path.join('static'),
  path.join('scripts'),
  'README.md',
  'hugo.toml',
  'package.json',
  'hugo-requirements-final-updated.txt',
];

function listFiles(p) {
  if (!fs.existsSync(p)) return [];
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    const entries = fs.readdirSync(p, { withFileTypes: true });
    let files = [];
    for (const e of entries) {
      const fp = path.join(p, e.name);
      if (e.isDirectory()) files = files.concat(listFiles(fp));
      else if (e.isFile()) files.push(fp);
    }
    return files;
  } else if (stat.isFile()) {
    return [p];
  }
  return [];
}

const allFiles = targets.flatMap(listFiles).filter((f) => !f.startsWith('public' + path.sep));
if (allFiles.length === 0) {
  console.log('No target files found.');
  process.exit(0);
}

// Build replacements
const replacements = [
  // URLs (protocol-aware)
  { re: /(https?:\/\/)(hugo-accounting\.com)/gi, to: (_m, p1) => `${p1}horgoscpa.com` },
  // Emails
  { re: /([A-Za-z0-9._%+-]+)@hugo-accounting\.com/gi, to: (_m, _p1) => `${_p1}@horgoscpa.com` },
];

let updated = 0;
for (const file of allFiles) {
  try {
    const orig = fs.readFileSync(file, 'utf8');
    let next = orig;
    for (const rule of replacements) {
      next = next.replace(rule.re, rule.to);
    }
    if (next !== orig) {
      fs.writeFileSync(file, next, 'utf8');
      updated++;
      console.log('Updated:', file);
    }
  } catch (err) {
    console.error('Failed:', file, err.message);
  }
}

console.log(`Domain swap done. Files updated: ${updated}`);

