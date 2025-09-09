import { useProgramQuery } from '@/apollo/queries/program.generated';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useProjectDraft } from '@/lib/hooks/use-project-draft';
import notify from '@/lib/notify';
import { cn, getCurrency, getCurrencyIcon, sortTierSettings } from '@/lib/utils';
import { filterEmptyLinks, validateLinks } from '@/lib/validation';
import { type LinkInput, ProgramStatus } from '@/types/types.generated';
import { Check, ChevronRight, TriangleAlert, X } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

// Tier colors configuration
const tierColors = {
  bronze: 'bg-[#EED5C1] text-[#9F6636]',
  silver: 'bg-[#E2E8F0] text-[#64748B]',
  gold: 'bg-[#FFDEA1] text-[#CA8A04]',
  platinum: 'bg-[#CAF0E3] text-[#0D9488]',
} as const;

// Terms state
interface Term {
  id: number;
  title: string;
  prize: string;
  purchaseLimit: string;
  description: string;
}
// Milestones state
interface Milestone {
  id: number;
  title: string;
  payoutPercentage: string;
  endDate: Date | undefined;
  summary: string;
  description: string;
}

export type OnSubmitProjectFunc = (data: {
  id?: string;
  name: string;
  fundingToBeRaised?: string;
  description: string;
  summary: string;
  links?: LinkInput[];
  // isPublish?: boolean;
  image?: File;
  visibility: 'public' | 'restricted' | 'private';
  builders?: string[];
  milestones?: Milestone[];
  investmentTerms?: Term[];
  programId?: string;
}) => void;

export interface ProjectFormProps {
  isEdit: boolean;
  onSubmitProject: OnSubmitProjectFunc;
}

