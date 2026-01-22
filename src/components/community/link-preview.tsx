import { cn } from '@/lib/utils';
import { ExternalLink, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  url: string;
  hostname: string;
}

interface LinkPreviewProps {
  url: string;
  className?: string;
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function LinkPreview({ url, className }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);

        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status === 'success' && data.data) {
          setMetadata({
            title: data.data.title,
            description: data.data.description,
            image: data.data.image?.url || data.data.logo?.url,
            url: url,
            hostname: getHostname(url),
          });
        } else {
          setMetadata({
            url: url,
            hostname: getHostname(url),
          });
        }
      } catch {
        setMetadata({
          url: url,
          hostname: getHostname(url),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (loading) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50/50 animate-pulse',
          className,
        )}
      >
        <div className="w-10 h-10 bg-gray-200 rounded shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-2 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!metadata) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50/50 hover:bg-gray-100 transition-colors',
        className,
      )}
    >
      {metadata.image ? (
        <img
          src={metadata.image}
          alt=""
          className="w-10 h-10 object-cover rounded shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded shrink-0 flex items-center justify-center">
          <Globe className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-900">{metadata.title || metadata.hostname}</p>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <ExternalLink className="w-2.5 h-2.5" />
          <span className="truncate">{metadata.hostname}</span>
        </div>
      </div>
    </a>
  );
}

// Utility function to extract URLs from text
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"\[\](){}]+/g;
  const matches = text.match(urlRegex);
  return matches ? [...new Set(matches)] : [];
}

// Component to render text with clickable links
interface TextWithLinksProps {
  text: string;
  className?: string;
}

export function TextWithLinks({ text, className }: TextWithLinksProps) {
  const urlRegex = /(https?:\/\/[^\s<>"\[\](){}]+)/g;
  const parts = text.split(urlRegex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          // Reset regex lastIndex for next test
          urlRegex.lastIndex = 0;
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
}
