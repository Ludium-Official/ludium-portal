import client from '@/apollo/client';
import { useUpdateExpertiseSectionV2Mutation } from '@/apollo/mutation/update-expertise-section-v2.generated';
import { ProfileV2Document } from '@/apollo/queries/profile-v2.generated';
import ExpertiseIcon from '@/assets/icons/profile/expertise.svg';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MobileFullScreenDialog } from '@/components/ui/mobile-full-screen-dialog';
import { MultiSelect } from '@/components/ui/multi-select';
import { SearchSelect } from '@/components/ui/search-select';
import { LANGUAGE_OPTIONS, PROFICIENCY_OPTIONS } from '@/constant/profile-related';
import { fetchSkills } from '@/lib/api/skills';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import { cn } from '@/lib/utils';
import type { LabelValueProps } from '@/types/common';
import type { LanguageV2 } from '@/types/types.generated';
import { Loader2, Minus, Pen, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExpertiseSectionProps {
  role?: string | null;
  skills?: string[] | null;
  languages?: LanguageV2[];
}

export const ExpertiseSection: React.FC<ExpertiseSectionProps> = ({
  role,
  skills,
  languages = [],
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<{ name: string }[]>([]);
  const [skillInput, setSkillInput] = useState<string>();
  const [selectedSkillItems, setSelectedSkillItems] = useState<LabelValueProps[]>(
    skills?.map((s) => ({ label: s, value: s })) || [],
  );
  const [formRole, setFormRole] = useState(role || '');
  const [formSkills, setFormSkills] = useState<string[]>(skills || []);
  const [formLanguages, setFormLanguages] = useState<LanguageV2[]>(
    languages.length > 0 ? languages : [{ language: '', proficiency: '' }],
  );

  const [updateExpertiseSectionV2, { loading: updating }] = useUpdateExpertiseSectionV2Mutation();

  useEffect(() => {
    const loadSkills = async () => {
      setSkillsLoading(true);
      try {
        const skillsData = await fetchSkills();
        setSelectedSkills(skillsData);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setSkillsLoading(false);
      }
    };
    loadSkills();
  }, []);

  const skillOptions = [
    ...formSkills.map((v) => ({
      value: v,
      label: v,
    })),
    ...selectedSkills.map((skill) => ({
      value: skill.name,
      label: skill.name,
    })),
  ];

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setFormRole(role || '');
      setFormSkills(skills || []);
      setSelectedSkillItems(skills?.map((s) => ({ label: s, value: s })) || []);
      setFormLanguages(languages.length > 0 ? languages : [{ language: '', proficiency: '' }]);
    }
    setIsOpen(open);
  };

  const handleSave = () => {
    // Filter out empty language entries
    const validLanguages = formLanguages
      .filter((lang) => lang.language && lang.proficiency)
      .map((language) => ({
        language: language.language || '',
        proficiency: language.proficiency || '',
      }));

    updateExpertiseSectionV2({
      variables: {
        input: {
          role: formRole,
          skills: formSkills,
          languages: validLanguages,
        },
      },
      onCompleted: async () => {
        notify('Successfully updated the expertise', 'success');
        client.refetchQueries({ include: [ProfileV2Document] });
        setIsOpen(false);
      },
      onError: (error) => {
        console.error('Failed to update expertise:', error);
        notify('Failed to update expertise', 'error');
      },
    });
  };

  const handleCancel = () => {
    setFormRole(role || '');
    setFormSkills(skills || []);
    setSelectedSkillItems(skills?.map((s) => ({ label: s, value: s })) || []);
    setFormLanguages(languages.length > 0 ? languages : [{ language: '', proficiency: '' }]);
    setIsOpen(false);
  };

  const addLanguage = () => {
    setFormLanguages([...formLanguages, { language: '', proficiency: '' }]);
  };

  const removeLanguage = (index: number) => {
    setFormLanguages(formLanguages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: 'language' | 'proficiency', value: string) => {
    const updated = [...formLanguages];
    updated[index] = { ...updated[index], [field]: value };
    setFormLanguages(updated);
  };

  const formContent = (
    <div className={cn('space-y-6 my-4', isMobile && 'my-0 space-y-10')}>
      {/* Role */}
      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">
          Role <span className="text-red-500">*</span>
        </p>
        <Input
          placeholder="Enter your role"
          value={formRole}
          onChange={(e) => setFormRole(e.target.value)}
          className={cn(isMobile && 'text-sm')}
        />
      </div>

      {/* Skills */}
      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">Skills</p>
        <MultiSelect
          options={skillOptions}
          value={formSkills}
          onValueChange={(value: string[]) => {
            setFormSkills(value);
          }}
          placeholder="Select your skills"
          animation={2}
          maxCount={20}
          inputValue={skillInput}
          setInputValue={setSkillInput}
          selectedItems={selectedSkillItems}
          setSelectedItems={setSelectedSkillItems}
          emptyText="Search skills"
          loading={skillsLoading}
        />
      </div>

      <div>
        <div
          className={cn(
            'grid grid-cols-[1fr_1fr_40px] gap-4 mb-2',
            isMobile && 'grid-cols-1 gap-0',
          )}
        >
          <p className="text-sm font-medium text-gray-900">Language</p>
          {!isMobile && <div />}
        </div>
        <div className={cn('space-y-3', isMobile && 'space-y-5')}>
          {formLanguages.map((lang, index) => (
            <div
              key={index}
              className={cn(
                'grid grid-cols-[1fr_1fr_40px] gap-4',
                isMobile && 'grid-cols-[1fr_1fr] gap-[10px] mb-5',
              )}
            >
              <SearchSelect
                options={LANGUAGE_OPTIONS}
                value={lang.language || ''}
                setValue={(value) => {
                  if (typeof value === 'function') {
                    updateLanguage(index, 'language', value(lang.language || '') || '');
                  } else {
                    updateLanguage(index, 'language', value || '');
                  }
                }}
                placeholder="Select a language"
              />
              <SearchSelect
                options={PROFICIENCY_OPTIONS}
                value={lang.proficiency || ''}
                setValue={(value) => {
                  if (typeof value === 'function') {
                    updateLanguage(index, 'proficiency', value(lang.proficiency || '') || '');
                  } else {
                    updateLanguage(index, 'proficiency', value || '');
                  }
                }}
                placeholder="Select proficiency"
              />
              {index > 0 ? (
                <Button
                  type="button"
                  variant={isMobile ? 'ghost' : 'outline'}
                  size="icon"
                  className={cn('h-10 w-10', isMobile && 'w-fit h-fit')}
                  onClick={() => removeLanguage(index)}
                >
                  {!isMobile && <Minus className="h-4 w-4" />}
                  {isMobile && <span className="underline text-[10px] text-gray-400">delete</span>}
                </Button>
              ) : (
                !isMobile && <div className="w-10" />
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('gap-2 mt-3', isMobile && 'mt-0')}
          onClick={addLanguage}
        >
          <Plus className="h-4 w-4" />
          Add Language
        </Button>
      </div>
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
          <h2 className="text-base font-semibold">Expertise</h2>
          {role && (
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-10">
                <Pen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          )}
        </div>

        {role ? (
          <>
            {role && (
              <div className={cn('mb-6', isMobile && 'mb-[18px]')}>
                <p
                  className={cn('text-sm font-medium text-gray-900 mb-4', isMobile && 'mb-[10px]')}
                >
                  Role
                </p>
                <p className="text-sm text-slate-600">{role}</p>
              </div>
            )}

            {skills && skills.length > 0 && (
              <div className={cn('mb-6', isMobile && 'mb-[18px]')}>
                <p
                  className={cn('text-sm font-medium text-gray-900 mb-4', isMobile && 'mb-[10px]')}
                >
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills?.map((skill) => (
                    <span
                      key={skill}
                      className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 font-semibold text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {languages.length > 0 && (
              <div className="mb-4">
                <div className={cn('flex items-center mb-4', isMobile && 'mb-[10px]')}>
                  <p className="text-sm font-medium text-gray-900">Language</p>
                </div>
                <div className="space-y-2">
                  {languages.map((language) => (
                    <div
                      key={language.language}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <p>{language.language}</p>
                      <p>-</p>
                      <p>{language.proficiency}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            className={cn(
              'border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center',
              isMobile && 'p-6',
            )}
          >
            <img src={ExpertiseIcon} alt="Expertise" className="h-12 w-12 text-gray-300 mb-1" />
            <p className={cn('text-slate-500 mb-2 font-light', isMobile && 'text-sm')}>
              No expertise details added yet.
            </p>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Details
              </Button>
            </DialogTrigger>
          </div>
        )}

        {isMobile ? (
          <MobileFullScreenDialog
            open={isOpen}
            onClose={handleCancel}
            title="Edit Expertise"
            onAction={handleSave}
            actionDisabled={!formRole.trim()}
            actionLoading={updating}
          >
            {formContent}
          </MobileFullScreenDialog>
        ) : (
          <DialogContent className="sm:max-w-[782px] px-10 py-4">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-base font-semibold text-slate-800">
                Expertise
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={!formRole.trim() || updating}
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
