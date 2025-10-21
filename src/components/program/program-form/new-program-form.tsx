import { useProgramQuery } from "@/apollo/queries/program.generated";
import { useProgramDraft } from "@/lib/hooks/use-program-draft";
import notify from "@/lib/notify";
import { mainnetDefaultNetwork } from "@/lib/utils";
import type {
  ProgramFormData,
  RecruitmentFormProps,
} from "@/types/recruitment";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { LabelValueProps } from "@/types/common";
import { ProgramStatus } from "@/types/types.generated";
import DraftButton from "@/components/common/button/draftButton";
import SaveButton from "@/components/common/button/saveButton";
import { validateLinks } from "@/lib/validation";
import InputLabel from "@/components/common/label/inputLabel";
import { MarkdownEditor } from "@/components/markdown";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import NetworkSelector from "@/components/network-selector";
import CurrencySelector from "@/components/currency-selector";
import { MultiSelect } from "@/components/ui/multi-select";
import { fetchSkills } from "@/lib/api/skills";

function ProgramForm({
  onSubmitProgram,
  isEdit = false,
  createLoading,
}: RecruitmentFormProps) {
  const { id } = useParams();

  const [budgetType, setBudgetType] = useState("");
  const [selectedSkillItems, setSelectedSkillItems] = useState<
    LabelValueProps[]
  >([]);
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<
    LabelValueProps[]
  >([]);
  const [skillInput, setSkillInput] = useState<string>();
  const [debouncedSkillInput, setDebouncedSkillInput] = useState<string>();
  const [skills, setSkills] = useState<{ name: string }[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const { data: programData } = useProgramQuery({
    variables: {
      id: id ?? "",
    },
    skip: !isEdit,
  });

  const { saveDraft: saveProgramDraft, loadDraft: loadProgramDraft } =
    useProgramDraft();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<ProgramFormData>({
    values: {
      programName: programData?.program?.name ?? "",
      price: programData?.program?.price ?? "",
      summary: programData?.program?.summary ?? "",
      keywords:
        programData?.program?.keywords
          ?.map((k) => k.name)
          .filter((k): k is string => Boolean(k)) ?? [],
      image: undefined as File | undefined,
      description: programData?.program?.description ?? "",
      links:
        programData?.program?.links
          ?.map((l) => l.title)
          .filter((l): l is string => Boolean(l)) ?? [],
      network: isEdit ? "" : mainnetDefaultNetwork,
      currency: programData?.program?.currency ?? "",
      validators:
        programData?.program?.validators?.map((k) => k.id ?? "") ?? [],
      visibility: programData?.program?.visibility ?? "public",
    },
  });

  //   const programName = watch("programName") ?? "";
  const programTitle = watch("programTitle") ?? "";
  const price = watch("price") ?? "";
  //   const summary = watch("summary") ?? "";
  //   const keywords = (watch("keywords") || []).filter((k): k is string =>
  //     Boolean(k)
  //   );
  //   const selectedImage = watch("image");
  const deadline = watch("deadline");
  const description = watch("description");
  // const skills = (watch("skills") || []).filter((l): l is string => Boolean(l));
  const network = watch("network");
  const currency = watch("currency");
  //   const validators = watch("validators");
  const visibility = watch("visibility");

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
    selectedSkillItems,
    links,
    network,
    visibility,
    builders: selectedBuilders,
    selectedBuilderItems,
  };

  const onSubmit = (submitData: ProgramFormData) => {
    const { shouldSend } = validateLinks(links);

    if (shouldSend) {
      notify("The link must start with https://.", "error");
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
          : network ?? mainnetDefaultNetwork,
      image: submitData.image,
      visibility,
      builders: selectedBuilders,
      status:
        isEdit && programData?.program?.status !== ProgramStatus.Pending
          ? programData?.program?.status ?? ProgramStatus.Pending
          : ProgramStatus.Pending,
    });

    notify("Successfully created the program", "success");
  };

  const skillOptions = skills.map((v) => ({
    label: v.name,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSkillInput(skillInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [skillInput]);

  useEffect(() => {
    const loadSkills = async () => {
      setSkillsLoading(true);
      try {
        const skillsData = await fetchSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error("Failed to load skills:", error);
        notify("Failed to load skills. Please try again.", "error");
      } finally {
        setSkillsLoading(false);
      }
    };

    loadSkills();
  }, []);

  useEffect(() => {
    if (programData?.program?.validators?.length) {
      setSelectedSkillItems(
        programData?.program.validators?.map((k) => ({
          value: k.id ?? "",
          label: `${k.email} ${
            k.organizationName ? `(${k.organizationName})` : ""
          }`,
        })) ?? []
      );
    }
    if (programData?.program?.invitedBuilders?.length) {
      setSelectedBuilders(
        programData?.program.invitedBuilders?.map((k) => k.id ?? "") ?? ""
      );
      setSelectedBuilderItems(
        programData?.program.invitedBuilders?.map((k) => ({
          value: k.id ?? "",
          label: `${k.email} ${
            k.organizationName ? `(${k.organizationName})` : ""
          }`,
        })) ?? []
      );
    }
  }, [programData]);

  useEffect(() => {
    if (isEdit) return;

    const draft = loadProgramDraft();
    if (!draft) return;

    setValue("programName", draft.programName ?? "");
    setValue("price", draft.price ?? "");
    setValue("summary", draft.summary ?? "");
    setValue("keywords", draft.keywords ?? []);
    setValue("deadline", draft.deadline ? new Date(draft.deadline) : undefined);
    setValue("description", draft.description ?? "");
    setValue("links", draft.links?.length ? draft.links : [""]);
    setValue("network", draft.network ?? mainnetDefaultNetwork);
    setValue("currency", draft.currency ?? "");
    setValue("validators", draft.validators ?? []);
    setValue("visibility", draft.visibility ?? "public");

    setSelectedBuilders(draft.builders ?? []);
    if (draft.selectedValidatorItems)
      setSelectedSkillItems(draft.selectedValidatorItems);
    if (draft.selectedBuilderItems)
      setSelectedBuilderItems(draft.selectedBuilderItems);
  }, [isEdit]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto"
    >
      <h1 className="font-bold text-xl mb-6">
        {isEdit ? "Edit Program" : "Create Program"}
      </h1>

      <div className="flex gap-3">
        <div className="bg-white py-8 px-10 rounded-lg mb-3 flex-1">
          <InputLabel
            labelId="programTitle"
            title="Program Title"
            className="mb-10"
            isPrimary
            isError={errors.programName}
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
                setValue("description", value);
              }}
              content={description}
            />
          </InputLabel>

          <InputLabel
            labelId="keywords"
            title="Skills"
            isPrimary
            isError={!!errors.keywords}
            inputClassName="hidden"
          >
            <MultiSelect
              options={skillOptions ?? []}
              value={validators}
              onValueChange={(value: string[]) => {
                setValue("skills", value);
              }}
              placeholder="ex. React, NodeJS"
              animation={2}
              maxCount={20}
              inputValue={skillInput}
              setInputValue={setSkillInput}
              selectedItems={selectedSkillItems}
              setSelectedItems={setSelectedSkillItems}
              emptyText="Search keywords"
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
                  if (date && typeof date === "object" && "getTime" in date) {
                    const newDate = new Date(date.getTime());
                    newDate.setHours(23, 59, 59, 999);
                    setValue("deadline", newDate);
                  } else {
                    setValue("deadline", date);
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
            >
              <RadioGroup
                defaultValue="open"
                className="space-y-4 text-sm"
                value={budgetType}
                onValueChange={(value) =>
                  setBudgetType(value as "fixed" | "negotiable")
                }
              >
                <div className="flex space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <div className="w-full">
                    <Label htmlFor="fixed">Fixed Price</Label>
                    <div className="mt-1 text-muted-foreground">
                      A set amount for the entire project.
                    </div>
                    {budgetType === "fixed" && (
                      <div>
                        <div className="mt-2">
                          <span className="text-muted-foreground">Network</span>
                          <NetworkSelector
                            disabled={
                              isEdit &&
                              programData?.program?.status !==
                                ProgramStatus.Pending
                            }
                            value={network}
                            onValueChange={(value: string) => {
                              setValue("network", value);
                            }}
                            className="flex justify-between w-full h-10 mt-1 bg-white border border-input text-gray-dark"
                          />
                        </div>
                        <div className="flex items-end gap-2 mt-2">
                          <InputLabel
                            labelId="price"
                            type="number"
                            title="Price"
                            isError={errors.price}
                            className="w-full !space-y-1"
                            titleClassName="text-muted-foreground"
                            register={register}
                            placeholder="Enter price"
                          />
                          {!!network && (
                            <CurrencySelector
                              disabled={
                                isEdit &&
                                programData?.program?.status !==
                                  ProgramStatus.Pending
                              }
                              value={currency}
                              onValueChange={(value: string) => {
                                setValue("currency", value);
                              }}
                              network={network ?? mainnetDefaultNetwork}
                              className="w-[108px] h-10"
                            />
                          )}
                        </div>
                      </div>
                    )}
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
              </RadioGroup>
            </InputLabel>
          </div>
          <div className="flex justify-end gap-4">
            {!isEdit && (
              <DraftButton
                loading={createLoading}
                saveFunc={() => {
                  saveProgramDraft(saveFormData);
                  notify("Draft saved.");
                }}
                tooltipDescription="Draft save button"
              />
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
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default ProgramForm;