function ProjectForm({ onSubmitProject, isEdit }: ProjectFormProps) {
  const { id } = useParams();

  const { data } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
    // skip: !isEdit,
  });

  const [selectedTab, setSelectedTab] = useState<string>('overview');

  const [content, setContent] = useState<string>('');
  const [links, setLinks] = useState<string[]>(['']);
  const [visibility, setVisibility] = useState<'public' | 'restricted' | 'private'>('public');
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<
    { label: string; value: string }[]
  >([]);
  const [builderInput, setBuilderInput] = useState<string>();
  const [debouncedBuilderInput, setDebouncedBuilderInput] = useState<string>();

  // Supporter tier state
  const [supporterTierConfirmed, setSupporterTierConfirmed] = useState<boolean>(false);

  const [nextTermId, setNextTermId] = useState<number>(2); // Start from 2 since Term 1 has id 1
  const [selectedTiers, setSelectedTiers] = useState<string[]>(['']);
  const [popoverStates, setPopoverStates] = useState<boolean[]>([false]);

  // Confirmation modal states
  const [deleteTermModalOpen, setDeleteTermModalOpen] = useState<boolean>(false);
  const [deleteMilestoneModalOpen, setDeleteMilestoneModalOpen] = useState<boolean>(false);
  const [termToDelete, setTermToDelete] = useState<number | null>(null);
  const [milestoneToDelete, setMilestoneToDelete] = useState<number | null>(null);

  const [terms, setTerms] = useState<Term[]>([
    {
      id: 1,
      title: '',
      prize: '',
      purchaseLimit: '',
      description: '',
    },
  ]);

  const [nextMilestoneId, setNextMilestoneId] = useState<number>(2); // Start from 2 since Milestone 1 has id 1

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      title: '',
      payoutPercentage: '',
      endDate: undefined,
      summary: '',
      description: '',
    },
  ]);

  const [extraErrors, dispatchErrors] = useReducer(extraErrorReducer, {
    links: false,
    invalidLink: false,
    supporterTier: false,
    description: false,
    terms: [] as boolean[],
    milestones: [] as boolean[],
  });

  // useEffect(() => {
  //   if (data?.program?.deadline) setDeadline(new Date(data?.program?.deadline));
  //   if (data?.program?.links) setLinks(data?.program?.links.map((l) => l.url ?? ''));
  //   if (data?.program?.description) setContent(data?.program.description);
  //   if (data?.program?.network) setNetwork(data?.program?.network);
  //   if (data?.program?.currency) setCurrency(data?.program?.currency);
  // }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBuilderInput(builderInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [builderInput]);

  const { data: buildersData, loading: buildersLoading } = useUsersQuery({
    variables: {
      input: {
        limit: 5,
        offset: 0,
        filter: [
          {
            field: 'search',
            value: debouncedBuilderInput ?? '',
          },
        ],
      },
    },
    skip: !builderInput,
  });

  const builderOptions = buildersData?.users?.data?.map((v) => ({
    value: v.id ?? '',
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ''}`,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    values: {
      name: '',
      fundingToBeRaised: data?.program?.price ?? undefined,
      summary: '',
    },
  });

  const onSubmit = (submitData: {
    name: string;
    fundingToBeRaised: string | undefined;
    summary: string;
  }) => {
    if (
      extraErrors.links ||
      extraErrors.invalidLink ||
      !content.length ||
      !supporterTierConfirmed
    ) {
      notify('Please fill in all required fields.', 'error');
      return;
    }

    onSubmitProject({
      id: data?.program?.id ?? id,
      name: submitData.name,
      fundingToBeRaised:
        isEdit && data?.program?.status !== ProgramStatus.Pending
          ? undefined
          : submitData.fundingToBeRaised,
      description: content,
      summary: submitData.summary,
      links: (() => {
        const { shouldSend } = validateLinks(links);
        return shouldSend ? filterEmptyLinks(links).map((l) => ({ title: l, url: l })) : undefined;
      })(),
      visibility: visibility,
      builders: selectedBuilders,
      milestones: milestones,
      investmentTerms: terms,
    });
  };

  const extraValidation = () => {
    let hasErrors = false;

    if (!watch('name') || !watch('fundingToBeRaised') || !watch('summary')) {
      notify('Please fill in all required fields.', 'error');
      hasErrors = true;
    }

    dispatchErrors({ type: ExtraErrorActionKind.CLEAR_ERRORS });

    if (!content.length) {
      dispatchErrors({ type: ExtraErrorActionKind.SET_DESCRIPTION_ERROR });
      hasErrors = true;
    }

    if (!supporterTierConfirmed) {
      dispatchErrors({ type: ExtraErrorActionKind.SET_SUPPORTER_TIER_ERROR });
      hasErrors = true;
    }

    // Validate terms
    const termsErrors = terms.map((term) => {
      const hasError = !term.title || !term.prize || !term.purchaseLimit || !term.description;
      if (hasError) {
        const purchaseLimit = Number.parseInt(term.purchaseLimit, 10);
        if (Number.isNaN(purchaseLimit) || purchaseLimit <= 0) {
          return true;
        }
      }
      return hasError;
    });

    if (termsErrors.some((error) => error)) {
      dispatchErrors({
        type: ExtraErrorActionKind.SET_TERMS_ERROR,
        payload: termsErrors,
      });
      hasErrors = true;
    }

    // Validate milestones
    const milestonesErrors = milestones.map((milestone) => {
      return (
        !milestone.title ||
        !milestone.payoutPercentage ||
        !milestone.endDate ||
        !milestone.summary ||
        !milestone.description
      );
    });

    if (milestonesErrors.some((error) => error)) {
      dispatchErrors({
        type: ExtraErrorActionKind.SET_MILESTONES_ERROR,
        payload: milestonesErrors,
      });
      hasErrors = true;
    }

    let totalPayout = 0;
    for (const milestone of milestones) {
      const payout = Number.parseFloat(milestone.payoutPercentage);
      if (!Number.isNaN(payout) && payout >= 0) {
        totalPayout += payout;
      }
    }

    if (totalPayout > 100) {
      notify('Total milestone payout cannot exceed 100%.', 'error');
      hasErrors = true;
    }

    // Validate funding amount
    const maxFunding = Number.parseFloat(data?.program?.price ?? '0');
    const requestedFunding = Number.parseFloat(watch('fundingToBeRaised') ?? '0');
    if (requestedFunding > maxFunding) {
      notify('Funding to be raised cannot exceed maximum funding amount.', 'error');
      hasErrors = true;
    }
    if (requestedFunding <= 0) {
      notify('Funding to be raised cannot be zero.', 'error');
      hasErrors = true;
    }

    const { isValid } = validateLinks(links);
    if (!isValid) {
      dispatchErrors({ type: ExtraErrorActionKind.SET_INVALID_LINK_ERROR });
      hasErrors = true;
    }

    if (!hasErrors) {
      formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  const { saveDraft: saveProjectDraft, loadDraft: loadProjectDraft } = useProjectDraft();

  // Validation functions for each tab
  const isOverviewTabValid = () => {
    const name = watch('name');
    const fundingToBeRaised = watch('fundingToBeRaised');
    // const summary = watch('summary');
    // const hasDescription = content.length > 0;
    const hasSupporterTierConfirmed = supporterTierConfirmed;

    return name && fundingToBeRaised && hasSupporterTierConfirmed;
  };

  const isDetailsTabValid = () => {
    const summary = watch('summary');
    const hasDescription = content.length > 0;

    return summary && hasDescription;
  };

  const isTermsTabValid = () => {
    // Check if all terms have required fields
    const allTermsValid = terms.every((term) => {
      const hasError = !term.title || !term.prize || !term.purchaseLimit || !term.description;
      if (hasError) {
        const purchaseLimit = Number.parseInt(term.purchaseLimit, 10);
        if (Number.isNaN(purchaseLimit) || purchaseLimit <= 0) {
          return false;
        }
      }
      return !hasError;
    });

    if (!allTermsValid) {
      return false;
    }

    // Check if total sum of terms doesn't exceed funding to be raised
    const fundingToBeRaised = Number.parseFloat(watch('fundingToBeRaised') ?? '0');
    const totalSum =
      Math.round(
        terms
          .filter((term) => term.title && term.prize && term.purchaseLimit)
          .reduce((sum, term) => {
            const prize = data?.program?.tierSettings
              ? (data.program.tierSettings as Record<string, { maxAmount?: number }>)[term.prize]
                  ?.maxAmount || 0
              : Number.parseFloat(term.prize) || 0;
            const purchaseLimit = Number.parseInt(term.purchaseLimit, 10) || 0;
            return sum + prize * purchaseLimit;
          }, 0) * 100000000,
      ) / 100000000;

    return totalSum <= fundingToBeRaised;
  };

  // Prefill from draft on mount when creating (not editing)
  useEffect(() => {
    if (isEdit) return;
    const draft = loadProjectDraft();
    if (!draft) return;
    setValue('name', draft.name ?? '');
    setValue('fundingToBeRaised', draft.fundingToBeRaised ?? '');
    setValue('summary', draft.summary ?? '');
    setContent(draft.description ?? '');
    setLinks(draft.links?.length ? draft.links : ['']);
    setVisibility(draft.visibility ?? 'public');
    setSelectedBuilders(draft.builders ?? []);
    setSupporterTierConfirmed(draft.supporterTierConfirmed ?? false);
    if (draft.selectedBuilderItems) setSelectedBuilderItems(draft.selectedBuilderItems);
    if (draft.terms) setTerms(draft.terms);
    if (draft.milestones) setMilestones(draft.milestones);
  }, [isEdit]);

  // Terms handlers
  const addTerm = () => {
    setTerms((prevTerms) => [
      ...prevTerms,
      {
        id: nextTermId,
        title: '',
        prize: '',
        purchaseLimit: '',
        description: '',
      },
    ]);
    setSelectedTiers((prev) => [...prev, '']);
    setPopoverStates((prev) => [...prev, false]);
    setNextTermId((prev) => prev + 1);
  };

  const handleDeleteTermClick = (index: number) => {
    if (index === 0) return; // Term 1 cannot be deleted
    setTermToDelete(index);
    setDeleteTermModalOpen(true);
  };

  const confirmDeleteTerm = () => {
    if (termToDelete !== null) {
      setTerms((prevTerms) => prevTerms.filter((_, i) => i !== termToDelete));
      setSelectedTiers((prev) => prev.filter((_, i) => i !== termToDelete));
      setPopoverStates((prev) => prev.filter((_, i) => i !== termToDelete));
      setDeleteTermModalOpen(false);
      setTermToDelete(null);
    }
  };

  const updateTerm = (index: number, field: keyof Term, value: string) => {
    setTerms((prevTerms) =>
      prevTerms.map((term, i) => (i === index ? { ...term, [field]: value } : term)),
    );
  };

  // Milestones handlers
  const addMilestone = () => {
    setMilestones((prevMilestones) => [
      ...prevMilestones,
      {
        id: nextMilestoneId,
        title: '',
        payoutPercentage: '',
        endDate: undefined,
        summary: '',
        description: '',
      },
    ]);
    setNextMilestoneId((prev) => prev + 1);
  };

  const handleDeleteMilestoneClick = (index: number) => {
    if (index === 0) return; // Milestone 1 cannot be deleted
    setMilestoneToDelete(index);
    setDeleteMilestoneModalOpen(true);
  };

  const confirmDeleteMilestone = () => {
    if (milestoneToDelete !== null) {
      setMilestones((prevMilestones) => prevMilestones.filter((_, i) => i !== milestoneToDelete));
      setDeleteMilestoneModalOpen(false);
      setMilestoneToDelete(null);
    }
  };

  const updateMilestone = (
    index: number,
    field: keyof Milestone,
    value: string | Date | undefined,
  ) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone,
      ),
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="max-w-[820px] w-full mx-auto">
      <h1 className="font-medium text-xl mb-6">Submit Project</h1>
      {/* <h1 className="font-medium text-xl mb-6">{isEdit ? 'Edit Program' : 'Create Program'}</h1> */}

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full px-0 mb-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="milestone">Milestones</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="bg-white py-6 px-10 rounded-lg mb-3">
            <label htmlFor="name" className="space-y-2 block mb-10">
              <p className="text-sm font-medium">
                Name <span className="text-primary">*</span>
              </p>
              <Input
                id="name"
                type="text"
                placeholder="Type name"
                className="h-10"
                {...register('name', { required: true })}
              />
              {errors.name && (
                <span className="text-destructive text-sm block">Name is required</span>
              )}
            </label>

            <label htmlFor="price" className="space-y-2 block">
              <p className="text-sm font-medium">
                Funding to be raised <span className="text-primary">*</span>
              </p>

              <div className="flex items-center justify-between bg-secondary rounded-md p-3">
                <p className="text-sm font-bold text-muted-foreground">Maximum funding amount</p>
                <div className="flex items-center gap-2">
                  <span>{getCurrencyIcon(data?.program?.currency)}</span>{' '}
                  <span className="font-bold">
                    {data?.program?.price} {data?.program?.currency}
                  </span>{' '}
                  <span className="text-muted-foreground text-sm text-bold">
                    {getCurrency(data?.program?.network)?.display}
                  </span>
                </div>
              </div>

              <Input
                id="fundingToBeRaised"
                type="number"
                min="0"
                placeholder="0"
                className="h-10"
                {...register('fundingToBeRaised', { required: true })}
              />
              {errors.fundingToBeRaised && (
                <span className="text-destructive text-sm block">Amount is required</span>
              )}
            </label>

            <label htmlFor="supporterTier" className="space-y-2 block mt-10">
              <p className="text-sm font-medium text-muted-foreground">
                Supporter Tier <span className="text-primary">*</span>
              </p>

              {/* Program Tier Condition Box */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div
                  className={cn(
                    'flex items-center justify-between border-b pb-2 mb-2',
                    !data?.program?.tierSettings && 'border-none pb-0 mb-0',
                  )}
                >
                  <p className="text-sm font-medium text-gray-700">Program Tier Condition</p>
                  {data?.program?.tierSettings ? (
                    <div className="flex items-center gap-2">
                      {data?.program?.tierSettings &&
                        sortTierSettings(data.program.tierSettings, false).map(([key, value]) => {
                          if (!(value as { enabled: boolean })?.enabled) return null;

                          return (
                            <span
                              key={key}
                              className={`${
                                tierColors[key as keyof typeof tierColors]
                              } px-2 py-0.5 rounded-full text-sm font-semibold`}
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground font-bold">Open</p>
                  )}
                </div>
                {!!data?.program?.tierSettings && (
                  <div className="flex flex-col items-end space-y-1">
                    {sortTierSettings(data?.program?.tierSettings, false).map(
                      ([key, value]) =>
                        (value as { enabled: boolean })?.enabled && (
                          <div className="text-sm text-gray-600">
                            {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                            {(value as { maxAmount?: number })?.maxAmount} {data?.program?.currency}
                          </div>
                        ),
                    )}

                    {/* <div className="text-sm text-gray-600">Gold 10,000</div>
                  <div className="text-sm text-gray-600">Platinum 20,000</div> */}
                  </div>
                )}
              </div>

              {/* Confirmed Checkbox */}
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="supporterTierConfirmed"
                  checked={supporterTierConfirmed}
                  onCheckedChange={(checked) => setSupporterTierConfirmed(checked as boolean)}
                />
                <Label htmlFor="supporterTierConfirmed" className="text-sm font-medium">
                  Confirmed
                </Label>
              </div>
              {extraErrors.supporterTier && (
                <span className="text-destructive text-sm block mt-2">
                  Please confirm the supporter tier
                </span>
              )}
            </label>
          </div>

          <div className="px-10 py-6 bg-white rounded-lg">
            <label htmlFor="links" className="space-y-2 block">
              <p className="text-sm font-medium">Links</p>
              <span className="block text-gray-text text-sm">
                Add links to your website, blog, or social media profiles.
              </span>

              {links.map((l, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    className="h-10 max-w-[555px]"
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
                          const newLinks = [
                            ...[...prev].slice(0, idx),
                            ...[...prev].slice(idx + 1),
                          ];

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
              {extraErrors.links && (
                <span className="text-destructive text-sm block">Links is required</span>
              )}
              {extraErrors.invalidLink && (
                <span className="text-destructive text-sm block">
                  The provided link is not valid. All links must begin with{' '}
                  <span className="font-bold">https://</span>.
                </span>
              )}
            </label>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="bg-white px-10 py-6 rounded-lg mb-3">
            <label htmlFor="summary" className="space-y-2 block">
              <p className="text-sm font-medium">
                Summary <span className="text-primary">*</span>
              </p>
              <Textarea
                id="summary"
                placeholder="Type summary"
                className="h-10"
                {...register('summary', { required: true })}
              />
              {errors.summary && (
                <span className="text-destructive text-sm block">Summary is required</span>
              )}
            </label>
          </div>

          <div className="px-10 py-6 bg-white rounded-lg">
            <label htmlFor="description" className="space-y-2 block">
              <p className="text-sm font-medium">
                Description <span className="text-primary">*</span>
              </p>

              <MarkdownEditor onChange={setContent} content={content} />
              {extraErrors.description && (
                <span className="text-destructive text-sm block">Description is required</span>
              )}
            </label>
          </div>
        </TabsContent>

        <TabsContent value="terms">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6">
              <label htmlFor="price" className="space-y-2 block">
                <p className="text-sm font-medium">
                  Funding to be raised <span className="text-primary">*</span>
                </p>

                <div className="flex items-center justify-between bg-secondary rounded-md p-3">
                  <p className="text-sm font-bold text-muted-foreground">Maximum funding amount</p>
                  <div className="flex items-center gap-2">
                    <span>{getCurrencyIcon(data?.program?.currency)}</span>{' '}
                    <span className="font-bold">
                      {watch('fundingToBeRaised')} {data?.program?.currency}
                    </span>{' '}
                    <span className="text-muted-foreground text-sm text-bold">
                      {getCurrency(data?.program?.network)?.display}
                    </span>
                  </div>
                </div>

                {/* <Input
                  id="fundingToBeRaised"
                  type="number"
                  placeholder="0"
                  className="h-10"
                  {...register('fundingToBeRaised', { required: true })}
                />
                {errors.fundingToBeRaised && (
                  <span className="text-destructive text-sm block">Amount is required</span>
                )} */}
              </label>

              <label htmlFor="supporterTier" className="space-y-2 block mt-10">
                <p className="text-sm font-medium text-muted-foreground">
                  Supporter Tier <span className="text-primary">*</span>
                </p>

                {/* Program Tier Condition Box */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div
                    className={cn(
                      'flex items-center justify-between border-b pb-2 mb-2',
                      !data?.program?.tierSettings && 'border-none pb-0 mb-0',
                    )}
                  >
                    <p className="text-sm font-medium text-gray-700">Program Tier Condition</p>
                    {data?.program?.tierSettings ? (
                      <div className="flex items-center gap-2">
                        {data?.program?.tierSettings &&
                          sortTierSettings(data.program.tierSettings, false).map(([key, value]) => {
                            if (!(value as { enabled: boolean })?.enabled) return null;

                            return (
                              <span
                                key={key}
                                className={`${
                                  tierColors[key as keyof typeof tierColors]
                                } px-2 py-0.5 rounded-full text-sm font-semibold`}
                              >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                            );
                          })}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground font-bold">Open</p>
                    )}
                  </div>
                  {!!data?.program?.tierSettings && (
                    <div className="flex flex-col items-end space-y-1">
                      {sortTierSettings(data?.program?.tierSettings, false).map(
                        ([key, value]) =>
                          (value as { enabled: boolean })?.enabled && (
                            <div className="text-sm text-gray-600">
                              {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                              {(value as { maxAmount?: number })?.maxAmount}{' '}
                              {data?.program?.currency}
                            </div>
                          ),
                      )}

                      {/* <div className="text-sm text-gray-600">Gold 10,000</div>
                  <div className="text-sm text-gray-600">Platinum 20,000</div> */}
                    </div>
                  )}
                </div>
              </label>
            </div>
            {terms.map((term, index) => (
              <div key={term.id} className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Term {index + 1}</h3>
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTermClick(index)}
                      className="bg-secondary"
                    >
                      Delete
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor={`title-${index}`} className="text-sm font-medium">
                      Title <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id={`title-${index}`}
                      placeholder="Placeholder"
                      value={term.title}
                      onChange={(e) => updateTerm(index, 'title', e.target.value)}
                      className="mt-2 h-10"
                    />
                    {extraErrors.terms[index] && !term.title && (
                      <span className="text-destructive text-sm block mt-1">Title is required</span>
                    )}
                  </div>

                  {/* Prize/Tier Selection and Purchase Limit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`prize-${index}`} className="text-sm font-medium">
                        {data?.program?.tierSettings ? 'Tier' : 'Prize'}{' '}
                        <span className="text-primary">*</span>
                      </Label>
                      {data?.program?.tierSettings ? (
                        <Popover
                          open={popoverStates[index]}
                          onOpenChange={(open) => {
                            setPopoverStates((prev) =>
                              prev.map((state, i) => (i === index ? open : state)),
                            );
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="mt-2 h-10 w-full justify-between bg-white"
                            >
                              {selectedTiers[index] ? (
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`${
                                      tierColors[selectedTiers[index] as keyof typeof tierColors]
                                    } px-2 py-0.5 rounded-full text-sm font-semibold`}
                                  >
                                    {selectedTiers[index].charAt(0).toUpperCase() +
                                      selectedTiers[index].slice(1)}
                                  </span>
                                  {
                                    (
                                      data?.program?.tierSettings as Record<
                                        string,
                                        { maxAmount?: number }
                                      >
                                    )[selectedTiers[index]]?.maxAmount
                                  }{' '}
                                  {data?.program?.currency}
                                </span>
                              ) : (
                                'Select tier'
                              )}
                              <ChevronRight className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-2" align="start">
                            <div className="">
                              {sortTierSettings(data.program.tierSettings, false).map(
                                ([key, value]) => {
                                  if (!(value as { enabled: boolean })?.enabled) return null;

                                  return (
                                    <Button
                                      key={key}
                                      variant="ghost"
                                      className="w-full justify-start pl-1"
                                      onClick={() => {
                                        setSelectedTiers((prev) =>
                                          prev.map((tier, i) => (i === index ? key : tier)),
                                        );
                                        updateTerm(index, 'prize', key);
                                        setPopoverStates((prev) =>
                                          prev.map((state, i) => (i === index ? false : state)),
                                        );
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        {selectedTiers[index] === key ? (
                                          <Check className="h-4 w-4 text-foreground" />
                                        ) : (
                                          <div className="w-4 h-4" />
                                        )}
                                        <span
                                          className={`${
                                            tierColors[key as keyof typeof tierColors]
                                          } px-2 py-0.5 rounded-full text-sm font-semibold`}
                                        >
                                          {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </span>
                                        {(value as { maxAmount?: number })?.maxAmount}{' '}
                                        {data?.program?.currency}
                                      </div>
                                    </Button>
                                  );
                                },
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Input
                          id={`prize-${index}`}
                          type="number"
                          min="0"
                          placeholder="0"
                          value={term.prize}
                          onChange={(e) => updateTerm(index, 'prize', e.target.value)}
                          className="mt-2 h-10"
                        />
                      )}
                      {extraErrors.terms[index] && !term.prize && (
                        <span className="text-destructive text-sm block mt-1">
                          Prize/Tier is required
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`purchaseLimit-${index}`} className="text-sm font-medium">
                        Purchase limit <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id={`purchaseLimit-${index}`}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={term.purchaseLimit}
                        onChange={(e) => updateTerm(index, 'purchaseLimit', e.target.value)}
                        className="mt-2 h-10"
                      />
                      {extraErrors.terms[index] &&
                        (!term.purchaseLimit || Number.parseInt(term.purchaseLimit, 10) <= 0) && (
                          <span className="text-destructive text-sm block mt-1">
                            Purchase limit must be a positive integer
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor={`description-${index}`} className="text-sm font-medium">
                      Description <span className="text-primary">*</span>
                    </Label>
                    <div className="mt-2">
                      <MarkdownEditor
                        content={term.description}
                        onChange={(value) => {
                          if (typeof value === 'string') {
                            updateTerm(index, 'description', value);
                          } else if (typeof value === 'function') {
                            const newValue = value(term.description);
                            updateTerm(index, 'description', newValue);
                          }
                        }}
                      />
                      {extraErrors.terms[index] && !term.description && (
                        <span className="text-destructive text-sm block mt-1">
                          Description is required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add more terms button - only show after the last term */}
                  {index === terms.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTerm}
                      className="bg-white border border-gray-300 text-gray-700 mt-2"
                    >
                      <X className="w-4 h-4 mr-2 rotate-45" />
                      Add more terms
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="bg-[#FAF5FF] rounded-lg py-6 px-10 border border-primary">
              {terms.length > 0 &&
              terms.some((term) => term.title && term.prize && term.purchaseLimit) ? (
                <div className="space-y-4">
                  <div className="">
                    {terms
                      .filter((term) => term.title && term.prize && term.purchaseLimit)
                      .map((term) => {
                        const prize = data?.program?.tierSettings
                          ? (data.program.tierSettings as Record<string, { maxAmount?: number }>)[
                              term.prize
                            ]?.maxAmount || 0
                          : Number.parseFloat(term.prize) || 0;
                        const purchaseLimit = Number.parseInt(term.purchaseLimit, 10) || 0;
                        const totalPrice = prize * purchaseLimit;

                        return (
                          <div
                            key={term.id}
                            className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 text-sm last:border-b-0"
                          >
                            <div className="flex items-center">
                              {data?.program?.tierSettings ? (
                                <span
                                  className={`${
                                    tierColors[term.prize as keyof typeof tierColors]
                                  } px-2 py-1 rounded-full text-xs font-semibold`}
                                >
                                  {term.prize.charAt(0).toUpperCase() + term.prize.slice(1)}
                                </span>
                              ) : (
                                <span className="font-medium">
                                  {prize} {data?.program?.currency}
                                </span>
                              )}
                            </div>
                            <div className="text-gray-600">{purchaseLimit}</div>
                            <div className="font-medium  justify-self-end text-right">
                              {totalPrice} {data?.program?.currency}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Total Row */}
                  {(() => {
                    const totalSum =
                      Math.round(
                        terms
                          .filter((term) => term.title && term.prize && term.purchaseLimit)
                          .reduce((sum, term) => {
                            const prize = data?.program?.tierSettings
                              ? (
                                  data.program.tierSettings as Record<
                                    string,
                                    { maxAmount?: number }
                                  >
                                )[term.prize]?.maxAmount || 0
                              : Number.parseFloat(term.prize) || 0;
                            const purchaseLimit = Number.parseInt(term.purchaseLimit, 10) || 0;
                            return sum + prize * purchaseLimit;
                          }, 0) * 100000000,
                      ) / 100000000;

                    const fundingToBeRaised = Number.parseFloat(watch('fundingToBeRaised') ?? '0');
                    const exceedsFunding = totalSum > fundingToBeRaised;

                    return (
                      <>
                        <div className="grid grid-cols-3 gap-4 p-4 border-t-2 border-foreground font-bold text-base bg-gray-50">
                          <div>Total</div>
                          <div />
                          <div
                            className={`justify-self-end text-right ${
                              exceedsFunding ? 'text-destructive' : 'text-primary'
                            }`}
                          >
                            {totalSum} {data?.program?.currency}
                          </div>
                        </div>
                        {exceedsFunding && (
                          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-destructive text-sm font-medium">
                              Total terms amount ({totalSum} {data?.program?.currency}) exceeds
                              funding to be raised ({fundingToBeRaised} {data?.program?.currency})
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">No terms added yet. Add terms above to see the summary.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="milestone">
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Milestone {index + 1}</h3>
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMilestoneClick(index)}
                      className="bg-secondary"
                    >
                      Delete
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor={`milestone-title-${index}`} className="text-sm font-medium">
                      Title <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id={`milestone-title-${index}`}
                      placeholder="Placeholder"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      className="mt-2 h-10"
                    />
                    {extraErrors.milestones[index] && !milestone.title && (
                      <span className="text-destructive text-sm block mt-1">Title is required</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Payout Percentage */}
                    <div>
                      <Label htmlFor={`milestone-payout-${index}`} className="text-sm font-medium">
                        Milestone Payout (% of Funding) <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id={`milestone-payout-${index}`}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={milestone.payoutPercentage}
                        onChange={(e) => updateMilestone(index, 'payoutPercentage', e.target.value)}
                        className="mt-2 h-10"
                      />
                      {extraErrors.milestones[index] &&
                        (!milestone.payoutPercentage ||
                          Number.parseFloat(milestone.payoutPercentage) < 0) && (
                          <span className="text-destructive text-sm block mt-1">
                            Payout percentage must be a positive number
                          </span>
                        )}
                    </div>

                    {/* End Date */}
                    <div>
                      <Label htmlFor={`milestone-enddate-${index}`} className="text-sm font-medium">
                        End date <span className="text-primary">*</span>
                      </Label>
                      <div className="mt-2">
                        <DatePicker
                          date={milestone.endDate}
                          setDate={(date) => {
                            if (date && typeof date === 'object' && 'getTime' in date) {
                              const newDate = new Date(date.getTime());
                              newDate.setHours(23, 59, 59, 999);
                              updateMilestone(index, 'endDate', newDate);
                            } else {
                              updateMilestone(index, 'endDate', undefined);
                            }
                          }}
                          disabled={{ before: new Date() }}
                        />
                      </div>
                      {extraErrors.milestones[index] && !milestone.endDate && (
                        <span className="text-destructive text-sm block mt-1">
                          End date is required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <Label htmlFor={`milestone-summary-${index}`} className="text-sm font-medium">
                      Summary <span className="text-primary">*</span>
                    </Label>
                    <Textarea
                      id={`milestone-summary-${index}`}
                      placeholder="Placeholder"
                      value={milestone.summary}
                      onChange={(e) => updateMilestone(index, 'summary', e.target.value)}
                      className="mt-2"
                    />
                    {extraErrors.milestones[index] && !milestone.summary && (
                      <span className="text-destructive text-sm block mt-1">
                        Summary is required
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label
                      htmlFor={`milestone-description-${index}`}
                      className="text-sm font-medium"
                    >
                      Description <span className="text-primary">*</span>
                    </Label>
                    <div className="mt-2">
                      <MarkdownEditor
                        content={milestone.description}
                        onChange={(value) => {
                          if (typeof value === 'string') {
                            updateMilestone(index, 'description', value);
                          } else if (typeof value === 'function') {
                            const newValue = value(milestone.description);
                            updateMilestone(index, 'description', newValue);
                          }
                        }}
                      />
                      {extraErrors.milestones[index] && !milestone.description && (
                        <span className="text-destructive text-sm block mt-1">
                          Description is required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add more milestones button - only show after the last milestone */}
                  {index === milestones.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMilestone}
                      className="bg-white border border-gray-300 text-gray-700 mt-2"
                    >
                      <X className="w-4 h-4 mr-2 rotate-45" />
                      Add more milestones
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="py-3 flex justify-end gap-4">
        {!isEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="lg"
                aria-label="Save draft"
                onClick={() => {
                  // Save all fields except the image into localStorage draft
                  const draft = {
                    name: watch('name') ?? '',
                    fundingToBeRaised: watch('fundingToBeRaised') ?? '',
                    description: content ?? '',
                    summary: watch('summary') ?? '',
                    links,
                    visibility,
                    builders: selectedBuilders,
                    selectedBuilderItems,
                    supporterTierConfirmed,
                    terms,
                    milestones,
                  };
                  saveProjectDraft(draft);
                  notify('Draft saved.');
                }}
              >
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white text-foreground border shadow-[0px_4px_6px_-1px_#0000001A]"
              sideOffset={8}
            >
              Save your progress as a draft.
            </TooltipContent>
          </Tooltip>
        )}

        {selectedTab === 'milestone' && (
          <Popover>
            <PopoverTrigger>
              <Button
                type="button"
                className="min-w-[97px] bg-primary hover:bg-primary/90"
                size="lg"
              >
                Save and Upload
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[440px]">
              <h2 className="text-foreground font-semibold text-center text-lg">Visibility</h2>
              <p className="text-center text-muted-foreground text-sm mb-4">
                Choose when to publish and who can see your project.
              </p>

              <RadioGroup
                defaultValue="public"
                className="space-y-2 mb-8"
                value={visibility}
                onValueChange={(v) => setVisibility(v as 'public' | 'private' | 'restricted')}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="private" id="r1" className="border-foreground" />
                  <div className="flex-1">
                    <Label htmlFor="r1" className="font-medium mb-[6px]">
                      Private
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Only invited users can view this project.
                    </p>
                    {visibility === 'private' && (
                      <MultiSelect
                        options={builderOptions ?? []}
                        value={selectedBuilders}
                        onValueChange={setSelectedBuilders}
                        placeholder="Search Builder"
                        animation={2}
                        maxCount={20}
                        inputValue={builderInput}
                        setInputValue={setBuilderInput}
                        selectedItems={selectedBuilderItems}
                        setSelectedItems={setSelectedBuilderItems}
                        emptyText="Enter builder email or organization name"
                        loading={buildersLoading}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="restricted" id="r2" className="border-foreground" />
                  <div>
                    <Label htmlFor="r2">Restricted</Label>
                    <p className="text-sm text-muted-foreground">Only users with links can view.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="public" id="r3" className="border-foreground" />
                  <div>
                    <Label htmlFor="r3">Public</Label>
                    <p className="text-sm text-muted-foreground">Anyone can view this project.</p>
                  </div>
                </div>
              </RadioGroup>

              <Button
                onClick={() => {
                  extraValidation();
                }}
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Save
              </Button>
            </PopoverContent>
          </Popover>
        )}

        {selectedTab === 'overview' && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setSelectedTab('details')}
            disabled={!isOverviewTabValid()}
          >
            Next to Details <ChevronRight />
          </Button>
        )}

        {selectedTab === 'details' && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setSelectedTab('terms')}
            disabled={!isDetailsTabValid()}
          >
            Next to Terms <ChevronRight />
          </Button>
        )}

        {selectedTab === 'terms' && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setSelectedTab('milestone')}
            disabled={!isTermsTabValid()}
          >
            Next to Milestones <ChevronRight />
          </Button>
        )}
      </div>

      {/* Confirmation Modals */}
      <Dialog open={deleteTermModalOpen} onOpenChange={setDeleteTermModalOpen}>
        <DialogContent className="text-center w-[410px]">
          <div className="flex flex-col items-center space-y-4">
            {/* Warning Icon */}
            <div className="w-[42px] h-[42px] bg-purple-100 rounded-full flex items-center justify-center">
              <TriangleAlert className="w-6 h-6 text-primary" />
            </div>

            {/* Main Question */}
            <DialogTitle className="text-xl font-bold text-gray-900">
              Are you sure you want to delete it?
            </DialogTitle>

            {/* Warning Text */}
            <DialogDescription className="text-gray-500 text-sm">
              Once deleted, it cannot be recovered.
            </DialogDescription>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 mt-3">
            <Button
              type="button"
              className="w-full bg-black hover:bg-gray-800 text-white"
              onClick={confirmDeleteTerm}
            >
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setDeleteTermModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteMilestoneModalOpen} onOpenChange={setDeleteMilestoneModalOpen}>
        <DialogContent className="text-center w-[410px]">
          <div className="flex flex-col items-center space-y-4">
            {/* Warning Icon */}
            <div className="w-[42px] h-[42px] bg-purple-100 rounded-full flex items-center justify-center">
              <TriangleAlert className="w-6 h-6 text-primary" />
            </div>

            {/* Main Question */}
            <DialogTitle className="text-xl font-bold text-gray-900">
              Are you sure you want to delete it?
            </DialogTitle>

            {/* Warning Text */}
            <DialogDescription className="text-gray-500 text-sm">
              Once deleted, it cannot be recovered.
            </DialogDescription>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 mt-3">
            <Button
              type="button"
              className="w-full bg-black hover:bg-gray-800 text-white"
              onClick={confirmDeleteMilestone}
            >
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setDeleteMilestoneModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}

export default ProjectForm;

enum ExtraErrorActionKind {
  SET_LINKS_ERROR = 'SET_LINKS_ERROR',
  CLEAR_ERRORS = 'CLEAR_ERRORS',
  SET_INVALID_LINK_ERROR = 'SET_INVALID_LINK_ERROR',
  SET_SUPPORTER_TIER_ERROR = 'SET_SUPPORTER_TIER_ERROR',
  SET_DESCRIPTION_ERROR = 'SET_DESCRIPTION_ERROR',
  SET_TERMS_ERROR = 'SET_TERMS_ERROR',
  SET_MILESTONES_ERROR = 'SET_MILESTONES_ERROR',
}

interface ExtraErrorAction {
  type: ExtraErrorActionKind;
  payload?: boolean[];
}

interface ExtraErrorState {
  links: boolean;
  invalidLink: boolean;
  supporterTier: boolean;
  description: boolean;
  terms: boolean[];
  milestones: boolean[];
}

function extraErrorReducer(state: ExtraErrorState, action: ExtraErrorAction) {
  const { type } = action;
  switch (type) {
    case ExtraErrorActionKind.SET_LINKS_ERROR:
      return {
        ...state,
        links: true,
      };
    case ExtraErrorActionKind.SET_INVALID_LINK_ERROR:
      return {
        ...state,
        invalidLink: true,
      };
    case ExtraErrorActionKind.SET_SUPPORTER_TIER_ERROR:
      return {
        ...state,
        supporterTier: true,
      };
    case ExtraErrorActionKind.SET_DESCRIPTION_ERROR:
      return {
        ...state,
        description: true,
      };
    case ExtraErrorActionKind.SET_TERMS_ERROR:
      return {
        ...state,
        terms: action.payload || [],
      };
    case ExtraErrorActionKind.SET_MILESTONES_ERROR:
      return {
        ...state,
        milestones: action.payload || [],
      };
    case ExtraErrorActionKind.CLEAR_ERRORS:
      return {
        links: false,
        invalidLink: false,
        supporterTier: false,
        description: false,
        terms: [],
        milestones: [],
      };
    default:
      return state;
  }
}
