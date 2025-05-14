import client from '@/apollo/client';
import { useCreateApplicationMutation } from '@/apollo/mutation/create-application.generated';
import { useCreateMilestonesMutation } from '@/apollo/mutation/create-milestones.generated';
import { ProgramDocument } from '@/apollo/queries/program.generated';
import { currencies } from '@/components/currency-selector';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import notify from '@/lib/notify';
import type { Program } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { LoaderCircle, X } from 'lucide-react';
import { useState } from 'react';

type MilestoneType = {
  title: string;
  price: string;
  description: string;
};

const emptyMilestone = {
  title: '',
  price: '',
  description: '',
};

function CreateApplicationForm({ program }: { program?: Program | null }) {
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();

  const [links, setLinks] = useState<string[]>(['']);
  const [milestones, setMilestones] = useState<MilestoneType[]>([emptyMilestone]);

  const totalPrice = milestones.reduce((prev, curr) => Number(curr.price ?? 0) + prev, 0);

  const [createApplication, { loading }] = useCreateApplicationMutation();
  const [createMilestones, { loading: milestonesLoading }] = useCreateMilestonesMutation();

  const onSubmit = async () => {
    try {
      createApplication({
        variables: {
          input: {
            programId: program?.id ?? '',
            content: description ?? '',
            name: name ?? '',
            price: milestones
              .reduce((prev, curr) => BigNumber(curr?.price ?? '0').plus(prev), BigNumber(0))
              .toFixed(18),
            links: links.map((l) => ({ title: l, url: l })),
          },
        },
        onCompleted: async (data) => {
          createMilestones({
            variables: {
              input: milestones.map((m) => ({
                applicationId: data.createApplication?.id ?? '',
                price: m.price,
                title: m.title,
                description: m.description,
                currency: program?.currency ?? 'EDU',
              })),
            },
            onCompleted: () => {
              client.refetchQueries({
                include: [ProgramDocument],
              });
              notify('Application successfully created');
              document.getElementById('purposal-dialog-close')?.click();
            },
            onError: (e) => {
              notify(e.message, 'error');
            },
          });
        },
      });
    } catch (e) {
      notify(e instanceof Error ? e.message : 'An unknown error occurred', 'error');
      console.error(e instanceof Error ? e.message : 'An unknown error occurred', 'error');
    }
  };

  const milestoneValid =
    program?.price &&
    totalPrice <= (Number(program?.price) ?? 0) &&
    milestones.every((m) => !!m.title && !!m.price);
  const programCurrency = currencies.find((c) => c.code === program?.currency);

  return (
    <form>
      <DialogTitle className="text-2xl font-semibold mb-6">Send an application</DialogTitle>

      <DialogDescription className="hidden" />
      <DialogClose id="purposal-dialog-close" className="hidden" />
      <label htmlFor="name" className="w-full mb-6 block">
        <p className="text-sm font-medium mb-2">Name</p>
        <Input
          id="name"
          className="h-10 w-full mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-[#71717A] text-sm">This is an input description.</p>
      </label>

      <label htmlFor="description" className="w-full mb-6 block">
        <p className="text-sm font-medium mb-2">Description</p>
        <Textarea
          id="description"
          className="h-10 w-full mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-[#71717A] text-sm">This is an input description.</p>
      </label>

      <label htmlFor="links" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Links</p>
        <span className="block text-[#71717A] text-sm">
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
        {/* {extraErrors.validator && <span className="text-red-400 text-sm block">Links is required</span>} */}
      </label>

      {milestones.map((m, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <No other way>
        <div key={idx} className="mb-6">
          <div className="flex items-end w-full gap-4 mb-4">
            <label htmlFor={`title${idx}`} className="w-full">
              <p className="text-sm font-medium mb-2">MILESTONE {idx + 1}</p>
              <Input
                id={`title${idx}`}
                className="h-10 w-full"
                value={m.title}
                onChange={(e) => {
                  const newMilestone = { ...m };
                  newMilestone.title = e.target.value;
                  setMilestones((prev) => [
                    ...prev.slice(0, idx),
                    newMilestone,
                    ...prev.slice(idx + 1),
                  ]);
                }}
              />
            </label>
            <div className="flex items-end gap-2 w-full">
              <label htmlFor={`price${idx}`} className="w-full">
                <p className="text-sm font-medium mb-2">PRICE</p>
                <Input
                  type="number"
                  step={0.000000000000000001}
                  id={`price${idx}`}
                  className="h-10 w-full"
                  value={m.price}
                  onChange={(e) => {
                    const newMilestone = { ...m };
                    newMilestone.price = e.target.value;
                    setMilestones((prev) => [
                      ...prev.slice(0, idx),
                      newMilestone,
                      ...prev.slice(idx + 1),
                    ]);
                  }}
                />
              </label>
              <Button variant="outline" className="h-10" type="button" disabled>
                {programCurrency?.icon} {programCurrency?.code}
              </Button>
            </div>
          </div>
          <Textarea
            value={m.description}
            onChange={(e) => {
              const newMilestone = { ...m };
              newMilestone.description = e.target.value;
              setMilestones((prev) => [
                ...prev.slice(0, idx),
                newMilestone,
                ...prev.slice(idx + 1),
              ]);
            }}
            className="mb-3"
          />

          {milestones.length > 1 && (
            <Button
              type="button"
              className="mr-2"
              size="sm"
              variant="outline"
              onClick={() =>
                setMilestones((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)])
              }
            >
              Delete
            </Button>
          )}
          {idx === milestones.length - 1 && (
            <Button
              type="button"
              size="sm"
              onClick={() => setMilestones((prev) => [...prev, emptyMilestone])}
            >
              + Add more
            </Button>
          )}
        </div>
      ))}

      {program?.price && totalPrice > (Number(program?.price) ?? 0) && (
        <span className="text-red-400 mb-4 block">
          The total price of milestones is more than the price of the program.
        </span>
      )}
      <Button
        disabled={loading || milestonesLoading || !milestoneValid || !name || !description}
        type="button"
        className="bg-[#861CC4] h-10 ml-auto block hover:bg-[#861CC4]/90 min-w-[161px]"
        onClick={onSubmit}
      >
        {loading || milestonesLoading ? (
          <LoaderCircle className="animate-spin mx-auto" />
        ) : (
          'SUBMIT APPLICATION'
        )}
      </Button>
    </form>
  );
}

export default CreateApplicationForm;
