import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SearchSelect } from '@/components/ui/search-select';
import { DEGREE_OPTIONS } from '@/constant/profile-related';
import type { LabelValueProps } from '@/types/common';
import { Pen, Plus } from 'lucide-react';
import EducationIcon from '@/assets/icons/profile/education.svg';
import { useState } from 'react';

interface Education {
  id?: string;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
}

interface EducationSectionProps {
  educations?: Education[];
}

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: LabelValueProps[] = Array.from({ length: 50 }, (_, i) => ({
  label: String(currentYear - i + 10),
  value: String(currentYear - i + 10),
}));

const emptyEducation: Education = {
  school: '',
  degree: '',
  fieldOfStudy: '',
  startYear: '',
  endYear: '',
};

export const EducationSection: React.FC<EducationSectionProps> = ({
  educations: initialEducations = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localEducations, setLocalEducations] = useState<Education[]>(initialEducations);
  const [formData, setFormData] = useState<Education>(emptyEducation);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingIndex(null);
      setFormData(emptyEducation);
    }
    setIsOpen(open);
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setFormData(emptyEducation);
    setIsOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(localEducations[index]);
    setIsOpen(true);
  };

  const handleDelete = (index: number) => {
    // TODO: Implement API call to delete
    setLocalEducations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // TODO: Implement API call to save education
    if (editingIndex !== null) {
      setLocalEducations((prev) => prev.map((edu, i) => (i === editingIndex ? formData : edu)));
    } else {
      setLocalEducations((prev) => [...prev, formData]);
    }
    setIsOpen(false);
    setEditingIndex(null);
    setFormData(emptyEducation);
  };

  const handleCancel = () => {
    setFormData(emptyEducation);
    setEditingIndex(null);
    setIsOpen(false);
  };

  const updateField = (field: keyof Education, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatEducationDetails = (edu: Education) => {
    const parts = [];
    if (edu.degree) parts.push(edu.degree);
    if (edu.fieldOfStudy) parts.push(edu.fieldOfStudy);
    if (edu.startYear && edu.endYear) {
      parts.push(`${edu.startYear}- ${edu.endYear}`);
    } else if (edu.startYear) {
      parts.push(`${edu.startYear}`);
    } else if (edu.endYear) {
      parts.push(`${edu.endYear}`);
    }
    return parts.join(' · ');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-10 py-5">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold">Education</h2>
          {localEducations.length > 0 && (
            <Button variant="outline" size="icon" className="h-9 w-10" onClick={handleAddNew}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {localEducations.length > 0 ? (
          <div className="space-y-4">
            {localEducations.map((edu, index) => (
              <div
                key={`${index}-${edu.school}`}
                className="flex flex-col justify-between gap-3 border border-gray-200 rounded-lg p-5 text-sm text-slate-600"
              >
                <div className="flex items-center justify-between">
                  <p>{edu.school}</p>
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
                  <p>{formatEducationDetails(edu)}</p>
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
            <img src={EducationIcon} alt="Education" className="h-12 w-12 text-gray-300 mb-1" />
            <p className="text-slate-500 mb-2 font-light">No education details added yet.</p>
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
            <DialogTitle className="text-base font-semibold text-slate-800">Education</DialogTitle>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={!formData.school.trim()}
              >
                Save
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 my-4">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                School <span className="text-red-500">*</span>
              </p>
              <Input
                placeholder="e.g., Harvard University"
                value={formData.school}
                onChange={(e) => updateField('school', e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Degree</p>
              <SearchSelect
                options={DEGREE_OPTIONS}
                value={formData.degree || undefined}
                setValue={(value) => {
                  if (typeof value === 'function') {
                    updateField('degree', value(formData.degree) || '');
                  } else {
                    updateField('degree', value || '');
                  }
                }}
                placeholder="Select Degree type"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Field of study</p>
              <Input
                placeholder="e.g., Computer Science"
                value={formData.fieldOfStudy}
                onChange={(e) => updateField('fieldOfStudy', e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Dates Attended</p>
              <div className="grid grid-cols-2 gap-4">
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
                  placeholder="Start year"
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
                  placeholder="End (expected) year"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
