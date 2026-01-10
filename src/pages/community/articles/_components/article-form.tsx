import { useArticleQuery } from "@/apollo/queries/article.generated";
import InputLabel from "@/components/common/label/inputLabel";
import { MarkdownEditor } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";
import { ArticleType } from "@/types/types.generated";
import { ChevronDown, Image as ImageIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

export type OnSubmitArticleFunc = (
  data: {
    id?: string;
    title: string;
    description: string;
    coverImage: File | undefined;
    category: ArticleType;
    isPin: boolean;
  },
  action: "draft" | "publish"
) => void;

export interface ArticleFormProps {
  isEdit: boolean;
  onSubmitArticle: OnSubmitArticleFunc;
  loading?: boolean;
}

type ArticleFormData = {
  title: string;
  description: string;
  category: ArticleType;
  isPin: boolean;
};

function ArticleForm({ onSubmitArticle, isEdit, loading }: ArticleFormProps) {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const { data } = useArticleQuery({
    variables: {
      id: id ?? "",
    },
    skip: !isEdit,
  });

  const [selectedImage, setSelectedImage] = useState<File>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (data?.article?.coverImage) {
      setImagePreview(data.article.coverImage);
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ArticleFormData>({
    values: {
      title: data?.article?.title ?? "",
      description: data?.article?.description ?? "",
      category: data?.article?.type ?? ArticleType.Article,
      isPin: data?.article?.isPin ?? false,
    },
  });

  const description = watch("description");
  const category = watch("category");
  const isPin = watch("isPin");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImageError("Only PNG, JPG, or JPEG files are allowed.");
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setImageError("Image must be under 4MB.");
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      if (category === ArticleType.Campaign) {
        if (img.width <= 333 || img.height <= 333) {
          setImageError("Cover image must be 333x333 px.");
          setSelectedImage(undefined);
          setImagePreview(null);
          return;
        }
      } else {
        if (img.width <= 510 || img.height <= 367) {
          setImageError("Cover image must be at least 510×367 px.");
          setSelectedImage(undefined);
          setImagePreview(null);
          return;
        }
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    };
    img.onerror = () => {
      setImageError("Invalid image file.");
      setSelectedImage(undefined);
      setImagePreview(null);
    };
    img.src = URL.createObjectURL(file);
  };

  const onSubmit = (formData: ArticleFormData, action: "draft" | "publish") => {
    if (!formData.description.trim()) return;

    onSubmitArticle(
      {
        id: data?.article?.id ?? id,
        title: formData.title,
        description: formData.description,
        coverImage: selectedImage,
        category: formData.category,
        isPin: formData.isPin,
      },
      action
    );
  };

  return (
    <form className="w-full mx-auto">
      <h1 className="font-bold text-xl mb-6">
        {isEdit ? "Edit Article" : "Create Article"}
      </h1>

      <section className="bg-white py-8 px-10 rounded-lg mb-2">
        {isAdmin && (
          <div className="flex items-end gap-6 mb-8">
            <div className="space-y-2 block">
              <Label className="text-sm font-medium">Category</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[400px] justify-between h-10"
                  >
                    {category === ArticleType.Article && "Article"}
                    {category === ArticleType.Newsletter && "Newsletter"}
                    {category === ArticleType.Campaign && "Campaign"}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px]">
                  <DropdownMenuItem
                    onClick={() => setValue("category", ArticleType.Article)}
                  >
                    Article
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setValue("category", ArticleType.Newsletter)}
                  >
                    Newsletter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setValue("category", ArticleType.Campaign)}
                  >
                    Campaign
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="isPin"
                checked={isPin}
                onCheckedChange={(checked) =>
                  setValue("isPin", checked as boolean)
                }
              />
              <Label
                htmlFor="isPin"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pin to top of category
              </Label>
            </div>
          </div>
        )}

        <InputLabel
          labelId="title"
          title="Title"
          className="mb-8"
          isPrimary
          isError={errors.title}
          placeholder="Enter article title (maximum 130 characters)"
          register={register}
        />

        <label htmlFor="image" className="space-y-2">
          <div className="flex items-start gap-6">
            <div
              className={`relative flex items-center justify-center bg-[#eaeaea] rounded-lg overflow-hidden group ${
                category === ArticleType.Campaign
                  ? "w-[180px] h-[180px]"
                  : "w-[320px] h-[180px]"
              }`}
            >
              <input
                id="image"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleImageChange}
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
            <div className="flex-1">
              <p className="font-medium text-base">
                Cover image<span className="ml-[2px] text-red-500">*</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {`Cover image must be at least ${
                  category === ArticleType.Campaign
                    ? "333x333 px"
                    : "510×367 px"
                }, under 4MB, and in PNG, JPG, or JPEG format.`}
              </p>
              {imageError && (
                <span className="text-destructive text-sm block mt-2">
                  {imageError}
                </span>
              )}
            </div>
          </div>
        </label>
      </section>

      <section className="bg-white py-8 px-10 rounded-lg mb-2">
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
              setValue("description", value);
            }}
            content={description}
          />
        </InputLabel>
      </section>

      {isEdit ? (
        <div className="py-3 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="min-w-[120px]"
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            className="min-w-[120px]"
            onClick={handleSubmit((data) => onSubmit(data, "publish"))}
            disabled={loading}
          >
            Update Article
          </Button>
        </div>
      ) : (
        <div className="py-3 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="min-w-[120px]"
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            disabled={loading}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            className="min-w-[120px]"
            onClick={handleSubmit((data) => onSubmit(data, "publish"))}
            disabled={loading}
          >
            Publish
          </Button>
        </div>
      )}
    </form>
  );
}

export default ArticleForm;
