import { GUIDES } from '@/constant/guides';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import { ShareButton } from '@/components/ui/share-button';
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
      <div className="max-w-[936px] mx-auto pt-23 pb-25">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold">{guide.pageTitle}</h1>
          <ShareButton className="border rounded-md py-3 px-4! text-sm" />
        </div>

        <MarkdownPreviewer value={processedContent} />
      </div>
    </div>
  );
};

export default GuideDetailsPage;
