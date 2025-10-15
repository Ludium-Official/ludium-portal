import { useProgramQuery } from "@/apollo/queries/program.generated";
import { Button } from "@/components/ui/button";
import CloseIcon from "@/assets/icons/common/CloseIcon.svg";
import { useProgramDraft } from "@/lib/hooks/use-program-draft";
import notify from "@/lib/notify";
import { mainnetDefaultNetwork } from "@/lib/utils";
import type {
  ProgramFormData,
  RecruitmentFormProps,
} from "@/types/recruitment";
import { ChevronRight } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import NetworkSelector from "@/components/network-selector";
import CurrencySelector from "@/components/currency-selector";
import { MultiSelect } from "@/components/ui/multi-select";
import { useUsersQuery } from "@/apollo/queries/users.generated";

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

  const programName = watch("programName") ?? "";
  const price = watch("price") ?? "";
  const summary = watch("summary") ?? "";
  const keywords = (watch("keywords") || []).filter((k): k is string =>
    Boolean(k)
  );
  const selectedImage = watch("image");
  const deadline = watch("deadline");
  const description = watch("description");
  const links = (watch("links") || []).filter((l): l is string => Boolean(l));
  const network = watch("network");
  const currency = watch("currency");
  const validators = watch("validators");
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

  const skills = [
    { id: "0", name: "React" },
    { id: "1", name: "NextJS" },
    { id: "2", name: "TypeScript" },
    { id: "3", name: "JavaScript" },
    { id: "4", name: "HTML" },
    { id: "5", name: "CSS" },
    { id: "6", name: "Sass" },
    { id: "7", name: "TailwindCSS" },
    { id: "8", name: "Redux" },
    { id: "9", name: "Zustand" },
    { id: "10", name: "VueJS" },
    { id: "11", name: "NuxtJS" },
    { id: "12", name: "Angular" },
    { id: "13", name: "Svelte" },
    { id: "14", name: "NodeJS" },
    { id: "15", name: "Express" },
    { id: "16", name: "NestJS" },
    { id: "17", name: "GraphQL" },
    { id: "18", name: "Apollo" },
    { id: "19", name: "tRPC" },
    { id: "20", name: "MongoDB" },
    { id: "21", name: "PostgreSQL" },
    { id: "22", name: "MySQL" },
    { id: "23", name: "SQLite" },
    { id: "24", name: "Prisma" },
    { id: "25", name: "Sequelize" },
    { id: "26", name: "Mongoose" },
    { id: "27", name: "Docker" },
    { id: "28", name: "Kubernetes" },
    { id: "29", name: "AWS" },
    { id: "30", name: "GCP" },
    { id: "31", name: "Azure" },
    { id: "32", name: "Firebase" },
    { id: "33", name: "Supabase" },
    { id: "34", name: "PocketBase" },
    { id: "35", name: "PlanetScale" },
    { id: "36", name: "Vercel" },
    { id: "37", name: "Netlify" },
    { id: "38", name: "Render" },
    { id: "39", name: "Git" },
    { id: "40", name: "GitHub" },
    { id: "41", name: "GitLab" },
    { id: "42", name: "Bitbucket" },
    { id: "43", name: "Jira" },
    { id: "44", name: "Confluence" },
    { id: "45", name: "Figma" },
    { id: "46", name: "Adobe XD" },
    { id: "47", name: "Sketch" },
    { id: "48", name: "Photoshop" },
    { id: "49", name: "Illustrator" },
    { id: "50", name: "Framer" },
    { id: "51", name: "Bootstrap" },
    { id: "52", name: "Material UI" },
    { id: "53", name: "Chakra UI" },
    { id: "54", name: "shadcn/ui" },
    { id: "55", name: "Storybook" },
    { id: "56", name: "Testing Library" },
    { id: "57", name: "Jest" },
    { id: "58", name: "Cypress" },
    { id: "59", name: "Playwright" },
    { id: "60", name: "Python" },
    { id: "61", name: "Django" },
    { id: "62", name: "Flask" },
    { id: "63", name: "FastAPI" },
    { id: "64", name: "PHP" },
    { id: "65", name: "Laravel" },
    { id: "66", name: "Ruby" },
    { id: "67", name: "Rails" },
    { id: "68", name: "Go" },
    { id: "69", name: "Rust" },
    { id: "70", name: "Java" },
    { id: "71", name: "Spring Boot" },
    { id: "72", name: "Kotlin" },
    { id: "73", name: "Swift" },
    { id: "74", name: "Objective-C" },
    { id: "75", name: "C#" },
    { id: "76", name: ".NET" },
    { id: "77", name: "C++" },
    { id: "78", name: "C" },
    { id: "79", name: "Solidity" },
    { id: "80", name: "Web3.js" },
    { id: "81", name: "Ethers.js" },
    { id: "82", name: "Wagmi" },
    { id: "83", name: "Viem" },
    { id: "84", name: "Hardhat" },
    { id: "85", name: "Foundry" },
    { id: "86", name: "Truffle" },
    { id: "87", name: "IPFS" },
    { id: "88", name: "The Graph" },
    { id: "89", name: "Chainlink" },
    { id: "90", name: "Polygon" },
    { id: "91", name: "Ethereum" },
    { id: "92", name: "Solana" },
    { id: "93", name: "Sui" },
    { id: "94", name: "Aptos" },
    { id: "95", name: "Cosmos SDK" },
    { id: "96", name: "Substrate" },
    { id: "97", name: "Kafka" },
    { id: "98", name: "Redis" },
    { id: "99", name: "ElasticSearch" },
  ];

  const skillOptions = skills.map((v) => ({
    value: v.id ?? "",
    label: v.name,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSkillInput(skillInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [skillInput]);

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
                setValue("validators", value);
              }}
              placeholder="ex. React, NodeJS"
              animation={2}
              maxCount={20}
              inputValue={skillInput}
              setInputValue={setSkillInput}
              selectedItems={selectedSkillItems}
              setSelectedItems={setSelectedSkillItems}
              emptyText="Search keywords"
              //   loading={loading}
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
