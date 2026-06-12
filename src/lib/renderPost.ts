import DOMPurify from "dompurify";

/**
 * Single source of truth for rendering blog post content.
 * Used by both the public BlogPost page and the BlogEditor preview so what an
 * author sees in Preview is exactly what readers get.
 *
 * Accepts either:
 *   - HTML (from a rich editor) — sanitized and returned as-is
 *   - markdown-lite (the in-app editor format) — converted to HTML
 *
 * The HTML detection is deliberately strict (`<tag` followed by space/slash/>)
 * so stray "<" in prose doesn't get misread as HTML and skip markdown parsing.
 */
const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const safeUrl = (value: string) => {
  const trimmed = (value || "").trim();
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)
    ? trimmed.replace(/"/g, "&quot;")
    : "#";
};

export function renderPostContent(raw: string | null | undefined): string {
  if (!raw) return "";

  // Treat as HTML only when it genuinely opens with a tag-like token.
  const looksLikeHtml = /<(p|div|h[1-6]|ul|ol|li|img|a|strong|em|blockquote|br|span|figure|pre|code)[\s/>]/i.test(raw);
  if (looksLikeHtml) {
    return DOMPurify.sanitize(raw);
  }

  let html = escapeHtml(raw)
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) =>
      `<img src="${safeUrl(url)}" alt="${escapeHtml(alt)}" class="rounded-lg my-6" loading="lazy" decoding="async" />`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) =>
      `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`)
    .replace(/^&gt; (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br />");

  if (!html.startsWith("<")) html = `<p>${html}</p>`;
  return DOMPurify.sanitize(html);
}
