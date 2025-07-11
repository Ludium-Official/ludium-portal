import { DialogButton, type DirectiveDescriptor, insertDirective$, usePublisher } from "@mdxeditor/editor"

// внутри контейнера плагина:
export const YoutubeDescriptor: DirectiveDescriptor = {
  name: 'youtube',
  testNode: node => node.name === 'youtube',
  attributes: ['id'],
  type: 'leafDirective' as const,
  hasChildren: false,
  // Editor: GenericDirectiveEditor
  Editor: (props) => {
    if (!props?.mdastNode?.attributes || typeof props?.mdastNode?.attributes.id !== 'string') {
      return <div style={{ color: 'red' }}>Invalid YouTube directive</div>
    }

    const id = props?.mdastNode?.attributes.id
    return (
      <div style={{ maxWidth: '100%', margin: '16px 0' }}>
        <iframe
          title="youtube"
          width="100%" height="360"
          src={`https://www.youtube.com/embed/${id}`}
          // frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
}

export const YouTubeButton = () => {
  const insertDirective = usePublisher(insertDirective$)
  return (
    <DialogButton
      tooltipTitle="Insert YouTube video"
      submitButtonTitle="Insert"
      dialogInputPlaceholder="Enter YouTube URL or ID"
      // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
      buttonContent={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>}
      onSubmit={input => {
        // const id = input
        const id = /(?:v=|youtu\.be\/)([\w-]+)/.exec(input)?.[1] ?? input
        insertDirective({
          name: 'youtube',
          type: 'leafDirective',
          attributes: { id },
          // children: [],
        })
      }}
    />
  )
}
