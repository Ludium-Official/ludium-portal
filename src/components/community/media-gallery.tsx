import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { useState } from 'react';

const isVideoUrl = (url: string) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.includes(ext));
};

const MediaItem = ({
  url,
  className,
  showPlayIcon = false,
}: {
  url: string;
  className?: string;
  showPlayIcon?: boolean;
}) => {
  if (isVideoUrl(url)) {
    return (
      <div className="relative w-full h-full">
        <video src={url} className={className} muted playsInline />
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        )}
      </div>
    );
  }
  return <img src={url} alt="Post media" className={className} />;
};

interface MediaGalleryProps {
  images: string[];
  className?: string;
}

export const MediaGallery = ({ images, className = '' }: MediaGalleryProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setViewerOpen(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const renderGrid = () => {
    const count = images.length;

    if (count === 1) {
      return (
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <MediaItem url={images[0]} className="w-full max-h-[400px] object-cover" showPlayIcon />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="aspect-square cursor-pointer"
              onClick={() => handleImageClick(idx)}
            >
              <MediaItem url={url} className="w-full h-full object-cover" showPlayIcon />
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          <div className="row-span-2 cursor-pointer" onClick={() => handleImageClick(0)}>
            <MediaItem url={images[0]} className="w-full h-full object-cover" showPlayIcon />
          </div>
          <div className="cursor-pointer" onClick={() => handleImageClick(1)}>
            <MediaItem
              url={images[1]}
              className="w-full h-full object-cover aspect-square"
              showPlayIcon
            />
          </div>
          <div className="cursor-pointer" onClick={() => handleImageClick(2)}>
            <MediaItem
              url={images[2]}
              className="w-full h-full object-cover aspect-square"
              showPlayIcon
            />
          </div>
        </div>
      );
    }

    // 4 or more images
    return (
      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        {images.slice(0, 4).map((url, idx) => (
          <div
            key={idx}
            className="aspect-square cursor-pointer relative"
            onClick={() => handleImageClick(idx)}
          >
            <MediaItem url={url} className="w-full h-full object-cover" showPlayIcon />
            {idx === 3 && count > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                +{count - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={className}>{renderGrid()}</div>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-[90vw]! max-h-[90vh]! p-0 bg-black/90 border-none">
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-4 right-4 z-50 text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative flex items-center justify-center min-h-[60vh]">
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 z-50 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {isVideoUrl(images[currentIndex]) ? (
              <video
                key={currentIndex}
                src={images[currentIndex]}
                className="max-w-full max-h-[80vh] object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={images[currentIndex]}
                alt={`Media ${currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />
            )}

            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 z-50 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

interface MediaUploadPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const MediaPreviewItem = ({
  file,
  url,
  className,
}: {
  file: File;
  url: string;
  className?: string;
}) => {
  const isVideo = file.type.startsWith('video/');

  if (isVideo) {
    return (
      <div className="relative w-full h-full group">
        <video
          src={url}
          className={className}
          muted
          playsInline
          loop
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  return <img src={url} alt="Preview" className={className} />;
};

export const MediaUploadPreview = ({ files, onRemove }: MediaUploadPreviewProps) => {
  if (files.length === 0) return null;

  const previewUrls = files.map((file) => URL.createObjectURL(file));

  const renderGrid = () => {
    const count = files.length;

    if (count === 1) {
      return (
        <div className="relative rounded-lg overflow-hidden">
          <MediaPreviewItem
            file={files[0]}
            url={previewUrls[0]}
            className="w-full max-h-[300px] object-cover"
          />
          <button
            onClick={() => onRemove(0)}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="aspect-square relative">
              <MediaPreviewItem
                file={files[idx]}
                url={url}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemove(idx)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          <div className="row-span-2 relative">
            <MediaPreviewItem
              file={files[0]}
              url={previewUrls[0]}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onRemove(0)}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {previewUrls.slice(1).map((url, idx) => (
            <div key={idx + 1} className="aspect-square relative">
              <MediaPreviewItem
                file={files[idx + 1]}
                url={url}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemove(idx + 1)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      );
    }

    // 4 or more
    return (
      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        {previewUrls.slice(0, 4).map((url, idx) => (
          <div key={idx} className="aspect-square relative">
            <MediaPreviewItem file={files[idx]} url={url} className="w-full h-full object-cover" />
            <button
              onClick={() => onRemove(idx)}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white"
            >
              <X className="w-4 h-4" />
            </button>
            {idx === 3 && count > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold pointer-events-none">
                +{count - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return <div>{renderGrid()}</div>;
};
