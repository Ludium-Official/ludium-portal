import { useKeywordsQuery } from "@/apollo/queries/keywords.generated";
import { useProgramQuery } from "@/apollo/queries/program.generated";
import { useUsersQuery } from "@/apollo/queries/users.generated";
import CurrencySelector from "@/components/currency-selector";
import MarkdownEditor from "@/components/markdown-editor";
import NetworkSelector from "@/components/network-selector";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchSelect } from "@/components/ui/search-select";
import type { LinkInput } from "@/types/types.generated";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

export type OnSubmitProgramFunc = (data: {
  id?: string;
  programName: string;
  price?: string;
  description: string;
  summary: string;
  currency: string;
  deadline?: string;
  keywords: string[];
  validatorId: string;
  links: LinkInput[];
  // isPublish?: boolean;
  network: string;
}) => void;

export interface ProgramFormProps {
  isEdit: boolean;
  onSubmitProgram: OnSubmitProgramFunc;
}

function ProgramForm({ onSubmitProgram, isEdit }: ProgramFormProps) {
  const [content, setContent] = useState<string>("");

  const { id } = useParams();

  const { data } = useProgramQuery({
    variables: {
      id: id ?? "",
    },
    skip: !isEdit,
  });

  const [deadline, setDeadline] = useState<Date>();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedValidator, setSelectedValidator] = useState<string>();
  const [links, setLinks] = useState<string[]>([""]);
  const [network, setNetwork] = useState("educhain");
  const [currency, setCurrency] = useState("");

  const { data: keywords } = useKeywordsQuery();
  const { data: validators } = useUsersQuery();
  const [extraErrors, dispatchErrors] = useReducer(extraErrorReducer, {
    keyword: false,
    deadline: false,
    validator: false,
    links: false,
    invalidLink: false,
  });

  const keywordOptions = keywords?.keywords?.map((k) => ({
    value: k.id ?? "",
    label: k.name ?? "",
  }));
  const validatorOptions = validators?.users?.data?.map((v) => ({
    value: v.id ?? "",
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ""}`,
  }));

  useEffect(() => {
    if (data?.program?.keywords)
      setSelectedKeywords(
        data?.program?.keywords?.map((k) => k.id ?? "") ?? []
      );
    if (data?.program?.validator)
      setSelectedValidator(data?.program.validator.id ?? "");
    if (data?.program?.deadline) setDeadline(new Date(data?.program?.deadline));
    if (data?.program?.links)
      setLinks(data?.program?.links.map((l) => l.url ?? ""));
    if (data?.program?.network) setNetwork(data?.program?.network);
    if (data?.program?.currency) setCurrency(data?.program?.currency);
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    if (
      extraErrors.deadline ||
      extraErrors.keyword ||
      extraErrors.links ||
      extraErrors.validator ||
      extraErrors.invalidLink ||
      !content.length
    )
      return;

    onSubmitProgram({
      id: data?.program?.id ?? id,
      programName: submitData.programName,
      price:
        isEdit && data?.program?.status !== "draft"
          ? undefined
          : submitData.price,
      description: content,
      summary: submitData.summary,
      currency:
        isEdit && data?.program?.status !== "draft"
          ? (data?.program?.currency as string)
          : currency,
      deadline: deadline ? format(deadline, "yyyy-MM-dd") : undefined,
      keywords: selectedKeywords,
      validatorId: selectedValidator ?? "",
      links: links.map((l) => ({ title: l, url: l })),
      network:
        isEdit && data?.program?.status !== "draft"
          ? (data?.program?.network as string)
          : network,
    });
  };

  const extraValidation = () => {
    dispatchErrors({ type: ExtraErrorActionKind.CLEAR_ERRORS });
    if (!selectedKeywords?.length)
      dispatchErrors({ type: ExtraErrorActionKind.SET_KEYWORDS_ERROR });
    if (!selectedValidator)
      dispatchErrors({ type: ExtraErrorActionKind.SET_VALIDATOR_ERROR });
    if (!deadline)
      dispatchErrors({ type: ExtraErrorActionKind.SET_DEADLINE_ERROR });
    if (!links?.[0])
      dispatchErrors({ type: ExtraErrorActionKind.SET_LINKS_ERROR });
    if (links?.some((l) => !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(l))) {
      dispatchErrors({ type: ExtraErrorActionKind.SET_INVALID_LINK_ERROR });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-medium text-xl mb-6">
        {isEdit ? "Edit Program" : "Create Program"}
      </h1>

      <label htmlFor="programName" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Program name</p>
        <Input
          id="programName"
          type="text"
          placeholder="Type name"
          className="h-10"
          {...register("programName", { required: true })}
        />
        {errors.programName && (
          <span className="text-red-400 text-sm block">
            Program name is required
          </span>
        )}
      </label>

      <label htmlFor="keyword" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Keywords</p>
        <MultiSelect
          options={keywordOptions ?? []}
          value={selectedKeywords}
          onValueChange={setSelectedKeywords}
          placeholder="Select keywords"
          animation={2}
          maxCount={3}
        />
        {extraErrors.keyword && (
          <span className="text-red-400 text-sm block">
            Keywords is required
          </span>
        )}
      </label>

      <label htmlFor="price" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Price</p>
        <div className="flex gap-2">
          <Input
            disabled={isEdit && data?.program?.status !== "draft"}
            step={0.000000000000000001}
            id="price"
            type="number"
            min={0}
            placeholder="Enter price"
            className="h-10"
            {...register("price", { required: true })}
          />
          <NetworkSelector
            disabled={isEdit && data?.program?.status !== "draft"}
            value={network}
            onValueChange={setNetwork}
            className="min-w-[120px] h-10"
          />
          <CurrencySelector
            disabled={isEdit && data?.program?.status !== "draft"}
            value={currency}
            onValueChange={setCurrency}
            network={network}
            className="w-[84px] h-10"
          />
        </div>

        {errors.price && (
          <span className="text-red-400 text-sm block">Price is required</span>
        )}
        {isEdit && data?.program?.status !== "draft" && (
          <span className="text-red-400 text-sm block">
            Price can't be updated after publishing.
          </span>
        )}
      </label>

      <label htmlFor="deadline" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Deadline</p>
        <DatePicker
          date={deadline}
          setDate={setDeadline}
          disabled={{ before: new Date() }}
        />
        {extraErrors.deadline && (
          <span className="text-red-400 text-sm block">
            Deadline is required
          </span>
        )}
      </label>

      <label htmlFor="summary" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Summary</p>
        <Input
          id="summary"
          type="text"
          placeholder="Type summary"
          className="h-10"
          {...register("summary", { required: true })}
        />
        {errors.summary && (
          <span className="text-red-400 text-sm block">
            Summary is required
          </span>
        )}
      </label>

      <label htmlFor="description" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Description</p>

        <MarkdownEditor onChange={setContent} content={content} />
        {!content.length && (
          <span className="text-red-400 text-sm block">
            Description is required
          </span>
        )}
      </label>

      <label htmlFor="validator" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Validators</p>
        <SearchSelect
          options={validatorOptions ?? []}
          value={selectedValidator}
          setValue={setSelectedValidator}
        />
        {extraErrors.validator && (
          <span className="text-red-400 text-sm block">
            Validator is required
          </span>
        )}
      </label>

      <label htmlFor="links" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Links</p>
        <span className="block text-[#71717A] text-sm">
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
          onClick={() => setLinks((prev) => [...prev, ""])}
          type="button"
          variant="outline"
          size="sm"
          className="rounded-[6px]"
        >
          Add URL
        </Button>
        {extraErrors.links && (
          <span className="text-red-400 text-sm block">Links is required</span>
        )}
        {extraErrors.invalidLink && (
          <span className="text-red-400 text-sm block">
            The provided link is not valid. All links must begin with{" "}
            <span className="font-bold">https://</span>.
          </span>
        )}
      </label>

      {isEdit ? (
        <div className="px-[32px] py-3 flex justify-end gap-4">
          <Button
            className="bg-[#B331FF] hover:bg-[#B331FF]/90 min-w-[177px]"
            type="submit"
            onClick={() => {
              extraValidation();
            }}
          >
            Edit Program
          </Button>
        </div>
      ) : (
        <div className="px-[32px] py-3 flex justify-end gap-4">
          <Button
            className="min-w-[97px]"
            onClick={() => {
              extraValidation();
            }}
          >
            Save
          </Button>
        </div>
      )}
    </form>
  );
}

export default ProgramForm;

enum ExtraErrorActionKind {
  SET_KEYWORDS_ERROR = "SET_KEYWORDS_ERROR",
  SET_VALIDATOR_ERROR = "SET_VALIDATOR_ERROR",
  SET_DEADLINE_ERROR = "SET_DEADLINE_ERROR",
  SET_LINKS_ERROR = "SET_LINKS_ERROR",
  CLEAR_ERRORS = "CLEAR_ERRORS",
  SET_INVALID_LINK_ERROR = "SET_INVALID_LINK_ERROR",
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
