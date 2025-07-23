import { useCreateCarouselItemMutation } from '@/apollo/mutation/create-carousel-item.generated';
import { useCarouselItemsQuery } from '@/apollo/queries/carousel-items.generated';
import { useKeywordsQuery } from '@/apollo/queries/keywords.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import CurrencySelector from '@/components/currency-selector';
import { MarkdownEditor } from '@/components/markdown';
import NetworkSelector from '@/components/network-selector';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn, mainnetDefaultNetwork } from '@/lib/utils';
import { CarouselItemType, type LinkInput } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronRight, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

export type OnSubmitInvestmentFunc = (data: {
  id?: string;
  programName: string;
  price?: string;
  description: string;
  summary: string;
  currency: string;
  deadline?: string;
  keywords: string[];
  // validatorId: string;
  links: LinkInput[];
  // isPublish?: boolean;
  network: string;
  validators: string[];
  image?: File;
  visibility: 'public' | 'restricted' | 'private';
  builders?: string[];
}) => void;

export interface InvestmentFormProps {
  isEdit: boolean;
  onSubmitInvestment: OnSubmitInvestmentFunc;
}

function InvestmentForm({ onSubmitInvestment, isEdit }: InvestmentFormProps) {
  const { id } = useParams();

  const { data } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
    skip: !isEdit,
  });

  const [selectedTab, setSelectedTab] = useState<string>('overview');

  const [content, setContent] = useState<string>('');
  const [deadline, setDeadline] = useState<Date>();
  const [applicationStartDate, setApplicationStartDate] = useState<Date>();
  const [applicationDueDate, setApplicationDueDate] = useState<Date>();
  const [fundingStartDate, setFundingStartDate] = useState<Date>();
  const [fundingDueDate, setFundingDueDate] = useState<Date>();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>(['']);
  const [network, setNetwork] = useState(mainnetDefaultNetwork);
  const [currency, setCurrency] = useState('');
  const [selectedImage, setSelectedImage] = useState<File>();
  const [visibility, setVisibility] = useState<'public' | 'restricted' | 'private'>('public');
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<
    { label: string; value: string }[]
  >([]);
  const [builderInput, setBuilderInput] = useState<string>();
  const [debouncedBuilderInput, setDebouncedBuilderInput] = useState<string>();

  // Condition tab state
  const [conditionType, setConditionType] = useState<'open' | 'tier'>('open');
  const [tiers, setTiers] = useState([
    { name: 'Bronze', enabled: false, maxAmount: '0' },
    { name: 'Silver', enabled: false, maxAmount: '0' },
    { name: 'Gold', enabled: false, maxAmount: '0' },
    { name: 'Platinum', enabled: false, maxAmount: '0' },
  ]);
  const [feeType, setFeeType] = useState<'default' | 'custom'>('default');
  const [customFee, setCustomFee] = useState<string>('0');

  const { data: keywords } = useKeywordsQuery();

  const [validatorInput, setValidatorInput] = useState<string>();
  const [debouncedValidatorInput, setDebouncedValidatorInput] = useState<string>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValidatorInput(validatorInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [validatorInput]);

  const { data: validators, loading } = useUsersQuery({
    variables: {
      input: {
        limit: 5,
        offset: 0,
        filter: [
          {
            field: 'search',
            value: debouncedValidatorInput ?? '',
          },
        ],
      },
    },
    skip: !validatorInput,
  });
  const [extraErrors, dispatchErrors] = useReducer(extraErrorReducer, {
    keyword: false,
    deadline: false,
    validator: false,
    links: false,
    invalidLink: false,
  });

  const keywordOptions = keywords?.keywords?.map((k) => ({
    value: k.id ?? '',
    label: k.name ?? '',
  }));
  const validatorOptions = validators?.users?.data?.map((v) => ({
    value: v.id ?? '',
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ''}`,
  }));

  useEffect(() => {
    if (data?.program?.keywords)
      setSelectedKeywords(data?.program?.keywords?.map((k) => k.id ?? '') ?? []);
    if (data?.program?.validators)
      setSelectedValidators(data?.program.validators?.map((k) => k.id ?? '') ?? '');
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
      programName: data?.program?.name ?? '',
      price: data?.program?.price ?? '',
      summary: data?.program?.summary ?? '',
    },
  });

  const onSubmit = (submitData: {
    programName: string;
    price: string;
    summary: string;
  }) => {
    if (
      imageError ||
      extraErrors.deadline ||
      extraErrors.keyword ||
      extraErrors.links ||
      extraErrors.validator ||
      extraErrors.invalidLink ||
      !content.length ||
      !selectedImage
    )
      return;

    onSubmitInvestment({
      id: data?.program?.id ?? id,
      programName: submitData.programName,
      price: isEdit && data?.program?.status !== 'draft' ? undefined : submitData.price,
      description: content,
      summary: submitData.summary,
      currency:
        isEdit && data?.program?.status !== 'draft'
          ? (data?.program?.currency as string)
          : currency,
      deadline: deadline ? format(deadline, 'yyyy-MM-dd') : undefined,
      keywords: selectedKeywords,
      validators: selectedValidators ?? '',
      links: links.map((l) => ({ title: l, url: l })),
      network:
        isEdit && data?.program?.status !== 'draft' ? (data?.program?.network as string) : network,
      image: selectedImage,
      visibility: visibility,
      builders: selectedBuilders,
    });
  };

  const extraValidation = () => {
    dispatchErrors({ type: ExtraErrorActionKind.CLEAR_ERRORS });
    if (!selectedImage) setImageError('Picture is required.');
    if (!selectedKeywords?.length)
      dispatchErrors({ type: ExtraErrorActionKind.SET_KEYWORDS_ERROR });
    if (!selectedValidators?.length)
      dispatchErrors({ type: ExtraErrorActionKind.SET_VALIDATOR_ERROR });
    if (!deadline) dispatchErrors({ type: ExtraErrorActionKind.SET_DEADLINE_ERROR });
    if (!links?.[0]) dispatchErrors({ type: ExtraErrorActionKind.SET_LINKS_ERROR });
    if (links?.some((l) => !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(l))) {
      dispatchErrors({ type: ExtraErrorActionKind.SET_INVALID_LINK_ERROR });
    }

    formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const { data: carouselItems, refetch } = useCarouselItemsQuery();

  const [createCarouselItem] = useCreateCarouselItemMutation();

  const [selectedKeywordItems, setSelectedKeywordItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [selectedValidatorItems, setSelectedValidatorItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const formRef = useRef<HTMLFormElement>(null);

  // Tier handlers
  const handleTierChange = (tierName: string, enabled: boolean) => {
    setTiers(prev => prev.map(tier =>
      tier.name === tierName ? { ...tier, enabled } : tier
    ));
  };

  const handleTierAmountChange = (tierName: string, amount: string) => {
    setTiers(prev => prev.map(tier =>
      tier.name === tierName ? { ...tier, maxAmount: amount } : tier
    ));
  };

  // image input handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setImageError('Only PNG, JPG, or JPEG files are allowed.');
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }
    // Validate size
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image must be under 2MB.');
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }
    // Validate square
    const img = new window.Image();
    img.onload = () => {
      if (img.width !== img.height) {
        setImageError('Image must be square (1:1).');
        setSelectedImage(undefined);
        setImagePreview(null);
      } else {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
    img.onerror = () => {
      setImageError('Invalid image file.');
      setSelectedImage(undefined);
      setImagePreview(null);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="max-w-[820px] w-full mx-auto">
      <h1 className="font-medium text-xl mb-6">Program</h1>
      {/* <h1 className="font-medium text-xl mb-6">{isEdit ? 'Edit Program' : 'Create Program'}</h1> */}

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full px-0 mb-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="condition">Condition</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="bg-white py-6 px-10 rounded-lg mb-3">
            <label htmlFor="programName" className="space-y-2 block mb-10">
              <p className="text-sm font-medium">
                Program name <span className="text-primary">*</span>
              </p>
              <Input
                id="programName"
                type="text"
                placeholder="Type name"
                className="h-10"
                {...register('programName', { required: true })}
              />
              {errors.programName && (
                <span className="text-destructive text-sm block">Program name is required</span>
              )}
            </label>

            <label htmlFor="keyword" className="space-y-2 block">
              <p className="text-sm font-medium">
                Keywords <span className="text-primary">*</span>
              </p>
              <MultiSelect
                options={keywordOptions ?? []}
                value={selectedKeywords}
                onValueChange={setSelectedKeywords}
                placeholder="Select keywords"
                animation={2}
                selectedItems={selectedKeywordItems}
                setSelectedItems={setSelectedKeywordItems}
                maxCount={20}
              />
              {extraErrors.keyword && (
                <span className="text-destructive text-sm block">Keywords is required</span>
              )}
            </label>

            <label htmlFor="image" className="space-y-2 block mt-10">
              <div className="flex items-start gap-6">
                {/* Image input with preview/placeholder */}
                <div className="relative w-[200px] h-[200px] flex items-center justify-center bg-[#eaeaea] rounded-lg overflow-hidden group">
                  <input
                    id="picture"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <ImageIcon className="w-10 h-10 text-[#666666] mb-2" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-black/80 rounded-md w-10 h-10 flex justify-center items-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* Text info */}
                <div className="flex-1">
                  <p className="font-medium text-base">
                    Cover image <span className="text-primary">*</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Logo image must be square, under 2MB, and in PNG, JPG, or JPEG format.
                    <br />
                    This image is used in the program list
                  </p>
                  {imageError && (
                    <span className="text-destructive text-sm block mt-28">{imageError}</span>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div className="bg-white px-10 py-6 rounded-lg mb-3">
            <label htmlFor="applicationDate" className="space-y-2 block mb-10">
              <p className="text-sm font-medium text-muted-foreground">
                Application date
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Start Date <span className="text-primary">*</span></p>
                  <div className="flex-1">
                    <DatePicker
                      date={applicationStartDate}
                      setDate={setApplicationStartDate}
                      disabled={{ before: new Date() }}
                    />
                  </div>
                </div>
                <div className="w-3 h-px bg-muted-foreground self-end mb-5" />

                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Due Date <span className="text-primary">*</span></p>
                  <div className="flex-1">
                    <DatePicker
                      date={applicationDueDate}
                      setDate={setApplicationDueDate}
                      disabled={{
                        before: applicationStartDate ? applicationStartDate : new Date()
                      }}
                    />
                  </div>

                </div>
              </div>
            </label>

            <label htmlFor="fundingDate" className="space-y-2 block mb-10">
              <p className="text-sm font-medium text-muted-foreground">
                Funding date
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Start Date <span className="text-primary">*</span></p>
                  <div className="flex-1">
                    <DatePicker
                      date={fundingStartDate}
                      setDate={setFundingStartDate}
                      disabled={{ before: new Date() }}
                    />
                  </div>
                </div>
                <div className="w-3 h-px bg-muted-foreground self-end mb-5" />

                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Due Date <span className="text-primary">*</span></p>
                  <div className="flex-1">
                    <DatePicker
                      date={fundingDueDate}
                      setDate={setFundingDueDate}
                      disabled={{
                        before: fundingStartDate ? fundingStartDate : new Date()
                      }}
                    />
                  </div>
                </div>
              </div>
            </label>

            <label htmlFor="validator" className="space-y-2 block mb-10">
              <p className="text-sm font-medium">
                Validators <span className="text-primary">*</span>
              </p>
              {/* <SearchSelect
                options={validatorOptions ?? []}
                value={selectedValidator}
                setValue={setSelectedValidator}
                inputValue={validatorInput}
                setInputValue={setValidatorInput}
                emptyText="Enter validator email or organization name"
                loading={loading}
              /> */}
              <MultiSelect
                options={validatorOptions ?? []}
                value={selectedValidators}
                onValueChange={setSelectedValidators}
                placeholder="Select validators"
                animation={2}
                maxCount={20}
                inputValue={validatorInput}
                setInputValue={setValidatorInput}
                selectedItems={selectedValidatorItems}
                setSelectedItems={setSelectedValidatorItems}
                emptyText="Enter validator email or organization name"
                loading={loading}
              />
              {extraErrors.validator && (
                <span className="text-destructive text-sm block">Validator is required</span>
              )}
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

        <TabsContent value="condition">
          <div className="bg-white px-10 py-8 rounded-lg mb-3">
            <label htmlFor="price" className="space-y-2 block">
              <p className="text-sm font-medium text-muted-foreground">Maximum funding amount for the project</p>
              <div className="flex gap-2 items-end">
                <div className="w-1/2">
                  <p className="text-sm font-medium mb-2">
                    Network <span className="text-primary">*</span>
                  </p>
                  <NetworkSelector
                    disabled={isEdit && data?.program?.status !== 'draft'}
                    value={network}
                    onValueChange={setNetwork}
                    className="min-w-[120px] h-10 w-full flex justify-between bg-white text-gray-dark border border-input shadow-sm hover:bg-white"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">
                    Terms <span className="text-primary">*</span>
                  </p>
                  <Input
                    disabled={isEdit && data?.program?.status !== 'draft'}
                    step={0.000000000000000001}
                    id="price"
                    type="number"
                    min={0}
                    placeholder="Enter price"
                    className="h-10 w-full"
                    {...register('price', { required: true })}
                  />
                </div>
                <CurrencySelector
                  disabled={isEdit && data?.program?.status !== 'draft'}
                  value={currency}
                  onValueChange={setCurrency}
                  network={network}
                  className="w-[108px] h-10"
                />
              </div>

              {errors.price && (
                <span className="text-destructive text-sm block">Price is required</span>
              )}
              {isEdit && data?.program?.status !== 'draft' && (
                <span className="text-destructive text-sm block">
                  Price can't be updated after publishing.
                </span>
              )}
            </label>
          </div>

          <div className="bg-white px-10 py-6 rounded-lg mb-3">
            <label htmlFor="condition" className="space-y-2 block mb-10">
              <p className="text-sm font-medium text-muted-foreground mb-8">Setting up condition <span className="text-primary">*</span></p>
              <RadioGroup
                defaultValue="open"
                className="space-y-4"
                value={conditionType}
                onValueChange={(value) => setConditionType(value as 'open' | 'tier')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="open" id="open" />
                  <Label htmlFor="open">Open</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tier" id="tier" />
                  <Label htmlFor="tier">Revealed by tier</Label>
                </div>
              </RadioGroup>

              <div className="space-y-4 mt-4 ml-4">
                {tiers.map((tier) => (
                  <div key={tier.name} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id={tier.name}
                      checked={tier.enabled}
                      onChange={(e) => handleTierChange(tier.name, e.target.checked)}
                      disabled={conditionType !== 'tier'}
                      className="rounded w-4 h-4 mt-1"
                    />
                    <div>
                      <Label
                        htmlFor={tier.name}
                        className={cn("flex-1", conditionType !== 'tier' && "text-muted-foreground")}
                      >
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          tier.name === 'Bronze' && "bg-amber-100 text-amber-800",
                          tier.name === 'Silver' && "bg-slate-100 text-slate-800",
                          tier.name === 'Gold' && "bg-orange-100 text-orange-800",
                          tier.name === 'Platinum' && "bg-emerald-100 text-emerald-800"
                        )}>
                          {tier.name}
                        </span> can invest
                      </Label>
                      <div className="flex items-center gap-4">
                        <span className={cn("text-sm mb-1", conditionType !== 'tier' || !tier.enabled ? "text-muted-foreground" : "text-foreground")}>Maximum amount</span>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          value={tier.maxAmount}
                          onChange={(e) => handleTierAmountChange(tier.name, e.target.value)}
                          disabled={conditionType !== 'tier' || !tier.enabled}
                          className="w-[296px] h-8"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </label>
          </div>

          <div className="bg-white px-10 py-6 rounded-lg">
            <label htmlFor="fee" className="space-y-2 block mb-10">
              <p className="text-sm font-medium text-muted-foreground mb-8">Fee settings *</p>
              <RadioGroup
                defaultValue="default"
                className="space-y-4"
                value={feeType}
                onValueChange={(value) => setFeeType(value as 'default' | 'custom')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default">Default fee (3%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Enter directly</Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-2 mt-4 ml-6">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  placeholder="0"
                  value={customFee}
                  onChange={(e) => setCustomFee(e.target.value)}
                  disabled={feeType !== 'custom'}
                  className="w-32 h-8"
                />
                <span className={cn("text-sm", feeType !== 'custom' && "text-muted-foreground")}>%</span>
              </div>
            </label>
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

export default InvestmentForm;

enum ExtraErrorActionKind {
  SET_KEYWORDS_ERROR = 'SET_KEYWORDS_ERROR',
  SET_VALIDATOR_ERROR = 'SET_VALIDATOR_ERROR',
  SET_DEADLINE_ERROR = 'SET_DEADLINE_ERROR',
  SET_LINKS_ERROR = 'SET_LINKS_ERROR',
  CLEAR_ERRORS = 'CLEAR_ERRORS',
  SET_INVALID_LINK_ERROR = 'SET_INVALID_LINK_ERROR',
}

interface ExtraErrorAction {
  type: ExtraErrorActionKind;
}

interface ExtraErrorState {
  keyword: boolean;
  validator: boolean;
  deadline: boolean;
  links: boolean;
  invalidLink: boolean;
}

function extraErrorReducer(state: ExtraErrorState, action: ExtraErrorAction) {
  const { type } = action;
  switch (type) {
    case ExtraErrorActionKind.SET_KEYWORDS_ERROR:
      return {
        ...state,
        keyword: true,
      };
    case ExtraErrorActionKind.SET_DEADLINE_ERROR:
      return {
        ...state,
        deadline: true,
      };
    case ExtraErrorActionKind.SET_VALIDATOR_ERROR:
      return {
        ...state,
        validator: true,
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
        keyword: false,
        validator: false,
        deadline: false,
        links: false,
        invalidLink: false,
      };
    default:
      return state;
  }
}
