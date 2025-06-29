import {
  AdmonitionDirectiveDescriptor,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  type SandpackConfig,
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
import { useEffect, useRef, useState } from 'react';

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

export async function expressImageUploadHandler(image: File) {
  const formData = new FormData();
  formData.append('image', image);
  const response = await fetch('/uploads/new', {
    method: 'POST',
    body: formData,
  });
  const json = (await response.json()) as { url: string };
  return json.url;
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
}: {
  onChange: React.Dispatch<React.SetStateAction<string>>;
  content: string;
}) {
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
      className="overflow-auto max-h-[500px] border rounded-md shadow-md"
      contentEditableClassName="prose min-h-[300px] cursor-text"
      onChange={(value) => debouncedOnChange(value)}
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
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: prevVal }),
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
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <InsertThematicBreak />
                <BlockTypeSelect />
                <CreateLink />
                <InsertTable />
                <ListsToggle />
              </DiffSourceToggleWrapper>
            </>
          ),
        }),
      ]}
    />
  );
}

export default MarkdownEditor;
