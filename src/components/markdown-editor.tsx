import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  UndoRedo,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useEffect, useRef } from 'react';

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
}: { onChange: React.Dispatch<React.SetStateAction<string>>; content: string }) {
  const mdxRef = useRef<MDXEditorMethods>(null);

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
      className="border rounded-md shadow-md"
      contentEditableClassName="prose"
      onChange={(value) => debouncedOnChange(value)}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        markdownShortcutPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <InsertThematicBreak />
              <BlockTypeSelect />
              <CreateLink />
              <InsertTable />
              <ListsToggle />
            </>
          ),
        }),
      ]}
    />
  );
}

export default MarkdownEditor;
