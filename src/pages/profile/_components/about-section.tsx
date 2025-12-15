import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import AboutIcon from '@/assets/icons/profile/about.svg';

interface AboutSectionProps {
  bio?: string | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ bio }) => {
  return (
    <div className="bg-white rounded-lg px-10 py-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold">About</h2>
        {bio && (
          <Button variant="outline" size="icon" className="h-9 w-10">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {bio ? (
        <div className="mb-4">
          <p className="max-h-[360px] overflow-y-auto text-sm text-slate-600">{bio}</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center">
          <img src={AboutIcon} alt="About" className="h-12 w-12 text-gray-300 mb-1" />
          <p className="text-slate-500 mb-2 font-light">No about added yet.</p>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Details
          </Button>
        </div>
      )}
    </div>
  );
};
