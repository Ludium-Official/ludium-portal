import client from '@/apollo/client';
import { useCreateApplicationMutation } from '@/apollo/mutation/create-application.generated';
import { ProgramDocument } from '@/apollo/queries/program.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {} from '@/components/ui/tooltip';
import { useApplicationDraft } from '@/lib/hooks/use-application-draft';
import notify from '@/lib/notify';
import { getCurrencyIcon } from '@/lib/utils';
import { filterEmptyLinks, validateLinks } from '@/lib/validation';
import { ApplicationDynamicTabs } from '@/pages/programs/details/_components/application-form-dynamic-tab';
import { ApplicationStatus, type Program } from '@/types/types.generated';
import { ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Types for the form
export type MilestoneType = {
  title: string;
  price: string;
  deadline: string;
  summary: string;
  description: string;
};

type FormData = {
  overview: {
    name: string;
    links: string[];
    price: string;
  };
  description: {
    summary: string;
    content: string;
  };
  milestones: MilestoneType[];
};

const emptyMilestone = { title: '', price: '', deadline: '', summary: '', description: '' };

function CreateApplicationForm({ program }: { program?: Program | null }) {
  // Single state for the form
  const [formData, setFormData] = useState<FormData>({
    overview: { name: '', links: [''], price: '0' },
    description: { summary: '', content: '' },
    milestones: [{ ...emptyMilestone }],
  });
  const [linksError, setLinksError] = useState(false);
  const [createApplication, { loading }] = useCreateApplicationMutation();
  const {
    saveDraft: saveApplicationDraft,
    loadDraft: loadApplicationDraft,
    clearDraft: clearApplicationDraft,
  } = useApplicationDraft(program?.id ?? '');

  // Prefill from draft on mount (scoped by program id)
  useEffect(() => {
    const draft = loadApplicationDraft();
    if (!draft) return;
    setFormData({
      overview: {
        name: draft.overview?.name ?? '',
        links: draft.overview?.links?.length ? draft.overview.links : [''],
        price: draft.overview?.price ?? '0',
      },
      description: {
        summary: draft.description?.summary ?? '',
        content: draft.description?.content ?? '',
      },
      milestones: draft.milestones?.length ? draft.milestones : [{ ...emptyMilestone }],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.id]);

  // Add new milestone
  const handleAddMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { ...emptyMilestone }],
    }));
  };

  // Remove milestone (except the first one)
  const handleRemoveMilestone = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== idx),
    }));
  };

  // Update milestone
  const handleMilestoneChange = (idx: number, field: keyof MilestoneType, value: string) => {
    let newValue = value;
    if (field === 'price') {
      const num = Number(value);
      if (Number.isNaN(num) || value === '') {
        newValue = '';
      } else if (num < 0) {
        newValue = '0';
      } else if (num > 100) {
        newValue = '100';
      } else {
        newValue = num.toString();
      }
    }

    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => (i === idx ? { ...m, [field]: newValue } : m)),
    }));
  };

  // Update overview
  const handleOverviewChange = (field: keyof FormData['overview'], value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      overview: { ...prev.overview, [field]: value },
    }));
  };

  // Update description
  const handleDescriptionChange = (field: keyof FormData['description'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [field]: value },
    }));
  };

  // Manage links
  const handleLinkChange = (idx: number, value: string) => {
    setFormData((prev) => {
      const newLinks = [...prev.overview.links];
      newLinks[idx] = value;
      return {
        ...prev,
        overview: { ...prev.overview, links: newLinks },
      };
    });
  };
  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      overview: { ...prev.overview, links: [...prev.overview.links, ''] },
    }));
  };
  const handleRemoveLink = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      overview: {
        ...prev.overview,
        links: prev.overview.links.filter((_, i) => i !== idx),
      },
    }));
  };

  // Submit
  const onSubmit = async () => {
    // Validation for links
    if (formData.overview.links.some((l) => l && !/^https?:\/\/[\w.-]+/.test(l))) {
      setLinksError(true);
      return;
    }
    setLinksError(false);
    try {
      await createApplication({
        variables: {
          input: {
            programId: program?.id ?? '',
            status: ApplicationStatus.Pending,
            content: formData.description.content,
            name: formData.overview.name,
            summary: formData.description.summary,
            milestones: formData.milestones.map((m) => ({
              percentage: m.price,
              // price: m.price,
              title: m.title,
              description: m.description,
              summary: m.summary,
              currency: program?.currency ?? 'EDU',
              deadline: m.deadline || new Date().toISOString(),
            })),
            price: formData.overview.price,
            // price: formData.milestones
            //   .reduce((prev, curr) => BigNumber(curr?.price ?? '0').plus(prev), BigNumber(0))
            //   .toFixed(18),
            links: (() => {
              const { shouldSend } = validateLinks(formData.overview.links);
              return shouldSend
                ? filterEmptyLinks(formData.overview.links).map((l) => ({ title: l, url: l }))
                : undefined;
            })(),
            // formData.overview.links.filter(Boolean).map((l) => ({ title: l, url: l })),
          },
        },
        onCompleted: async () => {
          client.refetchQueries({ include: [ProgramDocument] });
          notify('Application successfully created');
          document.getElementById('proposal-dialog-close')?.click();
          clearApplicationDraft();
        },
        onError: (e) => {
          notify(`Failed to create application: ${e.message}`, 'error');
        },
      });
    } catch (e) {
      notify(e instanceof Error ? e.message : 'An unknown error occurred', 'error');
      console.error(e instanceof Error ? e.message : 'An unknown error occurred', 'error');
    }
  };

  // Tabs: fixed + dynamic milestones
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      isFixed: true,
      content: (
        <div className="space-y-6">
          <label htmlFor="name" className="w-full block">
            <p className="text-sm font-medium mb-2">
              Name <span className="text-primary">*</span>
            </p>
            <Input
              id="name"
              className="h-10 w-full mb-2"
              value={formData.overview.name}
              onChange={(e) => handleOverviewChange('name', e.target.value)}
            />
          </label>
          <label htmlFor="price" className="w-full block">
            <p className="text-sm font-medium mb-2">
              Price <span className="text-primary">*</span>
            </p>
            <div className="flex gap-2">
              <Input
                id="price"
                type="number"
                className="h-10 w-full mb-2"
                value={formData.overview.price}
                onChange={(e) => handleOverviewChange('price', e.target.value)}
              />
              <Button type="button">
                {getCurrencyIcon(program?.currency)}
                {program?.currency}
              </Button>
            </div>
          </label>
          <div className="space-y-2 block">
            <p className="text-sm font-medium">Links</p>
            <span className="block text-gray-text text-sm">
              Add links to your website, blog, or social media profiles.
            </span>
            {formData.overview.links.map((l, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={`${idx}`} className="flex items-center gap-2">
                <Input
                  className="h-10 w-full"
                  value={l}
                  onChange={(e) => handleLinkChange(idx, e.target.value)}
                />
                {idx !== 0 && (
                  <X onClick={() => handleRemoveLink(idx)} className="cursor-pointer" />
                )}
              </div>
            ))}
            <Button
              onClick={handleAddLink}
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
          </div>
        </div>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      isFixed: true,
      content: (
        <div className="space-y-6">
          <label htmlFor="summary" className="w-full block">
            <p className="text-sm font-medium mb-2">
              Summary <span className="text-primary">*</span>
            </p>
            <Textarea
              id="summary"
              className="h-10 w-full mb-2"
              value={formData.description.summary}
              onChange={(e) => handleDescriptionChange('summary', e.target.value)}
            />
          </label>
          <label htmlFor="description" className="w-full block">
            <p className="text-sm font-medium mb-2">
              Description <span className="text-primary">*</span>
            </p>
            <MarkdownEditor
              onChange={(val) => handleDescriptionChange('content', val as string)}
              content={formData.description.content}
            />
          </label>
        </div>
      ),
    },
    // First milestone - fixed
    {
      id: 'milestone-0',
      label: 'Milestone 1',
      isFixed: true,
      content: (
        <div className="space-y-4">
          <label htmlFor="title0" className="w-full block">
            <p className="text-sm font-medium mb-2">
              Milestone 1 <span className="text-primary">*</span>
            </p>
            <Input
              id="title0"
              className="h-10 w-full"
              value={formData.milestones[0]?.title}
              onChange={(e) => handleMilestoneChange(0, 'title', e.target.value)}
            />
          </label>
          <div className="flex gap-4">
            <label htmlFor="price0" className="w-full block">
              <p className="text-sm font-medium mb-2">
                Milestone Payout (% of Funding) <span className="text-primary">*</span>
              </p>
              <Input
                type="number"
                id="price0"
                className="h-10 w-full"
                value={formData.milestones[0]?.price}
                onChange={(e) => handleMilestoneChange(0, 'price', e.target.value)}
                placeholder="0%"
                min={0}
                max={100}
              />
            </label>
            <label htmlFor="deadline0" className="w-full block">
              <p className="text-sm font-medium mb-2">
                Deadline <span className="text-primary">*</span>
              </p>
              <DatePicker
                disabled={{ before: new Date() }}
                date={
                  formData.milestones[0]?.deadline
                    ? new Date(formData.milestones[0]?.deadline)
                    : undefined
                }
                setDate={(date) =>
                  handleMilestoneChange(0, 'deadline', date ? (date as Date)?.toISOString() : '')
                }
              />
            </label>
          </div>
          <label htmlFor="summary0" className="w-full block">
            <p className="text-sm font-medium mb-2">
              Summary <span className="text-primary">*</span>
            </p>
            <Textarea
              id="summary0"
              value={formData.milestones[0]?.summary}
              onChange={(e) => handleMilestoneChange(0, 'summary', e.target.value)}
              className="mb-3"
            />
          </label>
          <label htmlFor="desc0" className="w-full block">
            <p className="text-sm font-medium mb-2">
              Description <span className="text-primary">*</span>
            </p>
            <MarkdownEditor
              onChange={(val) => handleMilestoneChange(0, 'description', val as string)}
              content={formData.milestones[0]?.description}
            />
          </label>
        </div>
      ),
    },
    // Dynamic milestones
    ...formData.milestones.slice(1).map((m, idx) => ({
      id: `milestone-${idx + 1}`,
      label: `Milestone ${idx + 2}`,
      isFixed: false,
      content: (
        <div className="space-y-4">
          <label htmlFor={`title${idx + 1}`} className="w-full block">
            <p className="text-sm font-medium mb-2">
              Milestone {idx + 2} <span className="text-primary">*</span>
            </p>
            <Input
              id={`title${idx + 1}`}
              className="h-10 w-full"
              value={m.title}
              onChange={(e) => handleMilestoneChange(idx + 1, 'title', e.target.value)}
            />
          </label>
          <div className="flex gap-4">
            <label htmlFor={`price${idx + 1}`} className="w-full block">
              <p className="text-sm font-medium mb-2">
                Milestone Payout (% of Funding) <span className="text-primary">*</span>
              </p>
              <Input
                type="number"
                id={`price${idx + 1}`}
                className="h-10 w-full"
                value={m.price}
                onChange={(e) => handleMilestoneChange(idx + 1, 'price', e.target.value)}
                placeholder="0%"
                min={0}
                max={100}
              />
            </label>
            <label htmlFor={`deadline${idx + 1}`} className="w-full block">
              <p className="text-sm font-medium mb-2">
                Deadline <span className="text-primary">*</span>
              </p>
              <DatePicker
                disabled={{ before: new Date() }}
                date={m.deadline ? new Date(m.deadline) : undefined}
                setDate={(date) => {
                  handleMilestoneChange(
                    idx + 1,
                    'deadline',
                    date ? (date as Date)?.toISOString() : '',
                  );
                }}
              />
            </label>
          </div>
          <label htmlFor={`summary${idx + 1}`} className="w-full block">
            <p className="text-sm font-medium mb-2">
              Summary <span className="text-primary">*</span>
            </p>
            <Textarea
              id={`summary${idx + 1}`}
              value={m.summary}
              onChange={(e) => handleMilestoneChange(idx + 1, 'summary', e.target.value)}
              className="mb-3"
            />
          </label>
          <label htmlFor={`desc${idx + 1}`} className="w-full block">
            <p className="text-sm font-medium mb-2">
              Description <span className="text-primary">*</span>
            </p>
            <MarkdownEditor
              onChange={(val) => handleMilestoneChange(idx + 1, 'description', val as string)}
              content={m.description}
            />
          </label>
        </div>
      ),
    })),
  ];

  // Validation for submit
  const milestoneValid = formData.milestones.every(
    (m) => !!m.title && !!m.price && !!m.summary && !!m.description && !!m.deadline,
  );
  const allValid =
    formData.overview.name &&
    formData.overview.price &&
    formData.description.content &&
    formData.description.summary &&
    milestoneValid;

  // Controlled active tab for navigation and per-tab validation
  const [activeTab, setActiveTab] = useState<string>('overview');
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const isLastTab = activeIndex === tabs.length - 1;

  const isTabValid = (tabId: string): boolean => {
    if (tabId === 'overview') {
      return !!formData.overview.name && !!formData.overview.price;
    }
    if (tabId === 'description') {
      return !!formData.description.summary && !!formData.description.content;
    }
    if (tabId.startsWith('milestone-')) {
      const parts = tabId.split('-');
      const idxStr = parts[1];
      const idx = Number(idxStr);
      const m = formData.milestones[idx];
      if (!m) return false;
      return !!m.title && !!m.price && !!m.summary && !!m.description && !!m.deadline;
    }
    return true;
  };

  const handleContinue = () => {
    if (isLastTab) return;
    const next = tabs[activeIndex + 1];
    if (next) setActiveTab(next.id);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <DialogClose className="hidden" id="proposal-dialog-close" />
      <DialogTitle className="text-2xl mb-6">Submit application</DialogTitle>

      <ApplicationDynamicTabs
        tabs={tabs}
        defaultActiveTab="overview"
        onAddMilestone={handleAddMilestone}
        onRemoveMilestone={handleRemoveMilestone}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />
      <div className="flex gap-2 justify-end absolute bottom-6 right-6">
        <Button
          type="button"
          variant="outline"
          aria-label="Save application draft"
          onClick={() => {
            saveApplicationDraft(formData);
            notify('Draft saved.');
          }}
        >
          Save draft
        </Button>
        {isLastTab ? (
          <Button
            disabled={loading || !allValid}
            type="submit"
            className="bg-primary hover:bg-primary/90 h-10 min-w-[161px] ml-2"
          >
            {loading ? 'Submitting...' : 'Submit application'}
          </Button>
        ) : (
          <Button
            type="button"
            className="h-10 min-w-[161px] ml-2"
            variant="default"
            disabled={!isTabValid(activeTab)}
            onClick={handleContinue}
            aria-label="Continue writing"
          >
            Continue writing <ChevronRight className="ml-1" />
          </Button>
        )}
      </div>
    </form>
  );
}

export default CreateApplicationForm;
