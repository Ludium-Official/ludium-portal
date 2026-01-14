import { useArticleQuery } from '@/apollo/queries/article.generated';
import { usePinnedArticlesQuery } from '@/apollo/queries/pinned-articles.generated';
import InputLabel from '@/components/common/label/inputLabel';
import { MarkdownEditor } from '@/components/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/hooks/use-auth';
import { ArticleType } from '@/types/types.generated';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Image as ImageIcon, Pin, PinOff, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router';

export type OnSubmitArticleFunc = (
  data: {
    id?: string;
    title: string;
    description: string;
    coverImage: File | undefined;
    category: ArticleType;
    isPin: boolean;
    unpinArticleId?: string;
  },
  action: 'draft' | 'publish',
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
      id: id ?? '',
    },
    skip: !isEdit,
  });

  const { data: pinnedData } = usePinnedArticlesQuery({
    variables: { type: data?.article?.type ?? ArticleType.Article },
  });

  const [selectedImage, setSelectedImage] = useState<File>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedUnpinId, setSelectedUnpinId] = useState<string | null>(null);
  const [pendingFormData, setPendingFormData] = useState<ArticleFormData | null>(null);
  const [pendingAction, setPendingAction] = useState<'draft' | 'publish' | null>(null);

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
      title: data?.article?.title ?? '',
      description: data?.article?.description ?? '',
      category: data?.article?.type ?? ArticleType.Article,
      isPin: data?.article?.isPin ?? false,
    },
  });

  const title = watch('title');
  const description = watch('description');
  const category = watch('category');
  const isPin = watch('isPin');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setImageError('Only PNG, JPG, or JPEG files are allowed.');
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setImageError('Image must be under 4MB.');
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      if (category === ArticleType.Campaign) {
        if (img.width <= 333 || img.height <= 333) {
          setImageError('Cover image must be 333x333 px.');
          setSelectedImage(undefined);
          setImagePreview(null);
          return;
        }
      } else {
        if (img.width <= 510 || img.height <= 367) {
          setImageError('Cover image must be at least 510×367 px.');
          setSelectedImage(undefined);
          setImagePreview(null);
          return;
        }
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    };
    img.onerror = () => {
      setImageError('Invalid image file.');
      setSelectedImage(undefined);
      setImagePreview(null);
    };
    img.src = URL.createObjectURL(file);
  };

  const pinnedArticlesInCategory =
    pinnedData?.pinnedArticles?.filter(
      (article) => article.type === category && article.id !== id,
    ) ?? [];

  const onSubmit = (formData: ArticleFormData, action: 'draft' | 'publish') => {
    if (!formData.description.trim()) return;

    // If trying to pin and already 2 pinned articles exist
    // Skip modal if article was already pinned (edit mode)
    const wasAlreadyPinned = isEdit && data?.article?.isPin;
    if (!wasAlreadyPinned && formData.isPin && pinnedArticlesInCategory.length >= 2) {
      setPendingFormData(formData);
      setPendingAction(action);
      setShowPinModal(true);
      return;
    }

    onSubmitArticle(
      {
        id: data?.article?.id ?? id,
        title: formData.title,
        description: formData.description,
        coverImage: selectedImage,
        category: formData.category,
        isPin: formData.isPin,
      },
      action,
    );
  };

  const handlePinModalConfirm = () => {
    if (!pendingFormData || !pendingAction || !selectedUnpinId) return;

    onSubmitArticle(
      {
        id: data?.article?.id ?? id,
        title: pendingFormData.title,
        description: pendingFormData.description,
        coverImage: selectedImage,
        category: pendingFormData.category,
        isPin: pendingFormData.isPin,
        unpinArticleId: selectedUnpinId,
      },
      pendingAction,
    );

    setShowPinModal(false);
    setPendingFormData(null);
    setPendingAction(null);
    setSelectedUnpinId(null);
  };

  return (
    <form className="w-full mx-auto">
      <div className="flex items-center w-fit mb-17 text-sm text-muted-foreground">
        <Link to="/community/articles">Articles</Link>
        {isEdit && (
          <>
            <ChevronRight className="w-4 mx-2" />
            <Link to={`/community/articles/${id}`}>
              {title && title.length > 20 ? `${title.slice(0, 20)}...` : title}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 mx-2" />
        <span className="text-foreground">{isEdit ? 'Edit Article' : 'Create Article'}</span>
      </div>

      <section className="px-12 mb-2">
        {isAdmin && (
          <div className="flex items-end gap-6 mb-8">
            <InputLabel labelId="category" title="Category" inputClassName="hidden" isPrimary>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[400px] justify-between h-10">
                    {category === ArticleType.Article && 'Article'}
                    {category === ArticleType.Newsletter && 'Newsletter'}
                    {category === ArticleType.Campaign && 'Campaign'}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px]">
                  <DropdownMenuItem onClick={() => setValue('category', ArticleType.Article)}>
                    Article
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setValue('category', ArticleType.Newsletter)}>
                    Newsletter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setValue('category', ArticleType.Campaign)}>
                    Campaign
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </InputLabel>

            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="isPin"
                checked={isPin}
                onCheckedChange={(checked) => setValue('isPin', checked as boolean)}
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
          <div className="flex items-start gap-6 mb-8">
            <div
              className={`relative flex items-center justify-center bg-[#eaeaea] rounded-lg overflow-hidden group ${
                category === ArticleType.Campaign ? 'w-[180px] h-[180px]' : 'w-[320px] h-[180px]'
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
            <div className="flex-1">
              <p className="font-medium text-base">
                Cover image<span className="ml-[2px] text-red-500">*</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {`Cover image must be at least ${
                  category === ArticleType.Campaign ? '333x333 px' : '510×367 px'
                }, under 4MB, and in PNG, JPG, or JPEG format.`}
              </p>
              {imageError && (
                <span className="text-destructive text-sm block mt-2">{imageError}</span>
              )}
            </div>
          </div>
        </label>

        <InputLabel
          labelId="description"
          title="Description"
          isPrimary
          isError={errors.description}
          placeholder="Description"
          inputClassName="hidden"
          className="mb-8"
        >
          <MarkdownEditor
            onChange={(value: string) => {
              setValue('description', value);
            }}
            content={description}
          />
        </InputLabel>

        {isEdit ? (
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="min-w-[120px]"
              onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
              disabled={loading}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              className="min-w-[120px]"
              onClick={handleSubmit((data) => onSubmit(data, 'publish'))}
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
              onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
              disabled={loading}
            >
              Save Draft
            </Button>
            <Button
              type="button"
              className="min-w-[120px]"
              onClick={handleSubmit((data) => onSubmit(data, 'publish'))}
              disabled={loading}
            >
              Publish
            </Button>
          </div>
        )}
      </section>

      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="sm:max-w-[600px] px-10 py-6 gap-1">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Pinned article limit reached
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => {
                setShowPinModal(false);
                setSelectedUnpinId(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="flex flex-col gap-7">
            <p className="text-sm">
              You can pin up to <strong>2 articles</strong> per category.
              <br />
              To pin this article, please unpin one of the articles below.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {pinnedArticlesInCategory.slice(0, 2).map((article) => (
                <div
                  key={article.id}
                  onClick={() => {
                    if (!article.id) return;
                    setSelectedUnpinId(selectedUnpinId === article.id ? null : article.id);
                  }}
                  className={`cursor-pointer rounded-lg px-5 pt-3 pb-5 border-1 transition-colors ${
                    selectedUnpinId === article.id
                      ? 'border-none bg-gray-100 opacity-50'
                      : 'border-primary bg-primary-light'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center bg-white w-10 h-10 mb-3 rounded-md border ${
                      selectedUnpinId === article.id ? 'border-gray-600' : 'border-primary'
                    }`}
                  >
                    {selectedUnpinId === article.id ? (
                      <PinOff className="w-4 h-4 fill-gray-600 text-gray-600" />
                    ) : (
                      <Pin className="w-4 h-4 fill-primary text-primary" />
                    )}
                  </div>
                  <div className="aspect-[5/3] rounded-md overflow-hidden mb-3">
                    <img
                      src={article.coverImage || ''}
                      alt={article.title || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={article.author?.profileImage || ''} />
                      <AvatarFallback className="text-xs">
                        {article.author?.nickname?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {article.author?.nickname || 'Anonymous'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm line-clamp-2">{article.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {article.createdAt ? format(new Date(article.createdAt), 'MMMM dd, yyyy') : ''}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPinModal(false);
                  setSelectedUnpinId(null);
                }}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePinModalConfirm}
                disabled={!selectedUnpinId || loading}
                size="sm"
              >
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}

export default ArticleForm;
