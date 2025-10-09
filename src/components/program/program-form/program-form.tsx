import { useProgramQuery } from '@/apollo/queries/program.generated';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgramDraft } from '@/lib/hooks/use-program-draft';
import notify from '@/lib/notify';
import { mainnetDefaultNetwork } from '@/lib/utils';
import type { ProgramFormData, RecruitmentFormProps } from '@/types/recruitment';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import ProgramOverview from './program-overview';
import { LabelValueProps } from '@/types/common';
import ProgramDetail from './program-detail';
import { ProgramStatus } from '@/types/types.generated';
import DraftButton from '@/components/common/button/draftButton';
import SaveButton from '@/components/common/button/saveButton';
import { validateLinks } from '@/lib/validation';

function ProgramForm({ onSubmitProgram, isEdit = false, createLoading }: RecruitmentFormProps) {
  const { id } = useParams();

  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [selectedValidatorItems, setSelectedValidatorItems] = useState<LabelValueProps[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<LabelValueProps[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  const { data: programData } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
    skip: !isEdit,
  });

  const { saveDraft: saveProgramDraft, loadDraft: loadProgramDraft } = useProgramDraft();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<ProgramFormData>({
    values: {
      programName: programData?.program?.name ?? '',
      price: programData?.program?.price ?? '',
      summary: programData?.program?.summary ?? '',
      keywords:
        programData?.program?.keywords?.map((k) => k.name).filter((k): k is string => Boolean(k)) ??
        [],
      image: undefined as File | undefined,
      description: programData?.program?.description ?? '',
      links:
        programData?.program?.links?.map((l) => l.title).filter((l): l is string => Boolean(l)) ??
        [],
      network: isEdit ? '' : mainnetDefaultNetwork,
      currency: programData?.program?.currency ?? '',
      validators: programData?.program?.validators?.map((k) => k.id ?? '') ?? [],
      visibility: programData?.program?.visibility ?? 'public',
    },
  });

  const programName = watch('programName') ?? '';
  const price = watch('price') ?? '';
  const summary = watch('summary') ?? '';
  const keywords = (watch('keywords') || []).filter((k): k is string => Boolean(k));
  const selectedImage = watch('image');
  const deadline = watch('deadline');
  const description = watch('description');
  const links = (watch('links') || []).filter((l): l is string => Boolean(l));
  const network = watch('network');
  const currency = watch('currency');
  const validators = watch('validators');
  const visibility = watch('visibility');

  const isAllFill =
    !programName ||
    !price ||
    !summary ||
    !(selectedImage instanceof File) ||
    !description ||
    !keywords.length ||
    !deadline ||
    !description ||
    !links.length ||
    !network ||
    !currency ||
    !validators.length;

  const saveFormData = {
    programName,
    price,
    description,
    summary,
    currency,
    deadline,
    keywords,
    validators,
    selectedValidatorItems,
    links,
    network,
    visibility,
    builders: selectedBuilders,
    selectedBuilderItems,
  };

  const onSubmit = (submitData: ProgramFormData) => {
    const { shouldSend } = validateLinks(links);

    if (shouldSend) {
      notify('The link must start with https://.', 'error');
      return;
    }

    onSubmitProgram({
      id: programData?.program?.id ?? id,
      programName: submitData.programName,
      price:
        isEdit && programData?.program?.status !== ProgramStatus.Pending
          ? undefined
          : submitData.price,
      description,
      summary: submitData.summary,
      currency:
        isEdit && programData?.program?.status !== ProgramStatus.Pending
          ? (programData?.program?.currency as string)
          : currency,
      deadline,
      keywords: submitData.keywords,
      validators,
      links: (() => {
        const { shouldSend } = validateLinks(links);
        return shouldSend
          ? links.filter((l) => l.trim()).map((l) => ({ title: l, url: l }))
          : undefined;
      })(),
      network:
        isEdit && programData?.program?.status !== ProgramStatus.Pending
          ? (programData?.program?.network as string)
          : (network ?? mainnetDefaultNetwork),
      image: submitData.image,
      visibility,
      builders: selectedBuilders,
      status:
        isEdit && programData?.program?.status !== ProgramStatus.Pending
          ? (programData?.program?.status ?? ProgramStatus.Pending)
          : ProgramStatus.Pending,
    });

    notify('Successfully created the program', 'success');
  };

  useEffect(() => {
    if (programData?.program?.validators?.length) {
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
  }, [programData]);

  useEffect(() => {
    if (isEdit) return;

    const draft = loadProgramDraft();
    if (!draft) return;

    setValue('programName', draft.programName ?? '');
    setValue('price', draft.price ?? '');
    setValue('summary', draft.summary ?? '');
    setValue('keywords', draft.keywords ?? []);
    setValue('deadline', draft.deadline ? new Date(draft.deadline) : undefined);
    setValue('description', draft.description ?? '');
    setValue('links', draft.links?.length ? draft.links : ['']);
    setValue('network', draft.network ?? mainnetDefaultNetwork);
    setValue('currency', draft.currency ?? '');
    setValue('validators', draft.validators ?? []);
    setValue('visibility', draft.visibility ?? 'public');

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
            setValue={setValue}
            errors={errors}
            keywords={keywords}
            deadline={deadline}
            selectedImage={selectedImage}
            network={network}
            imageError={imageError}
            setImageError={setImageError}
            currency={currency}
            validators={validators}
            selectedValidatorItems={selectedValidatorItems}
            setSelectedValidatorItems={setSelectedValidatorItems}
            isEdit={isEdit}
          />
        </TabsContent>

        <TabsContent value="details">
          <ProgramDetail
            register={register}
            errors={errors}
            setValue={setValue}
            description={description}
          />
        </TabsContent>
      </Tabs>

      <div className="py-3 flex justify-end gap-4">
        {!isEdit && (
          <DraftButton
            loading={createLoading}
            saveFunc={() => {
              saveProgramDraft(saveFormData);
              notify('Draft saved (image is not included).');
            }}
          />
        )}

        {selectedTab === 'details' && (
          <SaveButton
            isAllFill={isAllFill}
            loading={createLoading}
            setValue={setValue}
            visibility={visibility}
            selectedInviters={selectedBuilders}
            setSelectedInviters={setSelectedBuilders}
            selectedInviterItems={selectedBuilderItems}
            setSelectedInviterItems={setSelectedBuilderItems}
            formRef={formRef}
          />
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
