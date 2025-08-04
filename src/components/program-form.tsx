import { useCreateCarouselItemMutation } from '@/apollo/mutation/create-carousel-item.generated';
import { useCarouselItemsQuery } from '@/apollo/queries/carousel-items.generated';

import { useProgramQuery } from '@/apollo/queries/program.generated';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import CurrencySelector from '@/components/currency-selector';
import { MarkdownEditor } from '@/components/markdown';
import NetworkSelector from '@/components/network-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { mainnetDefaultNetwork } from '@/lib/utils';
import { filterEmptyLinks, validateLinks } from '@/lib/validation';
import { CarouselItemType, type LinkInput } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronRight, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

export type OnSubmitProgramFunc = (data: {
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

export interface ProgramFormProps {
  isEdit: boolean;
  onSubmitProgram: OnSubmitProgramFunc;
}

function ProgramForm({ onSubmitProgram, isEdit }: ProgramFormProps) {
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
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState<string>('');
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

  // Removed keywords query as it's no longer needed with the new input approach

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

  // Removed keywordOptions as it's no longer needed with the new input approach
  const validatorOptions = validators?.users?.data?.map((v) => ({
    value: v.id ?? '',
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ''}`,
  }));

  useEffect(() => {
    if (data?.program?.keywords)
      setSelectedKeywords(data?.program?.keywords?.map((k) => k.name ?? '') ?? []);
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
    watch,
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
    console.log('IM HERE!!!!!!!!!!!!!');
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

    onSubmitProgram({
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
      links: (() => {
        const { shouldSend } = validateLinks(links);
        return shouldSend ? filterEmptyLinks(links).map((l) => ({ title: l, url: l })) : [];
      })(),
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

    const { isValid } = validateLinks(links);
    if (!isValid) {
      dispatchErrors({ type: ExtraErrorActionKind.SET_INVALID_LINK_ERROR });
    }

    formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const { data: carouselItems, refetch } = useCarouselItemsQuery();

  const [createCarouselItem] = useCreateCarouselItemMutation();

  // Removed selectedKeywordItems as it's no longer needed with the new input approach
  const [selectedValidatorItems, setSelectedValidatorItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const formRef = useRef<HTMLFormElement>(null);

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

  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && keywordInput.trim()) {
      e.preventDefault();
      const newKeyword = keywordInput.trim();
      if (newKeyword && !selectedKeywords.includes(newKeyword)) {
        setSelectedKeywords([...selectedKeywords, newKeyword]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setSelectedKeywords(selectedKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="max-w-[820px] w-full mx-auto">
      {/* <h1 className="font-medium text-xl mb-6">Program</h1> */}
      <h1 className="font-medium text-xl mb-6">{isEdit ? 'Edit Program' : 'Create Program'}</h1>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full px-0 mb-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="bg-white py-6 px-10 rounded-lg mb-3">
            <label htmlFor="programName" className="space-y-2 block mb-10">
              <p className="text-sm font-medium">
                Program title <span className="text-primary">*</span>
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
              <div className="space-y-3">
                <Input
                  id="keyword"
                  type="text"
                  placeholder="직접입력"
                  value={keywordInput}
                  onChange={handleKeywordInputChange}
                  onKeyDown={handleKeywordInputKeyDown}
                  className="h-10"
                />
                {selectedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedKeywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="bg-[#F4F4F5] text-[#18181B] border-0 px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="Remove keyword"
                          >
                            <title>Remove keyword</title>
                            <path
                              d="M9 3L3 9M3 3L9 9"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
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

          <div className="bg-white px-10 pt-6 pb-[32px] rounded-lg mb-3">
            <label htmlFor="price" className="space-y-2 block mb-10">
              <div className="flex gap-2 items-end">
                <div className="w-1/2">
                  <p className="text-sm font-medium mb-2">
                    Network <span className="text-primary">*</span>
                  </p>
                  <NetworkSelector
                    disabled={isEdit && data?.program?.status !== 'draft'}
                    value={network}
                    onValueChange={setNetwork}
                    className="min-w-[120px] h-10 w-full flex justify-between bg-white text-gray-dark border border-input hover:bg-white"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">
                    Price <span className="text-primary">*</span>
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

            <label htmlFor="deadline" className="space-y-2 block mb-10">
              <p className="text-sm font-medium">
                Deadline <span className="text-primary">*</span>
              </p>
              <DatePicker date={deadline} setDate={setDeadline} disabled={{ before: new Date() }} />
              {extraErrors.deadline && (
                <span className="text-destructive text-sm block">Deadline is required</span>
              )}
            </label>

            <label htmlFor="validator" className="space-y-2 block">
              <p className="text-sm font-medium">
                Validator <span className="text-primary">*</span>
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
                placeholder="Select validator"
                animation={2}
                maxCount={20}
                inputValue={validatorInput}
                setInputValue={setValidatorInput}
                selectedItems={selectedValidatorItems}
                setSelectedItems={setSelectedValidatorItems}
                emptyText="Enter validator email or organization name"
                loading={loading}
                singleSelect={true} // TODO: remove this when multi validator flow is implemented
              />
              {extraErrors.validator && (
                <span className="text-destructive text-sm block">Validator is required</span>
              )}
              {/* <span className="block text-muted-foreground text-sm">
                You can invite up to 5 validators.
              </span> */}
            </label>
          </div>

          <div className="px-10 pt-6 pb-[32px] bg-white rounded-lg">
            <label htmlFor="links" className="space-y-2 block">
              <p className="text-sm font-medium">Links</p>
              <span className="block text-gray-text text-sm">
                Add links to your website, blog, or social media profiles.
              </span>

              {links.map((l, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    className="h-10"
                    placeholder='https://example.com/ludium'
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
              <p className="text-sm font-medium">Summary <span className="text-primary">*</span></p>
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
              <p className="text-sm font-medium">Description <span className="text-primary">*</span></p>

              <MarkdownEditor onChange={setContent} content={content} />
              {!content.length && (
                <span className="text-destructive text-sm block">Description is required</span>
              )}
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
          <Button type="button" size="lg" onClick={() => {
            onSubmitProgram({
              id: data?.program?.id ?? id,
              programName: watch('programName'),
              price: isEdit && data?.program?.status !== 'draft' ? undefined : watch('price'),
              description: content,
              summary: watch('summary'),
              currency:
                isEdit && data?.program?.status !== 'draft'
                  ? (data?.program?.currency as string)
                  : currency,
              deadline: deadline ? format(deadline, 'yyyy-MM-dd') : undefined,
              keywords: selectedKeywords,
              validators: selectedValidators ?? '',
              links: (() => {
                const { shouldSend } = validateLinks(links);
                return shouldSend ? filterEmptyLinks(links).map((l) => ({ title: l, url: l })) : [];
              })(),
              network:
                isEdit && data?.program?.status !== 'draft' ? (data?.program?.network as string) : network,
              image: selectedImage,
              visibility: visibility,
              builders: selectedBuilders,

            });
          }}>Save</Button>

          {selectedTab === 'details' && <Popover>
            <PopoverTrigger>
              <Button type="button" className="min-w-[97px] bg-primary hover:bg-primary/90" size="lg">
                Save and Upload
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
          </Popover>}

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

export default ProgramForm;

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
