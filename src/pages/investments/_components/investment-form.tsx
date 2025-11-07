import { useProgramQuery } from "@/apollo/queries/program.generated";
import { useUsersV2Query } from "@/apollo/queries/users-v2.generated";
import CurrencySelector from "@/components/currency-selector";
import { MarkdownEditor } from "@/components/markdown";
import NetworkSelector from "@/components/network-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNetworks } from "@/contexts/networks-context";
import { useInvestmentDraft } from "@/lib/hooks/use-investment-draft";
import notify from "@/lib/notify";
import { cn, fromUTCString, mainnetDefaultNetwork, toUTCString } from "@/lib/utils";
import { filterEmptyLinks, validateLinks } from "@/lib/validation";
import type { LabelValueProps, VisibilityProps } from "@/types/common";
import { type LinkInput, ProgramStatus } from "@/types/types.generated";
import { ethers } from "ethers";
import { ChevronRight, Image as ImageIcon, Plus, X } from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

export type OnSubmitInvestmentFunc = (data: {
  id?: string;
  programName: string;
  price?: string;
  description: string;
  summary: string;
  currency: string;
  deadline?: string;
  keywords: string[];
  links?: LinkInput[];
  network: string;
  validators: string[];
  validatorWalletAddresses?: string[];
  image?: File;
  visibility: VisibilityProps;
  status: ProgramStatus;
  builders?: string[];
  applicationStartDate?: string;
  applicationEndDate?: string;
  fundingStartDate?: string;
  fundingEndDate?: string;
  fundingCondition?: "open" | "tier";
  tierSettings?: {
    bronze?: { enabled: boolean; maxAmount: string };
    silver?: { enabled: boolean; maxAmount: string };
    gold?: { enabled: boolean; maxAmount: string };
    platinum?: { enabled: boolean; maxAmount: string };
  };
  feePercentage?: number;
  customFeePercentage?: number;
}) => void;

export interface InvestmentFormProps {
  isEdit: boolean;
  onSubmitInvestment: OnSubmitInvestmentFunc;
}

