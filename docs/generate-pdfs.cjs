// Simple MD→HTML→PDF generator using Chrome headless
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME = '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"';
const DOCS = path.join(__dirname);

// Very small but correct markdown→HTML converter (handles headers, tables, bold, lists, links, checkboxes, hr)
function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let tableHeader = false;
  let inList = false;
  let listDepth = 0;

  function closeList() {
    if (inList) { html += '</ul>\n'; inList = false; }
  }
  function closeTable() {
    if (inTable) { html += '</tbody></table>\n'; inTable = false; tableHeader = false; }
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Horizontal rule
    if (/^-{3,}$/.test(line.trim())) {
      closeList(); closeTable();
      html += '<hr>\n'; continue;
    }

    // Table row
    if (line.trim().startsWith('|')) {
      closeList();
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const isDivider = cells.every(c => /^[-:]+$/.test(c));
      if (isDivider) { tableHeader = false; continue; }
      if (!inTable) {
        html += '<table><thead><tr>';
        cells.forEach(c => html += `<th>${inline(c)}</th>`);
        html += '</tr></thead><tbody>\n';
        inTable = true; tableHeader = true;
        continue;
      }
      if (tableHeader) { html += '<tr>'; tableHeader = false; }
      else html += '<tr>';
      cells.forEach(c => html += `<td>${inline(c)}</td>`);
      html += '</tr>\n';
      continue;
    } else { closeTable(); }

    // Headings
    const hMatch = line.match(/^(#{1,4})\s+(.*)/);
    if (hMatch) {
      closeList();
      const level = hMatch[1].length;
      html += `<h${level}>${inline(hMatch[2])}</h${level}>\n`;
      continue;
    }

    // Checkbox list item
    if (/^- \[[ x]\]/.test(line)) {
      const checked = line.includes('[x]') || line.includes('[X]');
      const text = line.replace(/^- \[[ xX]\] /, '');
      if (!inList) { html += '<ul class="checklist">\n'; inList = true; }
      html += `<li class="${checked ? 'checked' : 'unchecked'}"><span class="cb">${checked ? '☑' : '☐'}</span> ${inline(text)}</li>\n`;
      continue;
    }

    // Bullet list
    if (/^- /.test(line)) {
      if (!inList) { html += '<ul>\n'; inList = true; }
      html += `<li>${inline(line.slice(2))}</li>\n`;
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      if (!inList) { html += '<ol>\n'; inList = true; }
      html += `<li>${inline(line.replace(/^\d+\. /, ''))}</li>\n`;
      continue;
    }

    closeList();

    // Blank line
    if (line.trim() === '') {
      html += '\n'; continue;
    }

    // Regular paragraph
    html += `<p>${inline(line)}</p>\n`;
  }
  closeList(); closeTable();
  return html;
}

function inline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/✅/g, '<span style="color:#22c55e">✅</span>')
    .replace(/🆕/g, '<span>🆕</span>');
}

const CSS = `
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #1a1a2e;
    max-width: 100%;
  }
  h1 { font-size: 20pt; color: #1a6e6e; margin: 0 0 4px 0; font-weight: 700; }
  h2 { font-size: 13pt; color: #1a6e6e; margin: 18px 0 6px 0; border-bottom: 1.5px solid #d4f0f0; padding-bottom: 4px; }
  h3 { font-size: 11pt; color: #2a5555; margin: 14px 0 4px 0; }
  h4 { font-size: 10.5pt; color: #2a5555; margin: 10px 0 4px 0; }
  p { margin: 4px 0 8px 0; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 14px 0; }
  a { color: #1a6e6e; text-decoration: none; }
  code { background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-size: 9.5pt; font-family: 'Consolas', monospace; }
  strong { color: #111; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 14px 0;
    font-size: 9.5pt;
    page-break-inside: auto;
  }
  th {
    background: #e8f4f4;
    color: #1a6e6e;
    font-weight: 700;
    padding: 6px 8px;
    text-align: left;
    border: 1px solid #c5e8e8;
  }
  td {
    padding: 5px 8px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }
  tr:nth-child(even) td { background: #f9fafb; }
  ul, ol { margin: 4px 0 8px 0; padding-left: 20px; }
  li { margin: 3px 0; }
  ul.checklist { list-style: none; padding-left: 4px; }
  ul.checklist li { display: flex; align-items: flex-start; gap: 6px; margin: 4px 0; }
  .cb { font-size: 11pt; line-height: 1.3; }
  li.checked { color: #444; }
  li.unchecked { color: #555; }
  .meta { color: #64748b; font-size: 9pt; border-left: 3px solid #1a6e6e; padding-left: 10px; margin: 4px 0 16px 0; line-height: 1.8; }
  .page-break { page-break-before: always; }
  @media print {
    a { color: #1a6e6e !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

function wrapHtml(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>${CSS}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

const docs = [
  {
    input: 'MARKETING_REPORT_MAY2026.md',
    outputHtml: 'Omni_Marketing_Report_May2026.html',
    outputPdf: 'Omni_Marketing_Report_May2026.pdf',
    title: 'Omni Wellness Media — Marketing Report May 2026',
  },
  {
    input: 'TESTING_GUIDE_V5_MAY2026.md',
    outputHtml: 'Omni_Testing_Guide_v5_May2026.html',
    outputPdf: 'Omni_Testing_Guide_v5_May2026.pdf',
    title: 'Omni Wellness Media — Testing Guide v5 May 2026',
  },
];

const outDir = path.join(DOCS, 'pdf-output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

docs.forEach(doc => {
  const mdPath = path.join(DOCS, doc.input);
  const htmlPath = path.join(outDir, doc.outputHtml);
  const pdfPath = path.join(outDir, doc.outputPdf);

  const md = fs.readFileSync(mdPath, 'utf8');
  const body = mdToHtml(md);
  const fullHtml = wrapHtml(doc.title, body);
  fs.writeFileSync(htmlPath, fullHtml, 'utf8');
  console.log(`✓ HTML: ${doc.outputHtml}`);

  try {
    execSync(
      `${CHROME} --headless --disable-gpu --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "file:///${htmlPath.replace(/\\/g, '/')}"`,
      { timeout: 30000, stdio: 'pipe' }
    );
    console.log(`✓ PDF:  ${doc.outputPdf}`);
  } catch (e) {
    console.log(`⚠  PDF generation failed for ${doc.outputPdf}: ${e.message.slice(0,120)}`);
    console.log(`   HTML file is ready at: ${htmlPath}`);
    console.log(`   Open it in Chrome and use File → Print → Save as PDF`);
  }
});

console.log('\nDone. Files in: docs/pdf-output/');
