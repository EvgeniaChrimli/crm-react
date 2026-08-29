const fs = require('fs');
const path = require('path');
const { RULES_DIR, loadSections, loadRuleFiles, parseFrontmatter } = require('./lib');

const ALLOWED_IMPACTS = ['CRITICAL', 'HIGH', 'MEDIUM-HIGH', 'MEDIUM', 'LOW-MEDIUM', 'LOW'];

function validate() {
  const sections = loadSections();
  const knownPrefixes = sections.map((s) => s.prefix);
  const files = loadRuleFiles();
  const errors = [];

  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(RULES_DIR, file), 'utf8');
    const { data, content } = parseFrontmatter(raw);

    if (!data.title) errors.push(`${file}: missing "title" in frontmatter`);
    if (!data.impact) {
      errors.push(`${file}: missing "impact" in frontmatter`);
    } else if (!ALLOWED_IMPACTS.includes(data.impact)) {
      errors.push(`${file}: impact "${data.impact}" is not one of ${ALLOWED_IMPACTS.join(', ')}`);
    }

    const prefixMatch = file.match(/^([a-z0-9]+-)/);
    if (!prefixMatch) {
      errors.push(`${file}: filename doesn't start with "<prefix>-" — can't map to a section`);
    } else if (!knownPrefixes.includes(prefixMatch[1])) {
      errors.push(`${file}: prefix "${prefixMatch[1]}" not declared in rules/_sections.md`);
    }

    if (!/\*\*Incorrect/i.test(content)) {
      errors.push(`${file}: no "**Incorrect" example found`);
    }
    if (!/\*\*Correct/i.test(content)) {
      errors.push(`${file}: no "**Correct" example found`);
    }
  });

  if (errors.length) {
    console.error(`Validation failed with ${errors.length} error(s):\n`);
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  console.log(`✓ All ${files.length} rule file(s) valid.`);
}

validate();
