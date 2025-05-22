import {
  MDXEditor,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

function MarkdownPreviewer({ value }: { value: string }) {
  // const mdxEditorRef = useRef<MDXEditorMethods>(null);

  // useEffect(() => {
  //   if (value) {
  //     console.log('🚀 ~ useEffect ~ value:', value);

  //     console.log('🚀 ~ useEffect ~ mdxEditorRef.current:', mdxEditorRef.current);
  //     mdxEditorRef.current?.setMarkdown(value);
  //   }
  // }, [value]);

  return (
    <MDXEditor
      readOnly
      markdown={value}
      contentEditableClassName="prose"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        markdownShortcutPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
      ]}
    />
  );
}

export default MarkdownPreviewer;
