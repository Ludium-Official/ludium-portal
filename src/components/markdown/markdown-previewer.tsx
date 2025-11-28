import { simpleSandpackConfig } from '@/components/markdown/configs';
import { YoutubeDescriptor } from '@/components/markdown/youtube';
import {
  AdmonitionDirectiveDescriptor,
  MDXEditor,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  sandpackPlugin,
  tablePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import { cn } from '@/lib/utils';
import './style.css';

function MarkdownPreviewer({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <MDXEditor
      readOnly
      markdown={value}
      contentEditableClassName={cn('prose no-padding', className)}
      plugins={[
        listsPlugin(),
        quotePlugin(),
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageAutocompleteSuggestions: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150',
          ],
          imageUploadHandler: async () => Promise.resolve('https://picsum.photos/200/300'),
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        frontmatterPlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor, YoutubeDescriptor],
        }),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        codeMirrorPlugin({
          autoLoadLanguageSupport: true,
          codeBlockLanguages: {
            js: 'JavaScript',
            jsx: 'JavaScript (React)',
            css: 'CSS',
            txt: 'text',
            tsx: 'TypeScript (React)',
            ts: 'TypeScript',
            bash: 'Bash',
            sh: 'sh',
            env: 'env',
            '': 'Unspecified',
          },
        }),
        markdownShortcutPlugin(),
      ]}
    />
  );
}

export default MarkdownPreviewer;
