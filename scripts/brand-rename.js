/*
  Batch brand rename in source files (exclude public output)
  Replaces occurrences of "Hugo會計(師)事務所" (with or without whitespace) to "霍爾果斯".
*/

const fs = require('fs');
const path = require('path');

const targets = [
  'content',
  path.join('workers', 'src'),
  path.join('static', 'admin', 'index.html'),
  'README.md',
  'package.json',
  'hugo-requirements-final-updated.txt',
];

/**
 * Recursively list files under a directory. Returns empty array if path doesn't exist.
 * @param {string} p
 * @returns {string[]}
 */
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

const allFiles = targets.flatMap(listFiles);
if (allFiles.length === 0) {
  console.log('No target files found.');
  process.exit(0);
}

// Patterns to replace (global, case-insensitive)
const patterns = [
  /Hugo\s*會計師?事務所/gi,
];

let updatedCount = 0;
for (const file of allFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let next = content;
    for (const re of patterns) {
      next = next.replace(re, '霍爾果斯');
    }
    if (next !== content) {
      fs.writeFileSync(file, next, 'utf8');
      updatedCount++;
      console.log('Updated:', file);
    }
  } catch (err) {
    console.error('Failed:', file, err.message);
  }
}

console.log(`Brand rename done. Files updated: ${updatedCount}`);

