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
import { useState } from 'react';

interface WorkExperience {
  id?: string;
  company: string;
  role: string;
  employmentType: string;
  isCurrentlyWorking: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
}

interface WorkExperienceSectionProps {
  experiences?: WorkExperience[];
}

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: LabelValueProps[] = Array.from({ length: 50 }, (_, i) => ({
  label: String(currentYear - i),
  value: String(currentYear - i),
}));

const emptyExperience: WorkExperience = {
  company: '',
  role: '',
  employmentType: '',
  isCurrentlyWorking: false,
  startMonth: '',
  startYear: '',
  endMonth: '',
  endYear: '',
};

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  experiences: initialExperiences = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localExperiences, setLocalExperiences] = useState<WorkExperience[]>(initialExperiences);
  const [formData, setFormData] = useState<WorkExperience>(emptyExperience);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingIndex(null);
      setFormData(emptyExperience);
    }
    setIsOpen(open);
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setFormData(emptyExperience);
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
    // TODO: Implement API call to save work experience
    if (editingIndex !== null) {
      setLocalExperiences((prev) => prev.map((exp, i) => (i === editingIndex ? formData : exp)));
    } else {
      setLocalExperiences((prev) => [...prev, formData]);
    }
    setIsOpen(false);
    setEditingIndex(null);
    setFormData(emptyExperience);
  };

  const handleCancel = () => {
    setFormData(emptyExperience);
    setEditingIndex(null);
    setIsOpen(false);
  };

  const updateField = (field: keyof WorkExperience, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateRange = (exp: WorkExperience) => {
    const start = exp.startMonth && exp.startYear ? `${exp.startMonth} ${exp.startYear}` : '';
    const end = exp.isCurrentlyWorking
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
                disabled={!formData.company.trim() || !formData.role.trim()}
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
                value={formData.company}
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
                  value={formData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Employment type</p>
                <SearchSelect
                  options={EMPLOYMENT_TYPE_OPTIONS}
                  value={formData.employmentType || undefined}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      updateField('employmentType', value(formData.employmentType) || '');
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
                checked={formData.isCurrentlyWorking}
                onCheckedChange={(checked) => updateField('isCurrentlyWorking', checked === true)}
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
                  value={formData.startMonth || undefined}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      updateField('startMonth', value(formData.startMonth) || '');
                    } else {
                      updateField('startMonth', value || '');
                    }
                  }}
                  placeholder="Month"
                />
                <SearchSelect
                  options={YEAR_OPTIONS}
                  value={formData.startYear || undefined}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      updateField('startYear', value(formData.startYear) || '');
                    } else {
                      updateField('startYear', value || '');
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
                  value={formData.endMonth || undefined}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      updateField('endMonth', value(formData.endMonth) || '');
                    } else {
                      updateField('endMonth', value || '');
                    }
                  }}
                  placeholder="Month"
                  disabled={formData.isCurrentlyWorking}
                />
                <SearchSelect
                  options={YEAR_OPTIONS}
                  value={formData.endYear || undefined}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      updateField('endYear', value(formData.endYear) || '');
                    } else {
                      updateField('endYear', value || '');
                    }
                  }}
                  placeholder="Year"
                  disabled={formData.isCurrentlyWorking}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
