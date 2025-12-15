import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import ExpertiseIcon from '@/assets/icons/profile/expertise.svg';

interface Language {
  name: string;
  proficiency: string;
}

interface ExpertiseSectionProps {
  role?: string | null;
  skills?: string[] | null;
  languages?: Language[];
}

export const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({
  role,
  skills,
  languages = [],
}) => {
  return (
    <div className="bg-white rounded-lg px-10 py-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold">Expertise</h2>
        {role && (
          <Button variant="outline" size="icon" className="h-9 w-10">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {role ? (
        <>
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 mb-4">Role</p>
            <p className="text-sm text-slate-600">{role}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 mb-4">Skills</p>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              {skills?.map((skill) => (
                <span
                  key={skill}
                  className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 font-semibold text-xs"
                >
                  {skill}
                </span>
              ))}
            </p>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-2 items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-900">Language</p>
              <p className="text-sm font-medium text-gray-900">Proficiency</p>
            </div>
            <div className="space-y-2">
              {languages.map((language) => (
                <div key={language.name} className="grid grid-cols-2 items-center justify-between">
                  <p className="text-sm text-slate-600">{language.name}</p>
                  <p className="text-sm text-slate-600">{language.proficiency}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center">
          <img src={ExpertiseIcon} alt="Expertise" className="h-12 w-12 text-gray-300 mb-1" />
          <p className="text-slate-500 mb-2 font-light">No expertise details added yet.</p>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Details
          </Button>
        </div>
      )}
    </div>
  );
};
