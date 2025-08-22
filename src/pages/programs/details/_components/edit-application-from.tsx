import { useUpdateApplicationMutation } from '@/apollo/mutation/update-application.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import notify from '@/lib/notify';
import { filterEmptyLinks, validateLinks } from '@/lib/validation';
import { type Application, ApplicationStatus } from '@/types/types.generated';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

function EditApplicationForm({
  application,
  refetch,
}: { application?: Application | null; refetch: () => void }) {
  const [name, setName] = useState<string>();
  const [summary, setSummary] = useState<string>();
  const [content, setContent] = useState<string>('');
  const [links, setLinks] = useState<string[]>(['']);
  const [linksError, setLinksError] = useState(false);
  const [updateApplcation] = useUpdateApplicationMutation();

  useEffect(() => {
    if (application) {
      setName(application?.name ?? '');
      setSummary(application.summary ?? '');
      setContent(application.content ?? '');
      setLinks(application?.links?.map((l) => l?.url ?? '') ?? []);
    }
  }, [application]);

  const onSubmit = async (resubmit?: boolean) => {
    const { shouldSend, isValid } = validateLinks(links);
    if (!isValid) {
      setLinksError(true);
      return;
    }
    setLinksError(false);

    updateApplcation({
      variables: {
        input: {
          id: application?.id ?? '',
          content,
          links: shouldSend
            ? filterEmptyLinks(links).map((l) => ({ title: l, url: l }))
            : undefined,
          summary,
          status: resubmit ? ApplicationStatus.Pending : undefined,
          name,
        },
      },
      onCompleted: () => {
        refetch();
        notify('Application successfully created');
        document.getElementById('edit-app-dialog-close')?.click();
      },
      onError: (e) => {
        notify(e.message, 'error');
      },
    });
  };

  const noChanges =
    application?.summary === summary &&
    application?.content === content &&
    application.name === name &&
    JSON.stringify(application.links?.map((l) => l.url)) === JSON.stringify(links);

  return (
    <form>
      <DialogTitle className="text-2xl font-semibold mb-6">Edit an application</DialogTitle>

      <DialogDescription className="hidden" />
      <DialogClose id="edit-app-dialog-close" className="hidden" />
      <label htmlFor="name" className="w-full mb-6 block">
        <p className="text-sm font-medium mb-2">Name</p>
        <Input
          id="name"
          className="h-10 w-full mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label htmlFor="summary" className="w-full mb-6 block">
        <p className="text-sm font-medium mb-2">Summary</p>
        <Input
          id="summary"
          className="h-10 w-full mb-2"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </label>

      <label htmlFor="description" className="w-full mb-6 block">
        <p className="text-sm font-medium mb-2">Description</p>

        <MarkdownEditor onChange={setContent} content={content} />
      </label>

      <label htmlFor="links" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Links</p>
        <span className="block text-gray-text text-sm">
          Add links to your website, blog, or social media profiles.
        </span>

        {links.map((l, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={idx} className="flex items-center gap-2">
            <Input
              className="h-10 max-w-[431.61px]"
              value={l}
              onChange={(e) => {
                setLinks((prev) => {
                  const newLinks = [...prev];
                  newLinks[idx] = e.target.value;
                  return newLinks;
                });
              }}
            />
            {idx !== 0 && (
              <X
                onClick={() =>
                  setLinks((prev) => {
                    const newLinks = [...[...prev].slice(0, idx), ...[...prev].slice(idx + 1)];

                    return newLinks;
                  })
                }
              />
            )}
          </div>
        ))}
        <Button
          onClick={() => setLinks((prev) => [...prev, ''])}
          type="button"
          variant="outline"
          size="sm"
          className="rounded-[6px]"
        >
          Add URL
        </Button>
        {linksError && (
          <span className="text-red-400 text-sm block">
            The provided link is not valid. All links must begin with{' '}
            <span className="font-bold">https://</span>.
          </span>
        )}
      </label>

      <div className="flex justify-end gap-4">
        <Button
          disabled={!name || !content || !summary || noChanges}
          type="button"
          className="bg-primary hover:bg-primary/90 h-10 block min-w-[161px]"
          onClick={() => onSubmit()}
        >
          {'EDIT APPLICATION'}
        </Button>

        {application?.status === ApplicationStatus.Rejected && (
          <Button
            disabled={!name || !content || !summary}
            type="button"
            className="bg-primary hover:bg-primary/90 h-10 block min-w-[161px]"
            onClick={() => onSubmit(true)}
          >
            EDIT AND RESUBMIT
          </Button>
        )}
      </div>
    </form>
  );
}

export default EditApplicationForm;
