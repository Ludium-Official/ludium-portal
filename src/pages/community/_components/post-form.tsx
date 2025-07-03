import { useCreateCarouselItemMutation } from '@/apollo/mutation/create-carousel-item.generated';
import { useCarouselItemsQuery } from '@/apollo/queries/carousel-items.generated';
import { useKeywordsQuery } from '@/apollo/queries/keywords.generated';
import { usePostQuery } from '@/apollo/queries/post.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { CarouselItemType } from '@/types/types.generated';
import { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

export type OnSubmitPostFunc = (data: {
  id?: string;
  title: string;
  summary: string;
  content: string;
  keywords: string[];
  image: File | undefined;
  isBanner?: boolean;
}) => void;

export interface PostFormProps {
  isEdit: boolean;
  onSubmitPost: OnSubmitPostFunc;
}

function PostForm({ onSubmitPost, isEdit }: PostFormProps) {
  const { id } = useParams();

  // const [isBanner, setIsBanner] = useState<boolean>();

  const { data: carouselItems, refetch } = useCarouselItemsQuery();

  const [createCarouselItem] = useCreateCarouselItemMutation();

  const { data } = usePostQuery({
    variables: {
      id: id ?? '',
    },
    skip: !isEdit,
  });

  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (data?.post?.content) {
      setContent(data?.post?.content);
    }
  }, [data]);

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File>();

  const { data: keywords } = useKeywordsQuery();
  const [extraErrors, dispatchErrors] = useReducer(extraErrorReducer, {
    keyword: false,
  });

  const keywordOptions = keywords?.keywords?.map((k) => ({
    value: k.id ?? '',
    label: k.name ?? '',
  }));

  useEffect(() => {
    if (data?.post?.keywords)
      setSelectedKeywords(data?.post?.keywords?.map((k) => k.id ?? '') ?? []);
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      title: data?.post?.title ?? '',
      summary: data?.post?.summary ?? '',
    },
  });

  const onSubmit = (submitData: {
    title: string;
    summary: string;
  }) => {
    if (extraErrors.keyword) return;
    if (!content.length) return;

    onSubmitPost({
      id: data?.post?.id ?? id,
      title: submitData.title,
      summary: submitData.summary,
      content,
      keywords: selectedKeywords,
      image: selectedImage,
      // isBanner,
    });
  };

  const extraValidation = () => {
    dispatchErrors({ type: ExtraErrorActionKind.CLEAR_ERRORS });
    if (!selectedKeywords?.length)
      dispatchErrors({ type: ExtraErrorActionKind.SET_KEYWORDS_ERROR });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-medium text-xl mb-6">{isEdit ? 'Edit Post' : 'Create Post'}</h1>

      <label htmlFor="title" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Post title</p>
        <Input
          id="title"
          type="text"
          placeholder="Type title"
          className="h-10"
          {...register('title', { required: true })}
        />
        {errors.title && <span className="text-red-400 text-sm block">Title is required</span>}
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
          <span className="text-red-400 text-sm block">Keywords is required</span>
        )}
      </label>

      <label htmlFor="summary" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Summary</p>
        <Input
          id="summary"
          type="text"
          placeholder="Type title"
          className="h-10"
          {...register('summary', { required: true })}
        />
        {errors.title && <span className="text-red-400 text-sm block">Summary is required</span>}
      </label>

      <label htmlFor="content" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Content</p>

        <MarkdownEditor onChange={setContent} content={content} />

        {!content.length && <span className="text-red-400 text-sm block">Content is required</span>}
      </label>

      <label htmlFor="image" className="space-y-2 block mb-10">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" onChange={(e) => setSelectedImage(e.target.files?.[0])} />
        </div>
      </label>

      {/* <div className="flex items-center space-x-2">
        <Checkbox
          id="isBanner"
          checked={isBanner}
          onCheckedChange={(value) => setIsBanner(value === 'indeterminate' ? undefined : value)}
        />
        <label
          htmlFor="isBanner"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Set post as main banner
        </label>
      </div> */}

      {isEdit && (
        <Button
          type="button"
          onClick={() => {
            createCarouselItem({
              variables: {
                input: {
                  itemId: data?.post?.id ?? '',
                  itemType: CarouselItemType.Post,
                  isActive: true,
                },
              },
            }).then(() => refetch());
          }} disabled={carouselItems?.carouselItems?.some(item => item.itemId === data?.post?.id || (carouselItems?.carouselItems?.length ?? 0) >= 5)}>
          {carouselItems?.carouselItems?.some(item => item.itemId === data?.post?.id) ? "Already in Carousel" : "Add to Main Carousel"}
        </Button>
      )}

      {isEdit ? (
        <div className="px-[32px] py-3 flex justify-end gap-4">
          <Button
            variant="purple"
            className="min-w-[177px]"
            type="submit"
            onClick={() => {
              extraValidation();
            }}
          >
            Edit Post
          </Button>
        </div>
      ) : (
        <div className="py-3 flex justify-end gap-4">
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

export default PostForm;

enum ExtraErrorActionKind {
  SET_KEYWORDS_ERROR = 'SET_KEYWORDS_ERROR',
  CLEAR_ERRORS = 'CLEAR_ERRORS',
}

interface ExtraErrorAction {
  type: ExtraErrorActionKind;
}

interface ExtraErrorState {
  keyword: boolean;
}

function extraErrorReducer(state: ExtraErrorState, action: ExtraErrorAction) {
  const { type } = action;
  switch (type) {
    case ExtraErrorActionKind.SET_KEYWORDS_ERROR:
      return {
        ...state,
        keyword: true,
      };
    case ExtraErrorActionKind.CLEAR_ERRORS:
      return {
        ...state,
        keyword: false,
      };
    default:
      return state;
  }
}
