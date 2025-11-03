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
import notify from '@/lib/notify';
import { mainnetDefaultNetwork } from '@/lib/utils';
import type { LabelValueProps } from '@/types/common';
import type { ProgramFormData, RecruitmentFormProps } from '@/types/recruitment';
import { ProgramStatusV2 } from '@/types/types.generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as z from 'zod';

const programFormSchema = z.object({
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

function ProgramForm({ onSubmitProgram, isEdit = false, createLoading }: RecruitmentFormProps) {
  const { id } = useParams();

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

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programFormSchema),
    values: {
      title: programData?.programV2?.title ?? '',
      description: programData?.programV2?.description ?? '',
      skills: programData?.programV2?.skills ?? [],
      deadline: programData?.programV2?.deadline
        ? new Date(programData.programV2.deadline)
        : undefined,
      visibility: programData?.programV2?.visibility ?? 'public',
      networkId: programData?.programV2?.networkId ?? 0,
      price: programData?.programV2?.price ?? '',
      token_id: programData?.programV2?.token_id ?? 0,
      status: programData?.programV2?.status ?? ProgramStatusV2.Open,
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
    !title ||
    (budgetType === 'fixed' && !price) ||
    !networkId ||
    !tokenId ||
    !description ||
    !skills.length ||
    (submitStatus === ProgramStatusV2.Open && !deadline);

  const onSubmit = async (submitData: ProgramFormData) => {
    const finalDeadline =
      deadline ||
      (() => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        date.setHours(23, 59, 59, 999);
        return date;
      })();

    if (submitStatus === ProgramStatusV2.Open || currentStatus === ProgramStatusV2.Draft) {
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
      setBudgetType(price !== '' ? 'fixed' : 'negotiable');
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
        <h1 className="font-bold text-xl mb-6">{isEdit ? 'Edit Program' : 'Create Program'}</h1>

        <div className="flex gap-3">
          <div className="bg-white py-8 px-10 rounded-lg mb-3 flex-1">
            <InputLabel
              labelId="title"
              title="Program Title"
              className="mb-10"
              isPrimary
              isError={errors.title}
              placeholder="Type title"
              register={register}
            />

            <InputLabel
              labelId="description"
              title="Description"
              className="mb-10"
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

            <InputLabel
              labelId="skills"
              title="Skills"
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
          </div>
          <div className="flex flex-col gap-3 w-full max-w-[500px]">
            <div className="bg-white py-8 px-10 rounded-lg">
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
            <div className="bg-white py-8 px-10 rounded-lg">
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
                  className="space-y-4 text-sm"
                  value={budgetType}
                  onValueChange={(value) => setBudgetType(value as 'fixed' | 'negotiable')}
                  disabled={isEdit && programData?.programV2?.status !== ProgramStatusV2.Draft}
                >
                  <div className="flex space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <div className="w-full">
                      <Label htmlFor="fixed">Fixed Price</Label>
                      <div className="mt-1 text-muted-foreground">
                        A set amount for the entire project.
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <RadioGroupItem value="negotiable" id="negotiable" />
                    <div>
                      <Label htmlFor="negotiable">Negotiable</Label>
                      <div className="mt-1 text-muted-foreground">
                        Open to discussion based on project scope
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <span className="text-muted-foreground">Network</span>
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
                      {budgetType === 'fixed' ? (
                        <InputLabel
                          labelId="price"
                          type="number"
                          title="Price"
                          isError={errors.price}
                          className="w-full !space-y-1"
                          titleClassName="text-muted-foreground"
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
                          titleClassName="text-muted-foreground"
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
                        className="w-[108px] h-10"
                      />
                    </div>
                  </div>
                </RadioGroup>
              </InputLabel>
            </div>
            <div className="flex justify-end gap-4">
              {!isEdit && (
                <Button
                  type="button"
                  onClick={() => {
                    setSubmitStatus(ProgramStatusV2.Draft);
                    setTimeout(() => {
                      formRef?.current?.dispatchEvent(
                        new Event('submit', { cancelable: true, bubbles: true }),
                      );
                    }, 0);
                  }}
                >
                  Save as Draft
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
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ProgramForm;
