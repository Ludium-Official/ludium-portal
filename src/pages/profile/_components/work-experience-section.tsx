import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchSelect } from '@/components/ui/search-select';
import { EMPLOYMENT_TYPE_OPTIONS, MONTH_OPTIONS } from '@/constant/profile-related';
import type { LabelValueProps } from '@/types/common';
import { Pen, Plus } from 'lucide-react';
import WorkIcon from '@/assets/icons/profile/work.svg';
import { useEffect, useState } from 'react';
import { WorkExperienceV2 } from '@/types/types.generated';
import { useUpdateWorkExperienceSectionV2Mutation } from '@/apollo/mutation/update-work-experience-section-v2.generated';
import client from '@/apollo/client';
import notify from '@/lib/notify';
import { ProfileV2Document } from '@/apollo/queries/profile-v2.generated';

interface WorkExperienceSectionProps {
  experiences?: WorkExperienceV2[];
}

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: LabelValueProps[] = Array.from({ length: 50 }, (_, i) => ({
  label: String(currentYear - i),
  value: String(currentYear - i),
}));

const getEmptyExperience = (): WorkExperienceV2 => ({
  company: '',
  role: '',
  employmentType: '',
  currentWork: false,
  startMonth: '',
  startYear: 0,
  endMonth: '',
  endYear: 0,
});

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  experiences = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localExperiences, setLocalExperiences] = useState<WorkExperienceV2[]>(experiences);
  const [formData, setFormData] = useState<WorkExperienceV2>(getEmptyExperience);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [updateWorkExperienceSectionV2] = useUpdateWorkExperienceSectionV2Mutation();

  useEffect(() => {
    setLocalExperiences(experiences);
  }, [experiences]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingIndex(null);
      setFormData(getEmptyExperience());
    }
    setIsOpen(open);
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setFormData(getEmptyExperience());
    setIsOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(localExperiences[index]);
    setIsOpen(true);
  };

  const handleDelete = (index: number) => {
    // TODO: Implement API call to delete
    setLocalExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    let updatedExperiences: WorkExperienceV2[];
    if (editingIndex !== null) {
      updatedExperiences = localExperiences.map((exp, index) =>
        index === editingIndex ? formData : exp,
      );
    } else {
      updatedExperiences = [...localExperiences, formData];
    }

    updateWorkExperienceSectionV2({
      variables: {
        input: {
          workExperiences: updatedExperiences.map((exp) => ({
            company: exp.company || '',
            currentWork: exp.currentWork || false,
            role: exp.role || '',
            employmentType: exp.employmentType || '',
            startMonth: exp.startMonth || '',
            startYear: exp.startYear || 0,
            endMonth: exp.endMonth || '',
            endYear: exp.endYear || 0,
          })),
        },
      },
      onCompleted: async () => {
        notify('Work experience updated successfully', 'success');
        setLocalExperiences(updatedExperiences);
        client.refetchQueries({ include: [ProfileV2Document] });
        setFormData(getEmptyExperience());
        setEditingIndex(null);
        setIsOpen(false);
      },
      onError: (error) => {
        console.error('Failed to update work experience:', error);
        notify('Failed to update work experience', 'error');
      },
    });
  };

  const handleCancel = () => {
    setFormData(getEmptyExperience());
    setEditingIndex(null);
    setIsOpen(false);
  };

  const updateField = (field: keyof WorkExperienceV2, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateRange = (exp: WorkExperienceV2) => {
    const start = exp.startMonth && exp.startYear ? `${exp.startMonth} ${exp.startYear}` : '';
    const end = exp.currentWork
      ? 'Present'
      : exp.endMonth && exp.endYear
        ? `${exp.endMonth} ${exp.endYear}`
        : '';
    return start && end ? `${start} - ${end}` : '';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-10 py-5">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold">Work experience</h2>
          {localExperiences.length > 0 && (
            <Button variant="outline" size="icon" className="h-9 w-10" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {localExperiences.length > 0 ? (
          <div className="space-y-4">
            {localExperiences.map((exp, index) => (
              <div
                key={`${index}-${exp.company}`}
                className="flex flex-col justify-between gap-3 border border-gray-200 rounded-lg p-5 text-sm text-slate-600"
              >
                <div className="flex items-center justify-between">
                  <p>{exp.company}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="border border-gray-200 rounded-sm h-6 w-7"
                    onClick={() => handleEdit(index)}
                  >
                    <Pen className="size-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p>
                    {exp.role}
                    {exp.employmentType && ` · ${exp.employmentType}`}
                    {formatDateRange(exp) && ` · ${formatDateRange(exp)}`}
                  </p>
                  <button
                    type="button"
                    className="cursor-pointer text-xs text-gray-400 underline"
                    onClick={() => handleDelete(index)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center">
            <img src={WorkIcon} alt="Work experience" className="h-12 w-12 text-gray-300 mb-1" />
            <p className="text-slate-500 mb-2 font-light">No work experience details added yet.</p>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleAddNew}>
                <Plus className="h-4 w-4" />
                Add Details
              </Button>
            </DialogTrigger>
          </div>
        )}

        <DialogContent className="sm:max-w-[782px] px-10 py-4">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-semibold text-slate-800">
              Work experience
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
                disabled={!formData.company?.trim() || !formData.role?.trim()}
              >
                Save
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 my-4">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Company <span className="text-red-500">*</span>
              </p>
              <Input
                placeholder="e.g., Google"
                value={formData.company || ''}
                onChange={(e) => updateField('company', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Role <span className="text-red-500">*</span>
                </p>
                <Input
                  placeholder="e.g., Software Engineer"
                  value={formData.role || ''}
                  onChange={(e) => updateField('role', e.target.value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Employment type</p>
                <SearchSelect
                  options={EMPLOYMENT_TYPE_OPTIONS}
                  value={formData.employmentType || ''}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      updateField('employmentType', value(formData.employmentType || '') || '');
                    } else {
                      updateField('employmentType', value || '');
                    }
                  }}
                  placeholder="Select employment type"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="currentlyWorking"
                checked={formData.currentWork || false}
                onCheckedChange={(checked) => updateField('currentWork', checked === true)}
              />
              <label
                htmlFor="currentlyWorking"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                I am currently working in this role
              </label>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Start date</p>
              <div className="grid grid-cols-2 gap-4">
                <SearchSelect
                  options={MONTH_OPTIONS}
                  value={formData.startMonth || ''}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      updateField('startMonth', value(formData.startMonth || '') || '');
                    } else {
                      updateField('startMonth', value || '');
                    }
                  }}
                  placeholder="Month"
                />
                <SearchSelect
                  options={YEAR_OPTIONS}
                  value={formData.startYear ? String(formData.startYear) : ''}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      const newValue = value(formData.startYear ? String(formData.startYear) : '');
                      updateField('startYear', newValue ? parseInt(newValue, 10) : 0);
                    } else {
                      updateField('startYear', value ? parseInt(value, 10) : 0);
                    }
                  }}
                  placeholder="Year"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">End date</p>
              <div className="grid grid-cols-2 gap-4">
                <SearchSelect
                  options={MONTH_OPTIONS}
                  value={formData.endMonth || ''}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      updateField('endMonth', value(formData.endMonth || '') || '');
                    } else {
                      updateField('endMonth', value || '');
                    }
                  }}
                  placeholder="Month"
                  disabled={formData.currentWork || false}
                />
                <SearchSelect
                  options={YEAR_OPTIONS}
                  value={formData.endYear ? String(formData.endYear) : ''}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      const newValue = value(formData.endYear ? String(formData.endYear) : '');
                      updateField('endYear', newValue ? parseInt(newValue, 10) : 0);
                    } else {
                      updateField('endYear', value ? parseInt(value, 10) : 0);
                    }
                  }}
                  placeholder="Year"
                  disabled={formData.currentWork || false}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
