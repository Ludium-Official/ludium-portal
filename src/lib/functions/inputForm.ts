import { handleImageProps } from '@/types/input';

export const handleImage = ({ file, setImageError, setValue }: handleImageProps) => {
  if (!file) return;

  // Validate type
  if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
    setImageError('Only PNG, JPG, or JPEG files are allowed.');
    setValue('image', undefined);
    return;
  }

  // Validate size
  if (file.size > 2 * 1024 * 1024) {
    setImageError('Image must be under 2MB.');
    setValue('image', undefined);
    return;
  }

  // Validate square
  const img = new window.Image();
  img.onload = () => {
    setImageError(null);
    setValue('image', file);
  };
  img.onerror = () => {
    setImageError('Invalid image file.');
    setValue('image', undefined);
  };
  img.src = URL.createObjectURL(file);
};
