import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import { useMemo } from "react";

import "./style.css";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
});

function unescapeHtml(text: string): string {
  return text.replace(/\\</g, "<").replace(/\\>/g, ">").replace(/\\&/g, "&");
}

function processMarkdownInHtml(text: string): string {
  return text.replace(
    /(<(?:center|div|span|p|section|article|header|footer|aside|main|figure|figcaption)[^>]*>)([\s\S]*?)(<\/(?:center|div|span|p|section|article|header|footer|aside|main|figure|figcaption)>)/gi,
    (_, openTag, content, closeTag) => {
      const renderedContent = md.renderInline(content.trim());
      return `${openTag}${renderedContent}${closeTag}`;
    }
  );
}

function MarkdownPreviewer({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const htmlContent = useMemo(() => {
    const unescaped = unescapeHtml(value);
    const processed = processMarkdownInHtml(unescaped);
    const dirty = md.render(processed);
    return DOMPurify.sanitize(dirty);
  }, [value]);

  return (
    <div
      className={cn("prose max-w-full", className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default MarkdownPreviewer;
