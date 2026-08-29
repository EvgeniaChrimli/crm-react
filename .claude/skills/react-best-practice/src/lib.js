const fs = require('fs');
const path = require('path');

const RULES_DIR = path.join(__dirname, '..', 'rules');
const SECTIONS_FILE = path.join(RULES_DIR, '_sections.md');

/**
 * Parses a minimal flat YAML frontmatter block (key: value per line, no nesting).
 * Good enough for title/impact/impactDescription/tags — if you need real YAML,
 * swap this for the `gray-matter` package.
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const [, fmBlock, content] = match;
  const data = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, content: content.replace(/^\r?\n/, '') };
}

/** Parses the `| Prefix | Title | Impact | Description |` table in rules/_sections.md. */
function parseSections(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'));

  // Drop the separator row (e.g. "|---|---|---|---|")
  const dataLines = lines.filter((l) => !/^\|[\s:-]+\|/.test(l));
  // First remaining row is the header ("| Prefix | Title | ... |")
  const rows = dataLines.slice(1);

  return rows
    .map((line) => {
      const cells = line
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((c) => c.trim());
      const [prefix, title, impact, description] = cells;
      return { prefix, title, impact, description: description || '' };
    })
    .filter((s) => s.prefix);
}

function loadSections() {
  return parseSections(fs.readFileSync(SECTIONS_FILE, 'utf8'));
}

function loadRuleFiles() {
  return fs
    .readdirSync(RULES_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'));
}

function loadRules() {
  return loadRuleFiles().map((file) => {
    const raw = fs.readFileSync(path.join(RULES_DIR, file), 'utf8');
    const { data, content } = parseFrontmatter(raw);
    const prefixMatch = file.match(/^([a-z0-9]+-)/);
    return {
      file,
      prefix: prefixMatch ? prefixMatch[1] : null,
      title: data.title || file,
      impact: data.impact || 'UNSPECIFIED',
      impactDescription: data.impactDescription || '',
      tags: data.tags || '',
      content: content.trim(),
    };
  });
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

module.exports = {
  RULES_DIR,
  SECTIONS_FILE,
  parseFrontmatter,
  parseSections,
  loadSections,
  loadRuleFiles,
  loadRules,
  slugify,
};
