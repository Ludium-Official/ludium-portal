import { useKeywordsQuery } from '@/apollo/queries/keywords.generated';
import { usePostQuery } from '@/apollo/queries/post.generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

export type OnSubmitPostFunc = (data: {
  id?: string;
  title: string;
  content: string;
  keywords: string[];
  image: File | undefined;
}) => void;

export interface PostFormProps {
  isEdit: boolean;
  onSubmitPost: OnSubmitPostFunc;
}

function PostForm({ onSubmitPost, isEdit }: PostFormProps) {
  const { id } = useParams();

  const { data } = usePostQuery({
    variables: {
      id: id ?? '',
    },
    skip: !isEdit,
  });

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
      content: data?.post?.content ?? '',
    },
  });

  const onSubmit = (submitData: {
    title: string;
    content: string;
  }) => {
    if (extraErrors.keyword) return;

    onSubmitPost({
      id: data?.post?.id ?? id,
      title: submitData.title,
      content: submitData.content,
      keywords: selectedKeywords,
      image: selectedImage,
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

      <label htmlFor="content" className="space-y-2 block mb-10">
        <p className="text-sm font-medium">Content</p>
        <Textarea
          id="content"
          placeholder="Type content"
          rows={15}
          {...register('content', { required: true })}
        />
        {errors.content && <span className="text-red-400 text-sm block">Content is required</span>}
      </label>

      <label htmlFor="image" className="space-y-2 block mb-10">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" onChange={(e) => setSelectedImage(e.target.files?.[0])} />
        </div>
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
