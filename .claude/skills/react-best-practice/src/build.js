const fs = require('fs');
const path = require('path');
const { loadSections, loadRules, slugify } = require('./lib');

const ROOT = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT, 'AGENTS.md');
const METADATA_FILE = path.join(ROOT, 'metadata.json');

/**
 * Rule files carry their own `## Title` heading so they read well standalone
 * when opened directly. The compiled doc already prints a numbered heading
 * (`### 1.1 Title`), so strip a leading H1/H2 matching the top of the content
 * to avoid printing the title twice.
 */
function stripLeadingHeading(content) {
  return content.replace(/^#{1,2}\s+.*\r?\n+/, '');
}

function build() {
  const sections = loadSections();
  const rules = loadRules();
  const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));

  const bySection = sections.map((section) => ({
    ...section,
    rules: rules
      .filter((r) => r.prefix === section.prefix)
      .sort((a, b) => a.title.localeCompare(b.title)),
  }));

  const orphans = rules.filter((r) => !sections.some((s) => s.prefix === r.prefix));
  if (orphans.length) {
    console.warn('Warning: rule(s) with a prefix not declared in rules/_sections.md — skipped:');
    orphans.forEach((r) => console.warn(`  - ${r.file} (prefix: ${r.prefix || '(none)'})`));
  }

  let toc = '';
  let body = '';

  // Number only sections that actually have rules, so an empty section (declared
  // in _sections.md but not written yet) doesn't create a gap like "1. ... 4. ...".
  const nonEmptySections = bySection.filter((s) => s.rules.length);

  nonEmptySections.forEach((section, sIdx) => {
    const sectionNum = sIdx + 1;
    toc += `${sectionNum}. [${section.title}](#${sectionNum}-${slugify(section.title)}) — **${section.impact}**\n`;

    body += `\n## ${sectionNum}. ${section.title}\n\n**Impact: ${section.impact}**\n\n${section.description}\n\n`;

    section.rules.forEach((rule, rIdx) => {
      const ruleNum = `${sectionNum}.${rIdx + 1}`;
      toc += `   - ${ruleNum} [${rule.title}](#${ruleNum.replace('.', '')}-${slugify(rule.title)})\n`;

      const impactLine = rule.impactDescription
        ? `**Impact: ${rule.impact} (${rule.impactDescription})**`
        : `**Impact: ${rule.impact}**`;

      const ruleBody = stripLeadingHeading(rule.content);
      body += `### ${ruleNum} ${rule.title}\n\n${impactLine}\n\n${ruleBody}\n\n---\n`;
    });
  });

  const doc = `# ${metadata.title || 'Project Rules'}

**Version ${metadata.version || '0.1.0'}**
${metadata.organization ? metadata.organization + '  \n' : ''}${metadata.date || ''}

${metadata.abstract || ''}

---

## Table of Contents

${toc}
---
${body}`;

  fs.writeFileSync(OUTPUT_FILE, doc, 'utf8');
  console.log(`Built AGENTS.md: ${rules.length} rule(s) across ${nonEmptySections.length} section(s).`);
}

build();
