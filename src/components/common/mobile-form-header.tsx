import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X } from 'lucide-react';
import { Link } from 'react-router';

interface MobileFormHeaderProps {
  title: string;
  backLink: string;
  isPublished: boolean;
  loading?: boolean;
  onPublish: () => void;
  onSaveDraft: () => void;
}

export function MobileFormHeader({
  title,
  backLink,
  isPublished,
  loading,
  onPublish,
  onSaveDraft,
}: MobileFormHeaderProps) {
  return (
    <div className="fixed top-0 left-0 bg-white w-full z-50 border-b border-gray-100">
      <header className="relative flex items-center justify-center p-4 h-17">
        <Link to={backLink} className="absolute top-4 left-4">
          <X className="w-6 h-9" />
        </Link>
        <span className="text-sm">{title}</span>
        {isPublished ? (
          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onPublish}
            disabled={loading}
          >
            Publish
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="absolute right-4 top-4">
                Publish
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-2 flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={onSaveDraft}
                disabled={loading}
              >
                Save Draft
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={onPublish}
                disabled={loading}
              >
                Publish
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </header>
    </div>
  );
}

export default MobileFormHeader;
