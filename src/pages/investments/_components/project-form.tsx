import { useCreateCarouselItemMutation } from '@/apollo/mutation/create-carousel-item.generated';
import { useCarouselItemsQuery } from '@/apollo/queries/carousel-items.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getCurrency, mainnetDefaultNetwork } from '@/lib/utils';
import { CarouselItemType, type LinkInput } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronRight, X } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

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
  currency: string;
  deadline?: string;
  links: LinkInput[];
  // isPublish?: boolean;
  network: string;
  image?: File;
  visibility: 'public' | 'restricted' | 'private';
  builders?: string[];
  milestones?: Milestone[];
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
  const [deadline, setDeadline] = useState<Date>();
  const [links, setLinks] = useState<string[]>(['']);
  const [network, setNetwork] = useState(mainnetDefaultNetwork);
  const [currency, setCurrency] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'restricted' | 'private'>('public');
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<
    { label: string; value: string }[]
  >([]);
  const [builderInput, setBuilderInput] = useState<string>();
  const [debouncedBuilderInput, setDebouncedBuilderInput] = useState<string>();

  // Supporter tier state
  const [supporterTierConfirmed, setSupporterTierConfirmed] = useState<boolean>(false);

  // Terms state
  interface Term {
    id: number;
    title: string;
    prize: string;
    purchaseLimit: string;
    description: string;
  }

  const [nextTermId, setNextTermId] = useState<number>(2); // Start from 2 since Term 1 has id 1

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
      payoutPercentage: '0',
      endDate: undefined,
      summary: '',
      description: '',
    },
  ]);

  const [extraErrors, dispatchErrors] = useReducer(extraErrorReducer, {
    deadline: false,
    links: false,
    invalidLink: false,
  });

  useEffect(() => {
    if (data?.program?.deadline) setDeadline(new Date(data?.program?.deadline));
    if (data?.program?.links) setLinks(data?.program?.links.map((l) => l.url ?? ''));
    if (data?.program?.description) setContent(data?.program.description);
    if (data?.program?.network) setNetwork(data?.program?.network);
    if (data?.program?.currency) setCurrency(data?.program?.currency);
  }, [data]);

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
  } = useForm({
    values: {
      name: data?.program?.name ?? '',
      fundingToBeRaised: data?.program?.price ?? '',
      summary: data?.program?.summary ?? '',
    },
  });

  const onSubmit = (submitData: {
    name: string;
    fundingToBeRaised: string;
    summary: string;
  }) => {
    if (
      extraErrors.deadline ||
      extraErrors.links ||
      extraErrors.invalidLink ||
      !content.length ||
      !supporterTierConfirmed
    )
      return;

    onSubmitProject({
      id: data?.program?.id ?? id,
      name: submitData.name,
      fundingToBeRaised:
        isEdit && data?.program?.status !== 'draft' ? undefined : submitData.fundingToBeRaised,
      description: content,
      summary: submitData.summary,
      currency:
        isEdit && data?.program?.status !== 'draft'
          ? (data?.program?.currency as string)
          : currency,
      deadline: deadline ? format(deadline, 'yyyy-MM-dd') : undefined,
      links: links.map((l) => ({ title: l, url: l })),
      network:
        isEdit && data?.program?.status !== 'draft' ? (data?.program?.network as string) : network,
      visibility: visibility,
      builders: selectedBuilders,
    });
  };

  const extraValidation = () => {
    dispatchErrors({ type: ExtraErrorActionKind.CLEAR_ERRORS });
    if (!deadline) dispatchErrors({ type: ExtraErrorActionKind.SET_DEADLINE_ERROR });
    if (!links?.[0]) dispatchErrors({ type: ExtraErrorActionKind.SET_LINKS_ERROR });
    if (links?.some((l) => !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(l))) {
      dispatchErrors({ type: ExtraErrorActionKind.SET_INVALID_LINK_ERROR });
    }

    formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const { data: carouselItems, refetch } = useCarouselItemsQuery();

  const [createCarouselItem] = useCreateCarouselItemMutation();

  const formRef = useRef<HTMLFormElement>(null);

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
    setNextTermId((prev) => prev + 1);
  };

  const removeTerm = (index: number) => {
    if (index === 0) return; // Term 1 cannot be deleted
    setTerms((prevTerms) => prevTerms.filter((_, i) => i !== index));
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
        payoutPercentage: '0',
        endDate: undefined,
        summary: '',
        description: '',
      },
    ]);
    setNextMilestoneId((prev) => prev + 1);
  };

  const removeMilestone = (index: number) => {
    if (index === 0) return; // Milestone 1 cannot be deleted
    setMilestones((prevMilestones) => prevMilestones.filter((_, i) => i !== index));
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
                  <span>{getCurrency(data?.program?.network)?.icon}</span>{' '}
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
                placeholder="Enter price"
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
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <p className="text-sm font-medium text-gray-700">Program Tier Condition</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFDEA1] text-[#CA8A04] px-2 py-0.5 rounded-full text-sm font-semibold">
                      Gold
                    </span>
                    <span className="font-bold text-black">or higher</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className="text-sm text-gray-600">Gold 10,000</div>
                  <div className="text-sm text-gray-600">Platinum 20,000</div>
                </div>
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
            </label>
          </div>

          <div className="px-10 py-6 bg-white rounded-lg">
            <label htmlFor="links" className="space-y-2 block mb-10">
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
            <label htmlFor="summary" className="space-y-2 block mb-10">
              <p className="text-sm font-medium">Summary</p>
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
            <label htmlFor="description" className="space-y-2 block mb-10">
              <p className="text-sm font-medium">Description</p>

              <MarkdownEditor onChange={setContent} content={content} />
              {!content.length && (
                <span className="text-destructive text-sm block">Description is required</span>
              )}
            </label>
          </div>
        </TabsContent>

        <TabsContent value="terms">
          <div className="space-y-4">
            {terms.map((term, index) => (
              <div key={term.id} className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Term {index + 1}</h3>
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTerm(index)}
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
                  </div>

                  {/* Prize and Purchase Limit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`prize-${index}`} className="text-sm font-medium">
                        Prize <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id={`prize-${index}`}
                        type="number"
                        placeholder="Input number"
                        value={term.prize}
                        onChange={(e) => updateTerm(index, 'prize', e.target.value)}
                        className="mt-2 h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`purchaseLimit-${index}`} className="text-sm font-medium">
                        Purchase limit <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id={`purchaseLimit-${index}`}
                        type="number"
                        placeholder="Input number"
                        value={term.purchaseLimit}
                        onChange={(e) => updateTerm(index, 'purchaseLimit', e.target.value)}
                        className="mt-2 h-10"
                      />
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
                    </div>
                  </div>

                  {/* Add more terms button - only show after the last term */}
                  {index === terms.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTerm}
                      className="bg-white border border-gray-300 text-gray-700 mt-6"
                    >
                      <X className="w-4 h-4 mr-2 rotate-45" />
                      Add more terms
                    </Button>
                  )}
                </div>
              </div>
            ))}
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
                      onClick={() => removeMilestone(index)}
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
                        placeholder="0"
                        value={milestone.payoutPercentage}
                        onChange={(e) => updateMilestone(index, 'payoutPercentage', e.target.value)}
                        className="mt-2 h-10"
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <Label htmlFor={`milestone-enddate-${index}`} className="text-sm font-medium">
                        End date <span className="text-primary">*</span>
                      </Label>
                      <div className="mt-2">
                        <DatePicker
                          date={milestone.endDate}
                          setDate={(date) => updateMilestone(index, 'endDate', date as Date)}
                          disabled={{ before: new Date() }}
                        />
                      </div>
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
                    <p className="text-xs text-gray-500 mt-1">This is a textarea description.</p>
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
                    </div>
                  </div>

                  {/* Add more milestones button - only show after the last milestone */}
                  {index === milestones.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMilestone}
                      className="bg-white border border-gray-300 text-gray-700 mt-6"
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

      {isEdit && (
        <Button
          type="button"
          onClick={() => {
            createCarouselItem({
              variables: {
                input: {
                  itemId: data?.program?.id ?? '',
                  itemType: CarouselItemType.Program,
                  isActive: true,
                },
              },
            }).then(() => refetch());
          }}
          disabled={carouselItems?.carouselItems?.some(
            (item) =>
              item.itemId === data?.program?.id || (carouselItems?.carouselItems?.length ?? 0) >= 5,
          )}
        >
          {carouselItems?.carouselItems?.some((item) => item.itemId === data?.program?.id)
            ? 'Already in Carousel'
            : 'Add to Main Carousel'}
        </Button>
      )}

      {isEdit ? (
        <div className="py-3 flex justify-end gap-4">
          <Button
            className="bg-primary hover:bg-primary/90 min-w-[177px]"
            type="submit"
            onClick={() => {
              extraValidation();
            }}
          >
            Edit Program
          </Button>
        </div>
      ) : (
        <div className="py-3 flex justify-end gap-4">
          <Popover>
            <PopoverTrigger>
              <Button type="button" className="min-w-[97px]" size="lg">
                Save
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[440px]">
              <h2 className="text-foreground font-semibold text-center text-lg">Visibility</h2>
              <p className="text-center text-muted-foreground text-sm mb-4">
                Choose when to publish and who can see your program.
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
                      Only invited users can view this program.
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
                    <p className="text-sm text-muted-foreground">Anyone can view this program.</p>
                  </div>
                </div>
              </RadioGroup>

              <Button
                onClick={() => {
                  console.log('onCLICK!!!!');
                  extraValidation();
                }}
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Save
              </Button>
            </PopoverContent>
          </Popover>

          {selectedTab === 'overview' && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => setSelectedTab('details')}
            >
              Next to Details <ChevronRight />
            </Button>
          )}
        </div>
      )}
    </form>
  );
}

export default ProjectForm;

enum ExtraErrorActionKind {
  SET_DEADLINE_ERROR = 'SET_DEADLINE_ERROR',
  SET_LINKS_ERROR = 'SET_LINKS_ERROR',
  CLEAR_ERRORS = 'CLEAR_ERRORS',
  SET_INVALID_LINK_ERROR = 'SET_INVALID_LINK_ERROR',
}

interface ExtraErrorAction {
  type: ExtraErrorActionKind;
}

interface ExtraErrorState {
  deadline: boolean;
  links: boolean;
  invalidLink: boolean;
}

function extraErrorReducer(state: ExtraErrorState, action: ExtraErrorAction) {
  const { type } = action;
  switch (type) {
    case ExtraErrorActionKind.SET_DEADLINE_ERROR:
      return {
        ...state,
        deadline: true,
      };
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
    case ExtraErrorActionKind.CLEAR_ERRORS:
      return {
        deadline: false,
        links: false,
        invalidLink: false,
      };
    default:
      return state;
  }
}