function InvestmentForm({ onSubmitInvestment, isEdit }: InvestmentFormProps) {
  const { id } = useParams();

  const { data } = useProgramQuery({
    variables: {
      id: id ?? "",
    },
    skip: !isEdit,
  });

  const { networks: networksWithTokens } = useNetworks();

  const [selectedTab, setSelectedTab] = useState<string>("overview");

  // Check if program is published - only allow editing title, keywords, summary, and description
  const isPublished = data?.program?.status === ProgramStatus.Published;

  const [content, setContent] = useState<string>("");
  const [deadline, setDeadline] = useState<Date>();
  const [applicationStartDate, setApplicationStartDate] = useState<Date>();
  const [applicationDueDate, setApplicationDueDate] = useState<Date>();
  const [fundingStartDate, setFundingStartDate] = useState<Date>();
  const [fundingDueDate, setFundingDueDate] = useState<Date>();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState<string>("");
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([""]);
  const [network, setNetwork] = useState(
    isEdit ? undefined : mainnetDefaultNetwork
  );
  const [currency, setCurrency] = useState("");
  const [selectedImage, setSelectedImage] = useState<File>();
  const [visibility, setVisibility] = useState<VisibilityProps>("public");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<
    LabelValueProps[]
  >([]);
  const [builderInput, setBuilderInput] = useState<string>();
  const [debouncedBuilderInput, setDebouncedBuilderInput] = useState<string>();

  // Condition tab state
  const [conditionType, setConditionType] = useState<"open" | "tier">("open");
  const [tiers, setTiers] = useState([
    {
      name: "Bronze",
      enabled: false,
      maxAmount: undefined as string | undefined,
    },
    {
      name: "Silver",
      enabled: false,
      maxAmount: undefined as string | undefined,
    },
    {
      name: "Gold",
      enabled: false,
      maxAmount: undefined as string | undefined,
    },
    {
      name: "Platinum",
      enabled: false,
      maxAmount: undefined as string | undefined,
    },
  ]);
  const [feeType, setFeeType] = useState<"default" | "custom">("default");
  const [customFee, setCustomFee] = useState<string | undefined>(undefined);

  const [validatorInput, setValidatorInput] = useState<string>();
  const [debouncedValidatorInput, setDebouncedValidatorInput] =
    useState<string>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValidatorInput(validatorInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [validatorInput]);

  const { data: validators, loading } = useUsersV2Query({
    variables: {
      query: {
        limit: 5,
        search: debouncedValidatorInput ?? "",
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
    dates: false,
  });

  const validatorOptions = validators?.usersV2?.users?.map((v) => ({
    value: v.id ?? "",
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ""}`,
  }));

  useEffect(() => {
    if (data?.program?.keywords)
      setSelectedKeywords(
        data?.program?.keywords?.map((k) => k.name ?? "") ?? []
      );
    if (data?.program?.validators?.length) {
      setSelectedValidators(
        data?.program.validators?.map((k) => k.id ?? "") ?? ""
      );
      setSelectedValidatorItems(
        data?.program.validators?.map((k) => ({
          value: k.id ?? "",
          label: `${k.email} ${
            k.organizationName ? `(${k.organizationName})` : ""
          }`,
        })) ?? []
      );
    }
    if (data?.program?.invitedBuilders?.length) {
      setSelectedBuilders(
        data?.program.invitedBuilders?.map((k) => k.id ?? "") ?? ""
      );
      setSelectedBuilderItems(
        data?.program.invitedBuilders?.map((k) => ({
          value: k.id ?? "",
          label: `${k.email} ${
            k.organizationName ? `(${k.organizationName})` : ""
          }`,
        })) ?? []
      );
    }
    if (data?.program?.deadline) setDeadline(fromUTCString(data?.program?.deadline) ?? undefined);
    if (data?.program?.links)
      setLinks(data?.program?.links.map((l) => l.url ?? ""));
    if (data?.program?.description) setContent(data?.program.description);
    if (data?.program?.network) setNetwork(data?.program?.network);
    if (data?.program?.currency) setCurrency(data?.program?.currency);
    if (data?.program?.image) setImagePreview(data?.program?.image);
    if (data?.program?.visibility) setVisibility(data?.program?.visibility);

    // Prefill application dates (convert from UTC to local)
    if (data?.program?.applicationStartDate)
      setApplicationStartDate(fromUTCString(data?.program?.applicationStartDate) ?? undefined);
    if (data?.program?.applicationEndDate)
      setApplicationDueDate(fromUTCString(data?.program?.applicationEndDate) ?? undefined);

    // Prefill funding dates (convert from UTC to local)
    if (data?.program?.fundingStartDate)
      setFundingStartDate(fromUTCString(data?.program?.fundingStartDate) ?? undefined);
    if (data?.program?.fundingEndDate)
      setFundingDueDate(fromUTCString(data?.program?.fundingEndDate) ?? undefined);

    // Prefill funding condition
    if (data?.program?.fundingCondition)
      setConditionType(data?.program?.fundingCondition);

    // Prefill tier settings
    if (data?.program?.tierSettings) {
      setTiers([
        {
          name: "Bronze",
          enabled: data?.program?.tierSettings.bronze?.enabled ?? false,
          maxAmount:
            data?.program?.tierSettings.bronze?.maxAmount?.toString() ??
            undefined,
        },
        {
          name: "Silver",
          enabled: data?.program?.tierSettings.silver?.enabled ?? false,
          maxAmount:
            data?.program?.tierSettings.silver?.maxAmount?.toString() ??
            undefined,
        },
        {
          name: "Gold",
          enabled: data?.program?.tierSettings.gold?.enabled ?? false,
          maxAmount:
            data?.program?.tierSettings.gold?.maxAmount?.toString() ??
            undefined,
        },
        {
          name: "Platinum",
          enabled: data?.program?.tierSettings.platinum?.enabled ?? false,
          maxAmount:
            data?.program?.tierSettings.platinum?.maxAmount?.toString() ??
            undefined,
        },
      ]);
    }

    // Prefill fee settings
    if (data?.program?.customFeePercentage) {
      setFeeType("custom");
      setCustomFee((data?.program?.customFeePercentage / 100).toString());
    } else if (data?.program?.feePercentage) {
      setFeeType("default");
      setCustomFee(undefined);
    }
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBuilderInput(builderInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [builderInput]);

  const { data: buildersData, loading: buildersLoading } = useUsersV2Query({
    variables: {
      query: {
        limit: 5,
        search: debouncedBuilderInput ?? "",
      },
    },
    skip: !builderInput,
  });

  const builderOptions = buildersData?.usersV2?.users?.map((v) => ({
    value: v.id ?? "",
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ""}`,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    values: {
      programName: data?.program?.name ?? "",
      price: data?.program?.price ?? "",
      summary: data?.program?.summary ?? "",
    },
  });

  const onSubmit = (submitData: {
    programName: string;
    price: string;
    summary: string;
  }) => {
    // For published programs, only validate editable fields
    if (isPublished) {
      if (
        !submitData.programName ||
        !submitData.summary ||
        !content.length ||
        !selectedKeywords?.length
      ) {
        notify("Please fill in all required fields.", "error");
        return;
      }
    } else {
      // Validate number fields for non-published programs
      const price = submitData.price;
      if (
        !price ||
        price === "0" ||
        price === "0.0" ||
        price === "0.00" ||
        Number(price) <= 0
      ) {
        notify("Please enter a valid price greater than 0.", "error");
        return;
      }

      // Validate custom fee if custom fee type is selected
      if (
        feeType === "custom" &&
        (!customFee ||
          customFee === "0" ||
          customFee === "0.0" ||
          Number(customFee) <= 0)
      ) {
        notify(
          "Please enter a valid custom fee percentage greater than 0.",
          "error"
        );
        return;
      }

      // Validate tier amounts if tier condition is selected
      if (conditionType === "tier") {
        const enabledTiers = tiers.filter((tier) => tier.enabled);
        if (enabledTiers.length === 0) {
          notify("Please enable at least one tier.", "error");
          return;
        }

        for (const tier of enabledTiers) {
          if (
            !tier.maxAmount ||
            tier.maxAmount === "0" ||
            tier.maxAmount === "0.0" ||
            Number(tier.maxAmount) <= 0
          ) {
            notify(
              `Please enter a valid maximum amount for ${tier.name} tier.`,
              "error"
            );
            return;
          }
        }
      }

      if (
        imageError ||
        extraErrors.deadline ||
        extraErrors.keyword ||
        extraErrors.links ||
        extraErrors.validator ||
        extraErrors.invalidLink ||
        extraErrors.dates ||
        !content.length ||
        (!selectedImage && !isEdit)
      ) {
        notify("Please fill in all required fields.", "error");
        return;
      }
    }

    // Get validator wallet addresses
    const validatorWalletAddresses = selectedValidatorItems
      .map((item) => {
        // Find the validator in the data
        const validator = validators?.usersV2?.users?.find(
          (u) => u.id === item.value
        );
        return validator?.walletAddress || null;
      })
      .filter((address) => address !== null) as string[];

    // For published programs, only send editable fields
    if (isPublished) {
      onSubmitInvestment({
        id: data?.program?.id ?? id,
        programName: submitData.programName,
        description: content,
        summary: submitData.summary,
        keywords: selectedKeywords,
        // Required fields that we keep from existing data
        currency: data?.program?.currency as string,
        network: data?.program?.network as string,
        validators: selectedValidators ?? [],
        visibility: data?.program?.visibility as
          | "public"
          | "restricted"
          | "private",
        status: data?.program?.status ?? ProgramStatus.Pending,
      });
    } else {
      // For non-published programs, send all fields
      onSubmitInvestment({
        id: data?.program?.id ?? id,
        programName: submitData.programName,
        price:
          isEdit && data?.program?.status !== ProgramStatus.Pending
            ? undefined
            : submitData.price,
        description: content,
        summary: submitData.summary,
        currency:
          isEdit && data?.program?.status !== ProgramStatus.Pending
            ? (data?.program?.currency as string)
            : currency,
        deadline: deadline ? toUTCString(deadline) : undefined,
        keywords: selectedKeywords,
        validators: selectedValidators ?? [],
        validatorWalletAddresses,
        links: (() => {
          const { shouldSend } = validateLinks(links);
          return shouldSend
            ? filterEmptyLinks(links).map((l) => ({ title: l, url: l }))
            : undefined;
        })(),
        network:
          isEdit && data?.program?.status !== ProgramStatus.Pending
            ? (data?.program?.network as string)
            : network ?? mainnetDefaultNetwork,
        image: selectedImage,
        visibility: visibility,
        status:
          isEdit && data?.program?.status !== ProgramStatus.Pending
            ? data?.program?.status ?? ProgramStatus.Pending
            : ProgramStatus.Pending,
        builders: selectedBuilders,
        applicationStartDate: applicationStartDate
          ? toUTCString(applicationStartDate)
          : undefined,
        applicationEndDate: applicationDueDate
          ? toUTCString(applicationDueDate)
          : undefined,
        fundingStartDate: fundingStartDate
          ? toUTCString(fundingStartDate)
          : undefined,
        fundingEndDate: fundingDueDate
          ? toUTCString(fundingDueDate)
          : undefined,
        fundingCondition: conditionType,
        tierSettings:
          conditionType === "tier"
            ? {
                bronze:
                  tiers.find((t) => t.name === "Bronze")?.enabled ?? false
                    ? {
                        enabled: true,
                        maxAmount:
                          tiers.find((t) => t.name === "Bronze")?.maxAmount ||
                          "",
                      }
                    : undefined,
                silver:
                  tiers.find((t) => t.name === "Silver")?.enabled ?? false
                    ? {
                        enabled: true,
                        maxAmount:
                          tiers.find((t) => t.name === "Silver")?.maxAmount ||
                          "",
                      }
                    : undefined,
                gold:
                  tiers.find((t) => t.name === "Gold")?.enabled ?? false
                    ? {
                        enabled: true,
                        maxAmount:
                          tiers.find((t) => t.name === "Gold")?.maxAmount || "",
                      }
                    : undefined,
                platinum:
                  tiers.find((t) => t.name === "Platinum")?.enabled ?? false
                    ? {
                        enabled: true,
                        maxAmount:
                          tiers.find((t) => t.name === "Platinum")?.maxAmount ||
                          "",
                      }
                    : undefined,
              }
            : undefined,
        feePercentage: feeType === "default" ? 300 : undefined,
        customFeePercentage:
          feeType === "custom"
            ? Math.round(Number.parseFloat(customFee ?? "0") * 100)
            : undefined,
      });
    }
  };

  const extraValidation = () => {
    if (!watch("programName") || !watch("summary")) {
      notify("Please fill in all required fields.", "error");
    }

    // Only validate price if not published
    if (!isPublished && !watch("price")) {
      notify("Please fill in all required fields.", "error");
    }

    dispatchErrors({ type: ExtraErrorActionKind.CLEAR_ERRORS });

    // Only validate image if not published and not editing
    if (!isPublished && !selectedImage && !isEdit)
      setImageError("Picture is required.");

    if (!selectedKeywords?.length)
      dispatchErrors({ type: ExtraErrorActionKind.SET_KEYWORDS_ERROR });

    // Only validate validators if not published
    if (!isPublished && !selectedValidators?.length)
      dispatchErrors({ type: ExtraErrorActionKind.SET_VALIDATOR_ERROR });

    // Only validate dates if not published
    if (
      !isPublished &&
      (!applicationStartDate ||
        !applicationDueDate ||
        !fundingStartDate ||
        !fundingDueDate)
    )
      dispatchErrors({ type: ExtraErrorActionKind.SET_DATE_ERROR });

    // Only validate links if not published
    if (!isPublished) {
      const { isValid } = validateLinks(links);
      if (!isValid) {
        dispatchErrors({ type: ExtraErrorActionKind.SET_INVALID_LINK_ERROR });
      }
    }

    formRef?.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  const [selectedValidatorItems, setSelectedValidatorItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const formRef = useRef<HTMLFormElement>(null);
  const { saveDraft: saveInvestmentDraft, loadDraft: loadInvestmentDraft } =
    useInvestmentDraft();

  // Prefill from draft on mount when creating (not editing)
  useEffect(() => {
    if (isEdit) return;
    const draft = loadInvestmentDraft();
    if (!draft) return;
    setValue("programName", draft.programName ?? "");
    setValue("price", draft.price ?? "");
    setValue("summary", draft.summary ?? "");
    setContent(draft.description ?? "");
    setDeadline(draft.deadline ? fromUTCString(draft.deadline) ?? undefined : undefined);
    setSelectedKeywords(draft.keywords ?? []);
    setSelectedValidators(draft.validators ?? []);
    setLinks(draft.links?.length ? draft.links : [""]);
    setNetwork(draft.network ?? mainnetDefaultNetwork);
    setCurrency(draft.currency ?? "");
    setVisibility(draft.visibility ?? "public");
    setSelectedBuilders(draft.builders ?? []);
    setApplicationStartDate(
      draft.applicationStartDate
        ? fromUTCString(draft.applicationStartDate) ?? undefined
        : undefined
    );
    setApplicationDueDate(
      draft.applicationEndDate ? fromUTCString(draft.applicationEndDate) ?? undefined : undefined
    );
    setFundingStartDate(
      draft.fundingStartDate ? fromUTCString(draft.fundingStartDate) ?? undefined : undefined
    );
    setFundingDueDate(
      draft.fundingEndDate ? fromUTCString(draft.fundingEndDate) ?? undefined : undefined
    );
    setConditionType(draft.fundingCondition ?? "open");
    setFeeType(draft.feeType ?? "default");
    setCustomFee(draft.customFee ?? "0");
    if (draft.selectedValidatorItems)
      setSelectedValidatorItems(draft.selectedValidatorItems);
    if (draft.selectedBuilderItems)
      setSelectedBuilderItems(draft.selectedBuilderItems);
    if (draft.tierSettings) {
      setTiers([
        {
          name: "Bronze",
          enabled: draft.tierSettings.bronze?.enabled ?? false,
          maxAmount: draft.tierSettings.bronze?.maxAmount ?? "0",
        },
        {
          name: "Silver",
          enabled: draft.tierSettings.silver?.enabled ?? false,
          maxAmount: draft.tierSettings.silver?.maxAmount ?? "0",
        },
        {
          name: "Gold",
          enabled: draft.tierSettings.gold?.enabled ?? false,
          maxAmount: draft.tierSettings.gold?.maxAmount ?? "0",
        },
        {
          name: "Platinum",
          enabled: draft.tierSettings.platinum?.enabled ?? false,
          maxAmount: draft.tierSettings.platinum?.maxAmount ?? "0",
        },
      ]);
    }
  }, [isEdit]);

  // Auto-update application due date when start date changes
  useEffect(() => {
    if (applicationStartDate && applicationDueDate) {
      // If the due date is before the new start date, update it to match the start date
      if (applicationDueDate < applicationStartDate) {
        setApplicationDueDate(applicationStartDate);
      }
    }
  }, [applicationStartDate]);

  // Auto-update funding due date when start date changes
  useEffect(() => {
    if (fundingStartDate && fundingDueDate) {
      // If the due date is before the new start date, update it to match the start date
      if (fundingDueDate < fundingStartDate) {
        setFundingDueDate(fundingStartDate);
      }
    }
  }, [fundingStartDate]);

  // Tier handlers
  const handleTierChange = (tierName: string, enabled: boolean) => {
    setTiers((prev) =>
      prev.map((tier) => (tier.name === tierName ? { ...tier, enabled } : tier))
    );
  };

  const handleTierAmountChange = (tierName: string, amount: string) => {
    setTiers((prev) =>
      prev.map((tier) =>
        tier.name === tierName
          ? { ...tier, maxAmount: amount || undefined }
          : tier
      )
    );
  };

  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  const handleKeywordInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ((e.key === " " || e.key === "Enter") && keywordInput.trim()) {
      e.preventDefault();
      const newKeyword = keywordInput.trim();
      if (newKeyword && !selectedKeywords.includes(newKeyword)) {
        setSelectedKeywords([...selectedKeywords, newKeyword]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setSelectedKeywords(
      selectedKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  // Validation functions for each tab
  const isOverviewTabValid = () => {
    const programName = watch("programName");
    const hasKeywords = selectedKeywords.length > 0;

    // For published programs, only validate editable fields
    if (isPublished) {
      return programName && hasKeywords;
    }

    // For non-published programs, validate all fields
    const hasImage = selectedImage || (isEdit && imagePreview);
    const hasApplicationDates = applicationStartDate && applicationDueDate;
    const hasFundingDates = fundingStartDate && fundingDueDate;
    const hasValidators = selectedValidators.length > 0;

    return (
      programName &&
      hasKeywords &&
      hasImage &&
      hasApplicationDates &&
      hasFundingDates &&
      hasValidators
    );
  };

  const isDetailsTabValid = () => {
    const summary = watch("summary");
    const hasDescription = content.length > 0;

    return summary && hasDescription;
  };

  // image input handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate type
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImageError("Only PNG, JPG, or JPEG files are allowed.");
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }
    // Validate size
    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image must be under 2MB.");
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }
    // Validate square
    const img = new window.Image();
    img.onload = () => {
      if (img.width !== img.height) {
        setImageError("Image must be square (1:1).");
        setSelectedImage(undefined);
        setImagePreview(null);
      } else {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
    img.onerror = () => {
      setImageError("Invalid image file.");
      setSelectedImage(undefined);
      setImagePreview(null);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[820px] w-full mx-auto"
    >
      <h1 className="font-medium text-xl mb-6">Investment</h1>
      {/* <h1 className="font-medium text-xl mb-6">{isEdit ? 'Edit Program' : 'Create Program'}</h1> */}

      <Tabs
        defaultValue="overview"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList className="w-full px-0 mb-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          {!isPublished && (
            <TabsTrigger value="condition">Condition</TabsTrigger>
          )}
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
                {...register("programName", { required: true })}
              />
              {errors.programName && (
                <span className="text-destructive text-sm block">
                  Program name is required
                </span>
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
                  placeholder="Enter directly"
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
                <span className="text-destructive text-sm block">
                  Keywords is required
                </span>
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
                    disabled={isPublished}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
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
                    Logo image must be square, under 2MB, and in PNG, JPG, or
                    JPEG format.
                    <br />
                    This image is used in the program list
                  </p>
                  {imageError && (
                    <span className="text-destructive text-sm block mt-28">
                      {imageError}
                    </span>
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
                  <p className="text-sm font-medium mb-2">
                    Start Date <span className="text-primary">*</span>
                  </p>
                  <div className="flex-1">
                    <DatePicker
                      date={applicationStartDate}
                      setDate={(date) => {
                        if (
                          date &&
                          typeof date === "object" &&
                          "getTime" in date
                        ) {
                          const newDate = new Date(date.getTime());
                          newDate.setHours(0, 0, 0, 0);
                          setApplicationStartDate(newDate);
                        } else {
                          setApplicationStartDate(date);
                        }
                      }}
                      // Allow selecting today and future dates
                      disabled={
                        isPublished
                          ? true
                          : {
                              before: new Date(new Date().setHours(0, 0, 0, 0)),
                            }
                      }
                    />
                  </div>
                </div>
                <div className="w-3 h-px bg-muted-foreground self-end mb-5" />

                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">
                    Due Date <span className="text-primary">*</span>
                  </p>
                  <div className="flex-1">
                    <DatePicker
                      date={applicationDueDate}
                      setDate={(date) => {
                        if (
                          date &&
                          typeof date === "object" &&
                          "getTime" in date
                        ) {
                          const newDate = new Date(date.getTime());
                          newDate.setHours(23, 59, 59, 999);
                          setApplicationDueDate(newDate);
                        } else {
                          setApplicationDueDate(date);
                        }
                      }}
                      disabled={
                        isPublished
                          ? true
                          : {
                              // Application end must be same day or after application start
                              before: applicationStartDate
                                ? applicationStartDate
                                : new Date(new Date().setHours(0, 0, 0, 0)),
                            }
                      }
                    />
                  </div>
                </div>
              </div>
              {extraErrors.dates && (
                <span className="text-destructive text-sm block mt-2">
                  All date fields are required
                </span>
              )}
            </label>

            <label htmlFor="fundingDate" className="space-y-2 block mb-10">
              <p className="text-sm font-medium text-muted-foreground">
                Funding date
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">
                    Start Date <span className="text-primary">*</span>
                  </p>
                  <div className="flex-1">
                    <DatePicker
                      date={fundingStartDate}
                      setDate={(date) => {
                        if (
                          date &&
                          typeof date === "object" &&
                          "getTime" in date
                        ) {
                          const newDate = new Date(date.getTime());
                          newDate.setHours(0, 0, 0, 0);
                          setFundingStartDate(newDate);
                        } else {
                          setFundingStartDate(date);
                        }
                      }}
                      // Allow selecting today and future dates (can overlap with application period per PRD)
                      disabled={
                        isPublished
                          ? true
                          : {
                              before: new Date(new Date().setHours(0, 0, 0, 0)),
                            }
                      }
                    />
                  </div>
                </div>
                <div className="w-3 h-px bg-muted-foreground self-end mb-5" />

                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">
                    Due Date <span className="text-primary">*</span>
                  </p>
                  <div className="flex-1">
                    <DatePicker
                      date={fundingDueDate}
                      setDate={(date) => {
                        if (
                          date &&
                          typeof date === "object" &&
                          "getTime" in date
                        ) {
                          const newDate = new Date(date.getTime());
                          newDate.setHours(23, 59, 59, 999);
                          setFundingDueDate(newDate);
                        } else {
                          setFundingDueDate(date);
                        }
                      }}
                      disabled={
                        isPublished
                          ? true
                          : {
                              // Funding end must be same day or after funding start
                              before: fundingStartDate
                                ? fundingStartDate
                                : new Date(new Date().setHours(0, 0, 0, 0)),
                            }
                      }
                    />
                  </div>
                </div>
              </div>
            </label>

            <label htmlFor="validator" className="space-y-2 block">
              <p className="text-sm font-medium">
                Validators <span className="text-primary">*</span>
                {data?.program?.educhainProgramId !== null &&
                  data?.program?.educhainProgramId !== undefined && (
                    <span className="text-muted-foreground text-xs ml-2">
                      (Locked - Program already published to blockchain)
                    </span>
                  )}
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
                singleSelect={true}
                disabled={
                  isPublished ||
                  (data?.program?.educhainProgramId !== null &&
                    data?.program?.educhainProgramId !== undefined)
                }
              />
              {extraErrors.validator && (
                <span className="text-destructive text-sm block">
                  Validator is required
                </span>
              )}
              {data?.program?.educhainProgramId !== null &&
                data?.program?.educhainProgramId !== undefined && (
                  <span className="text-muted-foreground text-xs block mt-1">
                    Validators cannot be changed after the host has signed the
                    program on blockchain.
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
                    disabled={isPublished}
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
                onClick={() => setLinks((prev) => [...prev, ""])}
                type="button"
                variant="outline"
                size="sm"
                className="rounded-[6px]"
                disabled={isPublished}
              >
                Add URL
              </Button>
              {extraErrors.links && (
                <span className="text-destructive text-sm block">
                  Links is required
                </span>
              )}
              {extraErrors.invalidLink && (
                <span className="text-destructive text-sm block">
                  The provided link is not valid. All links must begin with{" "}
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
                {...register("summary", { required: true })}
              />
              {errors.summary && (
                <span className="text-destructive text-sm block">
                  Summary is required
                </span>
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
                <span className="text-destructive text-sm block">
                  Description is required
                </span>
              )}
            </label>
          </div>
        </TabsContent>

        {!isPublished && (
          <TabsContent value="condition">
            <div className="bg-white px-10 py-8 rounded-lg mb-3">
              <label htmlFor="price" className="space-y-2 block">
                <p className="text-sm font-medium text-muted-foreground">
                  Maximum funding amount for the project
                </p>
                <div className="flex gap-2 items-end">
                  <div className="w-1/2">
                    <p className="text-sm font-medium mb-2">
                      Network <span className="text-primary">*</span>
                    </p>
                    <NetworkSelector
                      disabled={
                        isEdit &&
                        data?.program?.status !== ProgramStatus.Pending
                      }
                      value={
                        networksWithTokens.find((n) => n.chainName === network)
                          ?.id ||
                        networksWithTokens.find(
                          (n) => n.chainName === mainnetDefaultNetwork
                        )?.id ||
                        undefined
                      }
                      onValueChange={(value: string) => {
                        const selectedNetwork = networksWithTokens.find(
                          (n) => n.id === value
                        );
                        if (selectedNetwork) {
                          setNetwork(selectedNetwork.chainName);
                          // Reset currency when network changes
                          const availableTokens = selectedNetwork.tokens || [];
                          const nativeToken = availableTokens.find(
                            (t) =>
                              t.tokenAddress === ethers.constants.AddressZero
                          );
                          if (nativeToken) {
                            setCurrency(nativeToken.id);
                          }
                        }
                      }}
                      networks={networksWithTokens}
                      className="min-w-[120px] h-10 w-full flex justify-between bg-white text-gray-dark border border-input shadow-sm hover:bg-white"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">
                      Terms <span className="text-primary">*</span>
                    </p>
                    <Input
                      disabled={
                        isEdit &&
                        data?.program?.status !== ProgramStatus.Pending
                      }
                      step={0.000000000000000001}
                      id="price"
                      type="number"
                      min={0}
                      placeholder="Enter price"
                      className="h-10 w-full"
                      {...register("price", { required: true })}
                    />
                  </div>
                  <CurrencySelector
                    disabled={
                      isEdit && data?.program?.status !== ProgramStatus.Pending
                    }
                    value={currency}
                    onValueChange={setCurrency}
                    tokens={
                      networksWithTokens.find((n) => n.chainName === network)
                        ?.tokens ||
                      networksWithTokens.find(
                        (n) => n.chainName === mainnetDefaultNetwork
                      )?.tokens ||
                      []
                    }
                    className="w-[108px] h-10"
                  />
                </div>

                {errors.price && (
                  <span className="text-destructive text-sm block">
                    Price is required
                  </span>
                )}
                {isEdit && data?.program?.status !== ProgramStatus.Pending && (
                  <span className="text-destructive text-sm block">
                    Price can't be updated after publishing.
                  </span>
                )}
              </label>
            </div>

            <div className="bg-white px-10 py-6 rounded-lg mb-3">
              <label htmlFor="condition" className="space-y-2 block mb-10">
                <p className="text-sm font-medium text-muted-foreground mb-8">
                  Setting up condition <span className="text-primary">*</span>
                </p>
                <RadioGroup
                  defaultValue="open"
                  className="space-y-4"
                  value={conditionType}
                  onValueChange={(value) =>
                    setConditionType(value as "open" | "tier")
                  }
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
                        onChange={(e) =>
                          handleTierChange(tier.name, e.target.checked)
                        }
                        disabled={conditionType !== "tier"}
                        className="rounded w-4 h-4 mt-1"
                      />
                      <div>
                        <Label
                          htmlFor={tier.name}
                          className={cn(
                            "flex-1",
                            conditionType !== "tier" && "text-muted-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              tier.name === "Bronze" &&
                                "bg-amber-100 text-amber-800",
                              tier.name === "Silver" &&
                                "bg-slate-100 text-slate-800",
                              tier.name === "Gold" &&
                                "bg-orange-100 text-orange-800",
                              tier.name === "Platinum" &&
                                "bg-emerald-100 text-emerald-800"
                            )}
                          >
                            {tier.name}
                          </span>{" "}
                          can invest
                        </Label>
                        <div className="flex items-center gap-4">
                          <span
                            className={cn(
                              "text-sm mb-1",
                              conditionType !== "tier" || !tier.enabled
                                ? "text-muted-foreground"
                                : "text-foreground"
                            )}
                          >
                            Maximum amount
                          </span>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={tier.maxAmount || ""}
                            onChange={(e) =>
                              handleTierAmountChange(tier.name, e.target.value)
                            }
                            disabled={conditionType !== "tier" || !tier.enabled}
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
                <p className="text-sm font-medium text-muted-foreground mb-8">
                  Fee settings *
                </p>
                <RadioGroup
                  defaultValue="default"
                  className="space-y-4"
                  value={feeType}
                  onValueChange={(value) =>
                    setFeeType(value as "default" | "custom")
                  }
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
                    value={customFee || ""}
                    onChange={(e) => setCustomFee(e.target.value)}
                    disabled={feeType !== "custom"}
                    className="w-32 h-8"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      feeType !== "custom" && "text-muted-foreground"
                    )}
                  >
                    %
                  </span>
                </div>
              </label>
            </div>
          </TabsContent>
        )}
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
                    programName: watch("programName") ?? "",
                    price: watch("price") ?? "",
                    description: content ?? "",
                    summary: watch("summary") ?? "",
                    currency,
                    deadline: deadline?.toISOString(),
                    keywords: selectedKeywords,
                    validators: selectedValidators,
                    selectedValidatorItems,
                    links,
                    network,
                    visibility,
                    builders: selectedBuilders,
                    selectedBuilderItems,
                    applicationStartDate: applicationStartDate?.toISOString(),
                    applicationEndDate: applicationDueDate?.toISOString(),
                    fundingStartDate: fundingStartDate?.toISOString(),
                    fundingEndDate: fundingDueDate?.toISOString(),
                    fundingCondition: conditionType,
                    tierSettings:
                      conditionType === "tier"
                        ? {
                            bronze: tiers.find((t) => t.name === "Bronze")
                              ?.enabled
                              ? {
                                  enabled: true,
                                  maxAmount:
                                    tiers.find((t) => t.name === "Bronze")
                                      ?.maxAmount || "0",
                                }
                              : undefined,
                            silver: tiers.find((t) => t.name === "Silver")
                              ?.enabled
                              ? {
                                  enabled: true,
                                  maxAmount:
                                    tiers.find((t) => t.name === "Silver")
                                      ?.maxAmount || "0",
                                }
                              : undefined,
                            gold: tiers.find((t) => t.name === "Gold")?.enabled
                              ? {
                                  enabled: true,
                                  maxAmount:
                                    tiers.find((t) => t.name === "Gold")
                                      ?.maxAmount || "0",
                                }
                              : undefined,
                            platinum: tiers.find((t) => t.name === "Platinum")
                              ?.enabled
                              ? {
                                  enabled: true,
                                  maxAmount:
                                    tiers.find((t) => t.name === "Platinum")
                                      ?.maxAmount || "0",
                                }
                              : undefined,
                          }
                        : undefined,
                    feeType,
                    customFee,
                  };
                  saveInvestmentDraft(draft);
                  notify("Draft saved (image is not included).");
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

        {selectedTab === "condition" && !isPublished && (
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
              <h2 className="text-foreground font-semibold text-center text-lg">
                Visibility
              </h2>
              <p className="text-center text-muted-foreground text-sm mb-4">
                Choose when to publish and who can see your program.
              </p>

              <RadioGroup
                defaultValue="public"
                className="space-y-2 mb-8"
                value={visibility}
                onValueChange={(v) =>
                  setVisibility(v as "public" | "private" | "restricted")
                }
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value="private"
                    id="r1"
                    className="border-foreground"
                  />
                  <div className="flex-1">
                    <Label htmlFor="r1" className="font-medium mb-[6px]">
                      Private
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Only invited users can view this program.
                    </p>
                    {visibility === "private" && (
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
                  <RadioGroupItem
                    value="restricted"
                    id="r2"
                    className="border-foreground"
                  />
                  <div>
                    <Label htmlFor="r2">Restricted</Label>
                    <p className="text-sm text-muted-foreground">
                      Only users with links can view.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value="public"
                    id="r3"
                    className="border-foreground"
                  />
                  <div>
                    <Label htmlFor="r3">Public</Label>
                    <p className="text-sm text-muted-foreground">
                      Anyone can view this program.
                    </p>
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

        {selectedTab === "overview" && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setSelectedTab("details")}
            disabled={!isOverviewTabValid()}
          >
            Next to Details <ChevronRight />
          </Button>
        )}

        {selectedTab === "details" && !isPublished && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => setSelectedTab("condition")}
            disabled={!isDetailsTabValid()}
          >
            Next to Condition <ChevronRight />
          </Button>
        )}

        {selectedTab === "details" && isPublished && (
          <Button
            type="button"
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              extraValidation();
            }}
          >
            Save Changes
          </Button>
        )}
      </div>
    </form>
  );
}

export default InvestmentForm;

enum ExtraErrorActionKind {
  SET_KEYWORDS_ERROR = "SET_KEYWORDS_ERROR",
  SET_VALIDATOR_ERROR = "SET_VALIDATOR_ERROR",
  SET_DEADLINE_ERROR = "SET_DEADLINE_ERROR",
  SET_LINKS_ERROR = "SET_LINKS_ERROR",
  CLEAR_ERRORS = "CLEAR_ERRORS",
  SET_INVALID_LINK_ERROR = "SET_INVALID_LINK_ERROR",
  SET_DATE_ERROR = "SET_DATE_ERROR",
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
  dates: boolean;
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
    case ExtraErrorActionKind.SET_DATE_ERROR:
      return {
        ...state,
        dates: true,
      };
    case ExtraErrorActionKind.CLEAR_ERRORS:
      return {
        keyword: false,
        validator: false,
        deadline: false,
        links: false,
        invalidLink: false,
        dates: false,
      };
    default:
      return state;
  }
}
