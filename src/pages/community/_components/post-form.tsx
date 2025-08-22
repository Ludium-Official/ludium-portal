import { usePostQuery } from '@/apollo/queries/post.generated';
import { MarkdownEditor } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

export type OnSubmitPostFunc = (data: {
  id?: string;
  title: string;
  summary?: string;
  content: string;
  keywords?: string[];
  image: File | undefined;
}) => void;

export interface PostFormProps {
  isEdit: boolean;
  onSubmitPost: OnSubmitPostFunc;
}

function PostForm({ onSubmitPost, isEdit }: PostFormProps) {
  const { id } = useParams();

  // const { data: carouselItems, refetch } = useCarouselItemsQuery();

  // const [createCarouselItem] = useCreateCarouselItemMutation();

  const { data } = usePostQuery({
    variables: {
      id: id ?? '',
    },
    skip: !isEdit,
  });

  const [content, setContent] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (data?.post?.content) {
      setContent(data?.post?.content);
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      title: data?.post?.title ?? '',
    },
  });

  // Image validation handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setImageError('Only PNG, JPG, or JPEG files are allowed.');
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }

    // Validate size (4MB for community posts)
    if (file.size > 4 * 1024 * 1024) {
      setImageError('Image must be under 4MB.');
      setSelectedImage(undefined);
      setImagePreview(null);
      return;
    }

    // Validate aspect ratio (16:9)
    const img = new window.Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const targetRatio = 16 / 9;
      const tolerance = 0.1; // Allow some tolerance

      if (Math.abs(aspectRatio - targetRatio) > tolerance) {
        setImageError('Image must be 16:9 aspect ratio.');
        setSelectedImage(undefined);
        setImagePreview(null);
      } else {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
    img.onerror = () => {
      setImageError('Invalid image file.');
      setSelectedImage(undefined);
      setImagePreview(null);
    };
    img.src = URL.createObjectURL(file);
  };

  const onSubmit = (submitData: { title: string }) => {
    if (!content.length) return;

    onSubmitPost({
      id: data?.post?.id ?? id,
      title: submitData.title,
      content,
      image: selectedImage,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[820px] w-full mx-auto">
      <h1 className="font-medium text-xl mb-6">{isEdit ? 'Edit Community' : 'Create Community'}</h1>

      <section className="bg-white py-8 px-10 rounded-lg mb-2">
        <label htmlFor="title" className="space-y-2 block mb-10">
          <p className="text-sm font-medium">
            Title <span className="text-primary">*</span>
          </p>
          <Input
            id="title"
            type="text"
            placeholder="Placeholder"
            className="h-10"
            {...register('title', { required: true })}
          />
          {errors.title && (
            <span className="text-destructive text-sm block">Title is required</span>
          )}
        </label>

        <label htmlFor="image" className="space-y-2 block">
          <div className="flex items-start gap-6">
            {/* Image input with preview/placeholder */}
            <div className="relative w-[320px] h-[180px] flex items-center justify-center bg-[#eaeaea] rounded-lg overflow-hidden group">
              <input
                id="picture"
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
            {/* Text info */}
            <div className="flex-1">
              <p className="font-medium text-base">
                Cover image <span className="text-primary">*</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Cover image must be 16:9, under 4MB, and in PNG, JPG, or JPEG format.
                <br />
                This image is used in the community list
              </p>
              {imageError && (
                <span className="text-destructive text-sm block mt-2">{imageError}</span>
              )}
            </div>
          </div>
        </label>
      </section>

      <section className="bg-white py-8 px-10 rounded-lg">
        <label htmlFor="content" className="space-y-2 block mb-10">
          <p className="text-sm font-medium">
            Description <span className="text-primary">*</span>
          </p>
          <MarkdownEditor onChange={setContent} content={content} />
          {!content.length && (
            <span className="text-destructive text-sm block">Description is required</span>
          )}
        </label>
      </section>

      {/* {isEdit && (
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
          }}
          disabled={carouselItems?.carouselItems?.some(
            (item) =>
              item.itemId === data?.post?.id || (carouselItems?.carouselItems?.length ?? 0) >= 5,
          )}
        >
          {carouselItems?.carouselItems?.some((item) => item.itemId === data?.post?.id)
            ? 'Already in Carousel'
            : 'Add to Main Carousel'}
        </Button>
      )} */}

      {isEdit ? (
        <div className="px-[32px] py-3 flex justify-end gap-4">
          <Button variant="purple" className="min-w-[177px]" type="submit">
            Edit Post
          </Button>
        </div>
      ) : (
        <div className="py-3 flex justify-end gap-4">
          <Button className="min-w-[97px]" type="submit">
            Save
          </Button>
        </div>
      )}
    </form>
  );
}

export default PostForm;
