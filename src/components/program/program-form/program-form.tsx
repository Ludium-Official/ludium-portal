import { useGetProgramV2Query } from '@/apollo/queries/program-v2.generated';
import SaveButton from '@/components/common/button/saveButton';
import InputLabel from '@/components/common/label/inputLabel';
import CurrencySelector from '@/components/currency-selector';
import { MarkdownEditor } from '@/components/markdown';
import NetworkSelector from '@/components/network-selector';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNetworks } from '@/contexts/networks-context';
import { fetchSkills } from '@/lib/api/skills';
import { useContract } from '@/lib/hooks/use-contract';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn, fromUTCString, mainnetDefaultNetwork } from '@/lib/utils';
import type { LabelValueProps } from '@/types/common';
import type { ProgramFormData, RecruitmentFormProps } from '@/types/recruitment';
import { ProgramStatusV2 } from '@/types/types.generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { ethers } from 'ethers';
import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as z from 'zod';

const createProgramFormSchema = (isDraft: boolean) => {
  if (isDraft) {
    return z.object({
      id: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      skills: z.array(z.string()).optional(),
      deadline: z.date().optional(),
      visibility: z.enum(['public', 'private', 'restricted']).optional(),
      networkId: z.number().optional(),
      price: z.string().optional(),
      token_id: z.number().optional(),
      status: z.nativeEnum(ProgramStatusV2).optional(),
      pastStatus: z.nativeEnum(ProgramStatusV2).optional(),
      txResult: z
        .object({
          txHash: z.custom<`0x${string}`>(),
          programId: z.number().nullable(),
        })
        .optional(),
      contractId: z.string().optional(),
      invitedMembers: z.array(z.string()).optional(),
    });
  }

  return z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
    deadline: z.date().optional(),
    visibility: z.enum(['public', 'private', 'restricted']),
    networkId: z.number().min(1, 'Network is required'),
    price: z.string(),
    token_id: z.number().min(1, 'Token is required'),
    status: z.nativeEnum(ProgramStatusV2).optional(),
    pastStatus: z.nativeEnum(ProgramStatusV2).optional(),
    txResult: z
      .object({
        txHash: z.custom<`0x${string}`>(),
        programId: z.number().nullable(),
      })
      .optional(),
    contractId: z.string().optional(),
    invitedMembers: z.array(z.string()).optional(),
  });
};

