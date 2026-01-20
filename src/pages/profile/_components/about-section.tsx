import client from '@/apollo/client';
import { useUpdateAboutSectionV2Mutation } from '@/apollo/mutation/update-about-section-v2.generated';
import { ProfileV2Document } from '@/apollo/queries/profile-v2.generated';
import AboutIcon from '@/assets/icons/profile/about.svg';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn } from '@/lib/utils';
import { Loader2, Pen, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface AboutSectionProps {
  bio?: string | null;
}

const MAX_CHARACTERS = 1000;

export const AboutSection: React.FC<AboutSectionProps> = ({ bio }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [aboutText, setAboutText] = useState(bio || '');

  const [updateAboutSectionV2, { loading: updating }] = useUpdateAboutSectionV2Mutation();

  const handleSave = () => {
    updateAboutSectionV2({
      variables: {
        input: {
          about: aboutText,
        },
      },
      onCompleted: async () => {
        notify('Successfully updated the about', 'success');
        client.refetchQueries({ include: [ProfileV2Document] });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error('Failed to update about:', error);
        notify('Failed to update about', 'error');
      },
    });
  };

  const handleCancel = () => {
    setAboutText(bio || '');
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setAboutText(bio || '');
    }
    setIsOpen(open);
  };

  const formContent = (
    <div className={cn('my-4', isMobile && 'h-full my-0')}>
      <Textarea
        placeholder="Introduce yourself. You can describe your skills, experience, and background."
        value={aboutText}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARACTERS) {
            setAboutText(e.target.value);
          }
        }}
        className={cn('min-h-[200px] resize-none', isMobile && 'min-h-[400px]')}
      />
      <p className="text-sm text-gray-500 text-right mt-2">
        {aboutText.length}/{MAX_CHARACTERS} characters
      </p>
    </div>
  );

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg px-10 py-5',
        isMobile && 'px-[14px] py-4',
      )}
    >
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold">About</h2>
          {bio && (
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-10">
                <Pen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          )}
        </div>

        {bio ? (
          <div className="mb-4">
            <p className="max-h-[360px] overflow-y-auto text-sm text-slate-600 whitespace-pre-wrap">
              {bio}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center',
              isMobile && 'p-6',
            )}
          >
            <img src={AboutIcon} alt="About" className="h-12 w-12 text-gray-300 mb-1" />
            <p className="text-slate-500 mb-2 font-light">No about added yet.</p>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Details
              </Button>
            </DialogTrigger>
          </div>
        )}

        {isMobile ? (
          isOpen && (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
              <header className="relative flex items-center justify-center px-4 py-4 h-17 border-b border-gray-100">
                <button onClick={handleCancel} className="absolute top-4 left-4">
                  <X className="w-6 h-9" />
                </button>
                <span className="text-sm font-medium">About</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-4 top-4"
                  onClick={handleSave}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </Button>
              </header>
              <div className="flex-1 overflow-y-auto p-4">{formContent}</div>
            </div>
          )
        ) : (
          <DialogContent className="sm:max-w-[782px] px-10 py-4">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-base font-semibold text-slate-800">About</DialogTitle>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </DialogHeader>
            {formContent}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
