import { simpleSandpackConfig } from '@/components/markdown/configs';
import { YouTubeButton, YoutubeDescriptor } from '@/components/markdown/youtube';
import { storage } from '@/lib/firebase';
import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
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
  toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/lib/hooks/use-mobile';

import './style.css';
import { cn } from '@/lib/utils';

const isProduction = import.meta.env.VITE_VERCEL_ENVIRONMENT === 'mainnet';
const STORAGE_FOLDER = isProduction ? 'markdown-images' : 'markdown-images-dev';

async function imageUploadHandler(image: File): Promise<string> {
  const timestamp = Date.now();
  const fileName = `${STORAGE_FOLDER}/${timestamp}_${image.name}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, image);
  return await getDownloadURL(storageRef);
}

const debounce = (fn: (value: string) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(value);
    }, delay);
  };
};

function MarkdownEditor({
  onChange,
  content,
  placeholder,
  contentClassName,
}: {
  onChange: (value: string) => void;
  content: string;
  placeholder?: string;
  contentClassName?: string;
}) {
  const isMobile = useIsMobile();

  const mdxRef = useRef<MDXEditorMethods>(null);
  const [prevVal, setPrevVal] = useState<string>('');

  useEffect(() => {
    setPrevVal((val) => (!val ? content : val));
  }, [content]);

  const debouncedChange = useRef(
    debounce((value: string) => {
      onChange(value);
    }, 300),
  ).current;

  const debouncedOnChange = (value: string) => {
    debouncedChange(value);
  };

  useEffect(() => {
    if (content) {
      mdxRef.current?.setMarkdown(content);
    }
  }, [content]);

  return (
    <MDXEditor
      ref={mdxRef}
      markdown={content}
      placeholder={placeholder}
      className="overflow-auto max-h-[600px] border rounded-md"
      contentEditableClassName={cn("prose min-h-[400px] cursor-text max-w-full", contentClassName)}
      onChange={(value) => debouncedOnChange(value)}
      plugins={[
        listsPlugin(),
        quotePlugin(),
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler,
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        frontmatterPlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor, YoutubeDescriptor],
        }),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: prevVal }),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        codeMirrorPlugin({
          codeMirrorExtensions: [],
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
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () =>
            isMobile ? (
              <>
                <UndoRedo />
                <div className="flex-1 [&_span]:!w-full [&_button]:!justify-between [&_button]:!w-full [&_button>span]:!w-fit">
                  <BlockTypeSelect />
                </div>
                <BoldItalicUnderlineToggles />
              </>
            ) : (
              <>
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <InsertThematicBreak />
                  <InsertTable />
                  <ListsToggle />
                  <InsertCodeBlock />
                  <InsertImage />
                  <YouTubeButton />
                </DiffSourceToggleWrapper>
              </>
            ),
        }),
      ]}
    />
  );
}

export default MarkdownEditor;