function ProgramForm({
  onSubmitProgram,
  isEdit = false,
  createLoading,
  formRef: externalFormRef,
}: RecruitmentFormProps) {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const [budgetType, setBudgetType] = useState('');
  const [selectedSkillItems, setSelectedSkillItems] = useState<LabelValueProps[]>([]);
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<LabelValueProps[]>([]);
  const [skillInput, setSkillInput] = useState<string>();
  const [selectedSkills, setSelectedSkills] = useState<{ name: string }[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<ProgramStatusV2>(ProgramStatusV2.Open);

  const formRef = useRef<HTMLFormElement>(null);

  const { networks: networksWithTokens, getContractByNetworkId } = useNetworks();

  const { data: programData } = useGetProgramV2Query({
    variables: {
      id: id ?? '',
    },
    skip: !isEdit,
  });

  const schema = useMemo(
    () => createProgramFormSchema(submitStatus === ProgramStatusV2.Draft),
    [submitStatus],
  );

  const form = useForm<ProgramFormData>({
    resolver: submitStatus === ProgramStatusV2.Draft ? undefined : (zodResolver(schema) as any),
    mode: 'onChange',
    values: {
      title: programData?.programV2?.title ?? '',
      description: programData?.programV2?.description ?? '',
      skills: programData?.programV2?.skills ?? [],
      deadline: programData?.programV2?.deadline
        ? (fromUTCString(programData.programV2.deadline) ?? undefined)
        : undefined,
      visibility: programData?.programV2?.visibility ?? 'public',
      networkId: programData?.programV2?.networkId ?? 0,
      price: programData?.programV2?.price ?? '',
      token_id: programData?.programV2?.token_id ?? 0,
      status: programData?.programV2?.status ?? undefined,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const title = watch('title') ?? '';
  const description = watch('description');
  const skills = (watch('skills') || []).filter((l): l is string => Boolean(l));
  const deadline = watch('deadline');
  const price = watch('price') ?? '';
  const networkId = watch('networkId');
  const tokenId = watch('token_id');
  const visibility = watch('visibility');
  const currentStatus = watch('status');

  const currentNetwork = networksWithTokens.find((network) => Number(network.id) === networkId);

  const currentContract = getContractByNetworkId(Number(currentNetwork?.id));

  const availableTokens = currentNetwork?.tokens || [];

  const contract = useContract(currentNetwork?.chainName || 'educhain', currentContract?.address);

  const isAllFill =
    submitStatus === ProgramStatusV2.Draft
      ? true
      : !title ||
        !budgetType ||
        (budgetType === 'budget' && !price) ||
        !networkId ||
        !tokenId ||
        !description ||
        !skills.length ||
        (submitStatus === ProgramStatusV2.Open && !deadline);

  // Expose submit methods for mobile header
  useImperativeHandle(externalFormRef, () => ({
    submitDraft: () => {
      setSubmitStatus(ProgramStatusV2.Draft);
      setTimeout(() => {
        formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 0);
    },
    submitPublish: () => {
      setSubmitStatus(ProgramStatusV2.Open);
      setValue('visibility', 'public');
      setTimeout(() => {
        formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 0);
    },
  }));

  const onSubmit = async (submitData: ProgramFormData) => {
    const finalDeadline =
      deadline ||
      (() => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        date.setHours(23, 59, 59, 999);
        return date;
      })();

    const shouldCreateTx = isEdit
      ? submitStatus === ProgramStatusV2.Open && currentStatus === ProgramStatusV2.Draft
      : submitStatus === ProgramStatusV2.Open;

    if (shouldCreateTx) {
      const tokenInfo = availableTokens.find((token) => token.id === String(tokenId));
      const tokenAddress = tokenInfo?.tokenAddress || ethers.constants.AddressZero;

      const now = new Date();
      const deadline = new Date(finalDeadline);
      const durationDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const txResult = await contract.createProgramV2(
        tokenAddress as `0x${string}`,
        BigInt(durationDays),
      );

      if (txResult) {
        onSubmitProgram({
          title: submitData.title,
          price: submitData.price,
          description,
          token_id: tokenId,
          deadline: finalDeadline,
          skills: submitData.skills,
          networkId: networkId ?? mainnetDefaultNetwork,
          visibility,
          status: submitStatus,
          txResult,
          contractId: currentContract?.id,
          invitedMembers: selectedBuilders,
          pastStatus: currentStatus,
        });
      }

      return;
    }

    onSubmitProgram({
      title: submitData.title,
      price: submitData.price,
      description,
      token_id: tokenId,
      deadline: finalDeadline,
      skills: submitData.skills,
      networkId: networkId ?? mainnetDefaultNetwork,
      visibility,
      status: submitStatus,
      pastStatus: currentStatus,
    });
  };

  const skillOptions = [
    ...skills.map((v) => ({
      value: v,
      label: v,
    })),
    ...selectedSkills.map((skill) => ({
      value: skill.name,
      label: skill.name,
    })),
  ];

  useEffect(() => {
    if (isEdit) {
      setBudgetType(price !== '' ? 'budget' : 'negotiable');
    }
  }, [isEdit, price]);

  useEffect(() => {
    const loadSkills = async () => {
      setSkillsLoading(true);
      try {
        const skillsData = await fetchSkills();
        setSelectedSkills(skillsData);
      } catch (error) {
        console.error('Failed to load skills:', error);
        notify('Failed to load skills. Please try again.', 'error');
      } finally {
        setSkillsLoading(false);
      }
    };

    loadSkills();
  }, []);

  useEffect(() => {
    if (programData?.programV2?.invitedMembers?.length) {
      setSelectedBuilders(programData?.programV2.invitedMembers ?? []);
      setSelectedBuilderItems(
        programData?.programV2.invitedMembers?.map((memberId) => ({
          value: memberId,
          label: memberId,
        })) ?? [],
      );
    }
  }, [programData]);

  useEffect(() => {
    if (programData?.programV2?.skills?.length) {
      setSelectedSkillItems(
        programData?.programV2.skills.map((skill) => ({
          value: skill,
          label: skill,
        })),
      );
    }
  }, [programData]);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto">
        {!isMobile && (
          <h1 className="font-bold text-xl mb-6">{isEdit ? 'Edit Program' : 'Create Program'}</h1>
        )}

        <div className={cn('flex gap-3', isMobile && 'flex-col')}>
          <div
            className={cn(
              'bg-white py-8 px-10 rounded-lg mb-3 flex-1',
              isMobile && 'py-5 px-4 mb-0',
            )}
          >
            <InputLabel
              labelId="title"
              title="Program Title"
              className={cn('mb-10', isMobile && 'mb-6')}
              isPrimary
              isError={errors.title}
              placeholder="Type title"
              register={register}
            />

            <InputLabel
              labelId="description"
              title="Description"
              isPrimary
              isError={errors.description}
              placeholder="Description"
              inputClassName="hidden"
            >
              <MarkdownEditor
                onChange={(value: string) => {
                  setValue('description', value);
                }}
                content={description}
              />
            </InputLabel>
          </div>
          <div className={cn('flex flex-col gap-3 w-full max-w-[500px]', isMobile && 'max-w-full')}>
            <div className={cn('bg-white py-8 px-10 rounded-lg', isMobile && 'py-5 px-4')}>
              <InputLabel
                labelId="skills"
                title="Skills"
                className={cn('mb-10', isMobile && 'mb-6')}
                isPrimary
                isError={!!errors.skills}
                inputClassName="hidden"
              >
                <MultiSelect
                  options={skillOptions ?? []}
                  value={skills}
                  onValueChange={(value: string[]) => {
                    setValue('skills', value);
                  }}
                  placeholder="ex. React, NodeJS"
                  animation={2}
                  maxCount={20}
                  inputValue={skillInput}
                  setInputValue={setSkillInput}
                  selectedItems={selectedSkillItems}
                  setSelectedItems={setSelectedSkillItems}
                  emptyText="Search skills"
                  loading={skillsLoading}
                />
              </InputLabel>
              <InputLabel
                labelId="deadline"
                title="Deadline"
                inputClassName="hidden"
                isPrimary
                isError={errors.deadline}
              >
                <DatePicker
                  date={deadline}
                  setDate={(date) => {
                    if (date && typeof date === 'object' && 'getTime' in date) {
                      const newDate = new Date(date.getTime());
                      newDate.setHours(23, 59, 59, 999);
                      setValue('deadline', newDate);
                    } else {
                      setValue('deadline', date);
                    }
                  }}
                  disabled={{ before: new Date() }}
                />
              </InputLabel>
            </div>
            <div className={cn('bg-white py-8 px-10 rounded-lg', isMobile && 'py-5 px-4')}>
              <InputLabel
                labelId="budget"
                title="Budget"
                inputClassName="hidden"
                isPrimary
                isError={errors.deadline}
                disabled={isEdit && programData?.programV2?.status !== ProgramStatusV2.Draft}
              >
                <RadioGroup
                  defaultValue="open"
                  className={cn('space-y-4 text-sm', isMobile && 'space-y-3')}
                  value={budgetType}
                  onValueChange={(value) => setBudgetType(value as 'budget' | 'negotiable')}
                  disabled={isEdit && programData?.programV2?.status !== ProgramStatusV2.Draft}
                >
                  <div className="flex space-x-2">
                    <RadioGroupItem value="budget" id="budget" />
                    <div className="w-full">
                      <Label htmlFor="budget">Budget</Label>
                      <div className={cn('mt-1 text-muted-foreground', isMobile && 'text-xs')}>
                        A set amount for the entire project.
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <RadioGroupItem value="negotiable" id="negotiable" />
                    <div>
                      <Label htmlFor="negotiable">Negotiable</Label>
                      <div className={cn('mt-1 text-muted-foreground', isMobile && 'text-xs')}>
                        Open to discussion based on project scope
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <span className={cn('text-muted-foreground', isMobile && 'text-sm')}>
                        Network
                      </span>
                      <NetworkSelector
                        disabled={
                          isEdit && programData?.programV2?.status !== ProgramStatusV2.Draft
                        }
                        value={String(networkId)}
                        onValueChange={(value: string) => {
                          setValue('networkId', Number(value));
                          setValue('token_id', 0);
                        }}
                        networks={networksWithTokens}
                        loading={false}
                        className="flex justify-between w-full h-10 mt-1 bg-white border border-input text-gray-dark"
                      />
                    </div>
                    <div className="flex items-end gap-2 mt-2">
                      {budgetType === 'budget' ? (
                        <InputLabel
                          labelId="price"
                          type="number"
                          title="Price"
                          isError={errors.price}
                          className="w-full !space-y-1"
                          titleClassName={cn('text-muted-foreground', isMobile && 'text-sm')}
                          register={register}
                          placeholder="Enter price"
                          disabled={
                            isEdit && programData?.programV2?.status !== ProgramStatusV2.Draft
                          }
                        />
                      ) : (
                        <InputLabel
                          labelId="price"
                          title="Price"
                          className="w-full !space-y-1"
                          titleClassName={cn('text-muted-foreground', isMobile && 'text-sm')}
                          placeholder="Negotiable"
                          disabled
                        />
                      )}
                      <CurrencySelector
                        disabled={
                          isEdit && programData?.programV2?.status !== ProgramStatusV2.Draft
                        }
                        value={String(tokenId)}
                        onValueChange={(value: string) => {
                          setValue('token_id', Number(value));
                        }}
                        tokens={availableTokens}
                        className={cn('w-[108px] h-10', isMobile && 'w-[90px]')}
                      />
                    </div>
                  </div>
                </RadioGroup>
              </InputLabel>
            </div>
            {/* Hide buttons on mobile when parent provides MobileFormHeader */}
            {!(isMobile && externalFormRef) && (
              <div className={cn('flex justify-end gap-4', isMobile && 'gap-2')}>
                {currentStatus !== ProgramStatusV2.Open && (
                  <Button
                    type="button"
                    variant="outline"
                    size={isMobile ? 'sm' : 'default'}
                    onClick={() => {
                      setSubmitStatus(ProgramStatusV2.Draft);
                      setTimeout(() => {
                        formRef?.current?.dispatchEvent(
                          new Event('submit', { cancelable: true, bubbles: true }),
                        );
                      }, 0);
                    }}
                  >
                    Save draft
                  </Button>
                )}

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
                  onBeforeSubmit={() => setSubmitStatus(ProgramStatusV2.Open)}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ProgramForm;
