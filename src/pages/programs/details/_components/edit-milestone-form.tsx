import { useUpdateMilestoneMutation } from '@/apollo/mutation/update-milestone.generated';
import { baseCurrencies, eduCurrencies } from '@/components/currency-selector';
import { MarkdownEditor } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import notify from '@/lib/notify';
import { filterEmptyLinks, validateLinks } from '@/lib/validation';
import type { Milestone } from '@/types/types.generated';
import { X } from 'lucide-react';
import { useState } from 'react';

function EditMilestoneForm({ milestone, refetch }: { milestone: Milestone; refetch: () => void }) {
  const [title, setTitle] = useState(milestone.title);
  const [price, setPrice] = useState(milestone.price);
  const [summary, setSummary] = useState(milestone.summary);
  const [description, setDescription] = useState(milestone.description ?? '');
  const [links, setLinks] = useState<string[]>(milestone?.links?.map((l) => l?.url ?? '') ?? []);
  const [linksError, setLinksError] = useState(false);

  const [updateMilestone] = useUpdateMilestoneMutation();

  const noChanges =
    milestone.title === title &&
    milestone.price === price &&
    milestone.description === description &&
    JSON.stringify(milestone.links?.map((l) => l.url)) === JSON.stringify(links);
  const programCurrency = [...eduCurrencies, ...baseCurrencies].find(
    (c) => c.code === milestone?.currency,
  );

  const onSubmit = () => {
    const { shouldSend, isValid } = validateLinks(links);
    if (!isValid) {
      setLinksError(true);
      return;
    }
    setLinksError(false);

    updateMilestone({
      variables: {
        input: {
          id: milestone.id ?? '',
          description,
          title,
          // price,
          links: shouldSend
            ? filterEmptyLinks(links).map((l) => ({ title: l, url: l }))
            : undefined,
        },
      },
      onCompleted: () => {
        notify('Milestone successfully updates');
        document.getElementById('edit-milestone-dialog-close')?.click();
        refetch();
      },
      onError: (e) => {
        notify(e.message, 'error');
      },
    });
  };
  return (
    <div>
      <DialogTitle className="text-2xl font-semibold mb-6">Edit a milestone</DialogTitle>

      <DialogDescription className="hidden" />
      <DialogClose id="edit-milestone-dialog-close" className="hidden" />

      <div className="flex items-end w-full gap-4 mb-4">
        <label htmlFor="title" className="w-full">
          <p className="text-sm font-medium mb-2">TITLE</p>
          <Input
            id="title"
            className="h-10 w-full"
            value={title ?? ''}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </label>
        <div className="flex items-end gap-2 w-full">
          <label htmlFor="price" className="w-full">
            <p className="text-sm font-medium mb-2">PRICE</p>
            <Input
              type="number"
              step={0.000000000000000001}
              id="price"
              className="h-10 w-full"
              value={price ?? 0}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </label>
          <Button variant="outline" className="h-10" type="button" disabled>
            {programCurrency?.icon} {programCurrency?.code}
          </Button>
        </div>
      </div>
      <label htmlFor="title" className="w-full">
        <p className="text-sm font-medium mb-2">SUMMARY</p>
        <Textarea
          value={summary ?? ''}
          onChange={(e) => {
            setSummary(e.target.value);
          }}
          className="mb-3"
        />
      </label>

      <label htmlFor="description" className="w-full">
        <p className="text-sm font-medium mb-2">DESCRIPTION</p>
        <MarkdownEditor content={description ?? ''} onChange={setDescription} />
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

      <Button
        disabled={!title || !price || !description || noChanges}
        type="button"
        className="bg-primary hover:bg-primary/90 h-10 ml-auto block min-w-[161px]"
        onClick={onSubmit}
      >
        {'EDIT MILESTONE'}
      </Button>
    </div>
  );
}

export default EditMilestoneForm;
