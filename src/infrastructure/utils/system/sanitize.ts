import sanitizeHtml from 'sanitize-html';
import { Transform } from 'class-transformer';

const options = {
  allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'br', 'span', 'div'],
  allowedAttributes: {
    a: ['href', 'target'],
    span: ['style'],
    div: ['style'],
  },
  allowedStyles: {
    '*': {
      color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
      'text-align': [/^left$/, /^right$/, /^center$/],
      'font-size': [/^\d+(?:px|em|%)$/],
    },
  },
};

export function Sanitized() {
  return Transform(({ value }) => sanitizeHtml(value, options));
}
