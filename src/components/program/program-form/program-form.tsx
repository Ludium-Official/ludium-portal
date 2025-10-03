import { useProgramQuery } from '@/apollo/queries/program.generated';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useProgramDraft } from '@/lib/hooks/use-program-draft';
import notify from '@/lib/notify';
import { mainnetDefaultNetwork } from '@/lib/utils';
import { validateLinks } from '@/lib/validation';
import type { RecruitmentFormProps } from '@/types/recruitment';
import { ChevronRight } from 'lucide-react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import ProgramOverview from './program-overview';
import { LabelValueProps } from '@/types/common';

// TODO: 지워야 함 -> 다 옮기면 ProgramFormData 타입으로 변경할 것
export type FormValues = {
  programName: string;
  price: string;
  summary: string;
  keywords: string[];
  image?: File;
};

function ProgramForm({ onSubmitProgram, isEdit = false, createLoading }: RecruitmentFormProps) {
  const { id } = useParams();

  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [content, setContent] = useState<string>('');
  const [deadline, setDeadline] = useState<Date>();
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [selectedValidatorItems, setSelectedValidatorItems] = useState<LabelValueProps[]>([]);
  const [links, setLinks] = useState<string[]>(['']);
  const [network, setNetwork] = useState(isEdit ? undefined : mainnetDefaultNetwork);
  const [currency, setCurrency] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'restricted' | 'private'>('public');
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<
    { label: string; value: string }[]
  >([]);
  const [builderInput, setBuilderInput] = useState<string>();
  const [debouncedBuilderInput, setDebouncedBuilderInput] = useState<string>();

  const formRef = useRef<HTMLFormElement>(null);

  const { data: programData } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
    skip: !isEdit,
  });

  const [extraErrors, dispatchErrors] = useReducer(extraErrorReducer, {
    keyword: false,
    deadline: false,
    validator: false,
    links: false,
    invalidLink: false,
  });

  useEffect(() => {
    if (programData?.program?.validators?.length) {
      setSelectedValidators(programData?.program.validators?.map((k) => k.id ?? '') ?? '');
      setSelectedValidatorItems(
        programData?.program.validators?.map((k) => ({
          value: k.id ?? '',
          label: `${k.email} ${k.organizationName ? `(${k.organizationName})` : ''}`,
        })) ?? [],
      );
    }
    if (programData?.program?.invitedBuilders?.length) {
      setSelectedBuilders(programData?.program.invitedBuilders?.map((k) => k.id ?? '') ?? '');
      setSelectedBuilderItems(
        programData?.program.invitedBuilders?.map((k) => ({
          value: k.id ?? '',
          label: `${k.email} ${k.organizationName ? `(${k.organizationName})` : ''}`,
        })) ?? [],
      );
    }
    if (programData?.program?.deadline) setDeadline(new Date(programData?.program?.deadline));
    if (programData?.program?.links) setLinks(programData?.program?.links.map((l) => l.url ?? ''));
    if (programData?.program?.description) setContent(programData?.program.description);
    if (programData?.program?.network) setNetwork(programData?.program?.network);
    if (programData?.program?.currency) setCurrency(programData?.program?.currency);
    if (programData?.program?.visibility) setVisibility(programData?.program?.visibility);
  }, [programData]);

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
    control,
  } = useForm<FormValues>({
    values: {
      programName: programData?.program?.name ?? '',
      price: programData?.program?.price ?? '',
      summary: programData?.program?.summary ?? '',
      keywords:
        programData?.program?.keywords?.map((k) => k.name).filter((k): k is string => Boolean(k)) ??
        [],
      image: undefined as File | undefined,
    },
  });

  const programName = watch('programName') ?? '';
  const price = watch('price') ?? '';
  const summary = watch('summary') ?? '';
  const keywords = (watch('keywords') || []).filter((k): k is string => Boolean(k));
  const selectedImage = watch('image');

  const onSubmit = (submitData: FormValues) => {
    if (
      imageError ||
      extraErrors.deadline ||
      extraErrors.keyword ||
      extraErrors.links ||
      extraErrors.validator ||
      extraErrors.invalidLink ||
      !content.length ||
      (!(selectedImage instanceof File) && !isEdit)
    ) {
      notify('Please fill in all required fields.', 'error');
      return;
    }
    console.log(submitData);

    // onSubmitProgram({
    //   id: data?.program?.id ?? id,
    //   programName: submitData.programName,
    //   price:
    //     isEdit && data?.program?.status !== ProgramStatus.Pending ? undefined : submitData.price,
    //   description: content,
    //   summary: submitData.summary,
    //   currency:
    //     isEdit && data?.program?.status !== ProgramStatus.Pending
    //       ? (data?.program?.currency as string)
    //       : currency,
    //   deadline: deadline?.toISOString(),
    //   keywords: submitData.keywords,
    //   validators: selectedValidators ?? '',
    //   links: (() => {
    //     const { shouldSend } = validateLinks(links);
    //     return shouldSend
    //       ? links.filter((l) => l.trim()).map((l) => ({ title: l, url: l }))
    //       : undefined;
    //   })(),
    //   network:
    //     isEdit && data?.program?.status !== ProgramStatus.Pending
    //       ? (data?.program?.network as string)
    //       : (network ?? mainnetDefaultNetwork),
    //   image: submitData.image,
    //   visibility: visibility,
    //   builders: selectedBuilders,
    //   status:
    //     isEdit && data?.program?.status !== ProgramStatus.Pending
    //       ? (data?.program?.status ?? ProgramStatus.Pending)
    //       : ProgramStatus.Pending,
    // });
  };

  const extraValidation = () => {
    if (!programName || !price || !summary) {
      notify('Please fill in all required fields.', 'error');
    }
    dispatchErrors({ type: ExtraErrorActionKind.CLEAR_ERRORS });
    if (!(selectedImage instanceof File) && !isEdit) setImageError('Picture is required.');
    if (!keywords.length) dispatchErrors({ type: ExtraErrorActionKind.SET_KEYWORDS_ERROR });
    if (!selectedValidators?.length)
      dispatchErrors({ type: ExtraErrorActionKind.SET_VALIDATOR_ERROR });
    if (!deadline) dispatchErrors({ type: ExtraErrorActionKind.SET_DEADLINE_ERROR });

    const { isValid } = validateLinks(links);
    if (!isValid) {
      dispatchErrors({ type: ExtraErrorActionKind.SET_INVALID_LINK_ERROR });
    }

    formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  // const { data: carouselItems, refetch } = useCarouselItemsQuery();

  // const [createCarouselItem] = useCreateCarouselItemMutation();

  const { saveDraft: saveProgramDraft, loadDraft: loadProgramDraft } = useProgramDraft();

  // Prefill from draft on mount when creating (not editing)
  useEffect(() => {
    if (isEdit) return;
    const draft = loadProgramDraft();
    if (!draft) return;
    setValue('programName', draft.programName ?? '');
    setValue('price', draft.price ?? '');
    setValue('summary', draft.summary ?? '');
    setValue('keywords', draft.keywords ?? []);
    setContent(draft.description ?? '');
    setDeadline(draft.deadline ? new Date(draft.deadline) : undefined);
    setSelectedValidators(draft.validators ?? []);
    setLinks(draft.links?.length ? draft.links : ['']);
    setNetwork(draft.network ?? mainnetDefaultNetwork);
    setCurrency(draft.currency ?? '');
    setVisibility(draft.visibility ?? 'public');
    setSelectedBuilders(draft.builders ?? []);
    if (draft.selectedValidatorItems) setSelectedValidatorItems(draft.selectedValidatorItems);
    if (draft.selectedBuilderItems) setSelectedBuilderItems(draft.selectedBuilderItems);
  }, [isEdit]);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="max-w-[820px] w-full mx-auto">
      <h1 className="font-medium text-xl mb-6">{isEdit ? 'Edit Program' : 'Create Program'}</h1>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full px-0 mb-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ProgramOverview
            register={register}
            control={control}
            errors={errors}
            extraErrors={extraErrors}
            keywords={keywords}
            setValue={setValue}
            imageError={imageError}
            setImageError={setImageError}
            network={network}
            setNetwork={setNetwork}
            currency={currency}
            setCurrency={setCurrency}
            deadline={deadline}
            setDeadline={setDeadline}
            selectedValidators={selectedValidators}
            setSelectedValidators={setSelectedValidators}
            selectedValidatorItems={selectedValidatorItems}
            setSelectedValidatorItems={setSelectedValidatorItems}
            selectedImage={selectedImage}
            isEdit={isEdit}
          />
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
              {!content.length && (
                <span className="text-destructive text-sm block">Description is required</span>
              )}
            </label>
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
                disabled={createLoading}
                aria-label="Save draft"
                onClick={() => {
                  // Save all fields except the image into localStorage draft
                  const draft = {
                    programName,
                    price,
                    description: content ?? '',
                    summary,
                    currency,
                    deadline: deadline?.toISOString(),
                    keywords,
                    validators: selectedValidators,
                    selectedValidatorItems,
                    links,
                    network,
                    visibility,
                    builders: selectedBuilders,
                    selectedBuilderItems,
                  };
                  saveProgramDraft(draft);
                  notify('Draft saved (image is not included).');
                }}
              >
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-white text-foreground border shadow-[0px_4px_6px_-1px_#0000001A]"
              sideOffset={8}
            >
              Image file will not be saved in the draft.
            </TooltipContent>
          </Tooltip>
        )}

        {selectedTab === 'details' && (
          <Popover>
            <PopoverTrigger>
              <Button
                type="button"
                className="min-w-[97px] bg-primary hover:bg-primary/90"
                size="lg"
                disabled={createLoading}
              >
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
                  extraValidation();
                }}
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={createLoading}
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
          >
            Next to Details <ChevronRight />
          </Button>
        )}
      </div>
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
