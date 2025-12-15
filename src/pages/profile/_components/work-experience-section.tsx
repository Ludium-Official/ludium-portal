import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import WorkIcon from '@/assets/icons/profile/work.svg';

export const WorkExperienceSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg px-10 py-5">
      <h2 className="text-base font-semibold mb-4">Work experience</h2>

      <div className="border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center">
        <img src={WorkIcon} alt="Work experience" className="h-12 w-12 text-gray-300 mb-1" />
        <p className="text-slate-500 mb-2 font-light">No work experience details added yet.</p>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Details
        </Button>
      </div>
    </div>
  );
};
