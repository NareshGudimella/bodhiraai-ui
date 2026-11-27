import sanitizeHtml from 'sanitize-html';

/**
 * Render-time sanitiser for CMS HTML (defence in depth: the API sanitises on save too).
 * Pure JS, no DOM, so it runs in the Cloudflare Worker. security: not in legacy
 */
const common: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'hr', 'div', 'span', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'small', 'mark', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['colspan', 'rowspan', 'scope'],
    td: ['colspan', 'rowspan'],
    '*': ['class', 'id'],
  },
  allowedSchemes: ['http', 'https'],
  allowedSchemesByTag: { a: ['http', 'https', 'mailto'] },
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard', // script/style contents are dropped, never shown as text
  transformTags: { a: (tag, attribs) => ({ tagName: tag, attribs: attribs.target === '_blank' ? { ...attribs, rel: 'noopener noreferrer' } : attribs }) },
};

export function sanitizeCms(html: string): string {
  return sanitizeHtml(html, common);
}

/** The contact page's map: the same allowlist plus a Google Maps embed iframe. */
export function sanitizeMap(html: string): string {
  return sanitizeHtml(html, {
    ...common,
    allowedTags: [...(common.allowedTags as string[]), 'iframe'],
    allowedAttributes: { ...(common.allowedAttributes as Record<string, string[]>), iframe: ['src', 'width', 'height', 'title', 'loading', 'referrerpolicy', 'allowfullscreen', 'style'] },
    allowedIframeHostnames: ['www.google.com'],
    exclusiveFilter: (f) => f.tag === 'iframe' && !(f.attribs.src ?? '').startsWith('https://www.google.com/maps/embed'),
  });
}
