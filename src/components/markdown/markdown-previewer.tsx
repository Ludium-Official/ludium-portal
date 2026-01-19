import { cn } from '@/lib/utils';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { useMemo } from 'react';

import './style.css';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

function unescapeHtml(text: string): string {
  return text.replace(/\\</g, '<').replace(/\\>/g, '>').replace(/\\&/g, '&');
}

function processYouTubeDirectives(text: string): string {
  return text.replace(
    /::youtube\{#([a-zA-Z0-9_-]+)\}/g,
    (_, videoId) =>
      `<div style="position: relative; width: 100%; padding-bottom: 56.25%; margin-bottom: 10px;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,
  );
}

function processMarkdownInHtml(text: string): string {
  return text.replace(
    /(<(?:center|div|span|p|section|article|header|footer|aside|main|figure|figcaption)[^>]*>)([\s\S]*?)(<\/(?:center|div|span|p|section|article|header|footer|aside|main|figure|figcaption)>)/gi,
    (_, openTag, content, closeTag) => {
      const renderedContent = md.renderInline(content.trim());
      return `${openTag}${renderedContent}${closeTag}`;
    },
  );
}

function transformTablesForMobile(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const tables = doc.querySelectorAll('table');

  tables.forEach((table) => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (!thead || !tbody) return;

    const headers: string[] = [];
    thead.querySelectorAll('th').forEach((th) => {
      headers.push(th.textContent || '');
    });

    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        if (headers[index]) {
          const keySpan = document.createElement('span');
          keySpan.className = 'table-key';
          keySpan.textContent = headers[index];

          const valueSpan = document.createElement('span');
          valueSpan.className = 'table-value';
          valueSpan.innerHTML = cell.innerHTML;

          cell.innerHTML = '';
          cell.appendChild(keySpan);
          cell.appendChild(valueSpan);
        }
      });
    });

    thead.remove();
  });

  return doc.body.innerHTML;
}

function MarkdownPreviewer({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const isMobile = useIsMobile();

  const htmlContent = useMemo(() => {
    const unescaped = unescapeHtml(value);
    const withYouTube = processYouTubeDirectives(unescaped);
    const processed = processMarkdownInHtml(withYouTube);
    const dirty = md.render(processed);
    const sanitized = DOMPurify.sanitize(dirty, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: [
        'frameborder',
        'scrolling',
        'src',
        'width',
        'height',
        'allow',
        'allowfullscreen',
        'title',
        'style',
      ],
    });

    if (isMobile) {
      return transformTablesForMobile(sanitized);
    }

    return sanitized;
  }, [value, isMobile]);

  return (
    <div
      className={cn('prose max-w-full', className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default MarkdownPreviewer;
