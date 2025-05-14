import { useSubmitMilestoneMutation } from '@/apollo/mutation/submit-milestone.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Milestone } from '@/types/types.generated';
import { X } from 'lucide-react';
import { useState } from 'react';

function SubmitMilestoneForm({
  milestone,
  refetch,
}: { milestone: Milestone; refetch: () => void }) {
  const [description, setDescription] = useState<string>();

  const [links, setLinks] = useState<string[]>(['']);

  const [submitMutation] = useSubmitMilestoneMutation();

  const submitMilestone = (milestoneId: string) => {
    submitMutation({
      variables: {
        input: {
          id: milestoneId,
          // status: MilestoneStatus.RevisionRequested,
          links: links.map((l) => ({ title: l, url: l })),
          description,
        },
      },
      onCompleted: () => {
        refetch();
      },
    });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Submit Milestone</h2>

      <label htmlFor="title">
        <p className="font-medium text-sm">{milestone.title}</p>
        {/* <Input id="title" /> */}
      </label>

      <label htmlFor="description">
        <p className="font-medium text-sm">Description</p>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
        />
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

      <Button
        className="bg-[#B331FF] hover:bg-[#B331FF]/90 max-w-[165px] w-full ml-auto h-10"
        onClick={() => {
          document.getElementById('submit-milestone-dialog-close')?.click();
          submitMilestone(milestone?.id ?? '');
        }}
      >
        Submit Milestone
      </Button>
    </>
  );
}

export default SubmitMilestoneForm;
