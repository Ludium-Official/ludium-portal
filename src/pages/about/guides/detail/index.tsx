import Container from '@/components/layout/container';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import { ShareButton } from '@/components/ui/share-button';
import { GUIDES } from '@/constant/guides';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useParams } from 'react-router';

const dedent = (str: string): string => {
  const lines = str.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) return str;

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^(\s*)/);
      return match ? match[1].length : 0;
    }),
  );

  return lines
    .map((line) => line.slice(minIndent))
    .join('\n')
    .trim();
};

const GuideDetailsPage = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const guide = GUIDES.find((g) => g.id === id);

  const processedContent = useMemo(() => {
    if (!guide?.content) return '';
    return dedent(guide.content);
  }, [guide?.content]);

  if (!guide) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Guide not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Container size="narrow" className={cn('pt-23 pb-25', isMobile && 'pt-4')}>
        <div className={cn('flex items-center justify-between mb-10', isMobile && 'mb-4')}>
          <h1 className={cn('text-3xl font-bold', isMobile && 'text-lg')}>{guide.pageTitle}</h1>
          <ShareButton
            className="border rounded-md py-3 px-4! text-sm"
            size={isMobile ? 'sm' : 'default'}
          />
        </div>

        <MarkdownPreviewer value={processedContent} />
      </Container>
    </div>
  );
};

export default GuideDetailsPage;
