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
import { useEffect, useState } from 'react';
import { EducationV2 } from '@/types/types.generated';
import { useUpdateEducationSectionV2Mutation } from '@/apollo/mutation/update-education-section-v2.generated';
import notify from '@/lib/notify';
import client from '@/apollo/client';
import { ProfileV2Document } from '@/apollo/queries/profile-v2.generated';

interface EducationSectionProps {
  educations?: EducationV2[];
}

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: LabelValueProps[] = Array.from({ length: 50 }, (_, i) => ({
  label: String(currentYear - i + 10),
  value: String(currentYear - i + 10),
}));

const getEmptyEducation = (): EducationV2 => ({
  school: '',
  degree: '',
  study: '',
  attendedStartDate: 0,
  attendedEndDate: 0,
});

export const EducationSection: React.FC<EducationSectionProps> = ({ educations = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localEducations, setLocalEducations] = useState<EducationV2[]>(educations);
  const [formData, setFormData] = useState<EducationV2>(getEmptyEducation);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [updateEducationSectionV2] = useUpdateEducationSectionV2Mutation();

  useEffect(() => {
    setLocalEducations(educations);
  }, [educations]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingIndex(null);
      setFormData(getEmptyEducation());
    }
    setIsOpen(open);
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setFormData(getEmptyEducation());
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
    let updatedEducations: EducationV2[];
    if (editingIndex !== null) {
      updatedEducations = localEducations.map((edu, index) =>
        index === editingIndex ? formData : edu,
      );
    } else {
      updatedEducations = [...localEducations, formData];
    }

    updateEducationSectionV2({
      variables: {
        input: {
          educations: updatedEducations.map((edu) => ({
            school: edu.school || '',
            degree: edu.degree || '',
            study: edu.study || '',
            attendedStartDate: edu.attendedStartDate || 0,
            attendedEndDate: edu.attendedEndDate || 0,
          })),
        },
      },
      onCompleted: async () => {
        notify('Education updated successfully', 'success');
        setLocalEducations(updatedEducations);
        client.refetchQueries({ include: [ProfileV2Document] });
        setFormData(getEmptyEducation());
        setEditingIndex(null);
        setIsOpen(false);
      },
      onError: (error) => {
        console.error('Failed to update education:', error);
        notify('Failed to update education', 'error');
      },
    });
  };

  const handleCancel = () => {
    setFormData(getEmptyEducation());
    setEditingIndex(null);
    setIsOpen(false);
  };

  const updateField = (field: keyof EducationV2, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatEducationDetails = (edu: EducationV2) => {
    const parts = [];
    if (edu.degree) parts.push(edu.degree);
    if (edu.study) parts.push(edu.study);
    if (edu.attendedStartDate && edu.attendedEndDate) {
      parts.push(`${edu.attendedStartDate} - ${edu.attendedEndDate}`);
    } else if (edu.attendedStartDate) {
      parts.push(`${edu.attendedStartDate}`);
    } else if (edu.attendedEndDate) {
      parts.push(`${edu.attendedEndDate}`);
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
                disabled={!formData.school?.trim()}
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
                value={formData.school || ''}
                onChange={(e) => updateField('school', e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Degree</p>
              <SearchSelect
                options={DEGREE_OPTIONS}
                value={formData.degree || ''}
                setValue={(value) => {
                  if (typeof value === 'function') {
                    updateField('degree', value(formData.degree || '') || '');
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
                value={formData.study || ''}
                onChange={(e) => updateField('study', e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Dates Attended</p>
              <div className="grid grid-cols-2 gap-4">
                <SearchSelect
                  options={YEAR_OPTIONS}
                  value={formData.attendedStartDate ? String(formData.attendedStartDate) : ''}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      const newValue = value(
                        formData.attendedStartDate ? String(formData.attendedStartDate) : '',
                      );
                      updateField('attendedStartDate', newValue ? parseInt(newValue, 10) : 0);
                    } else {
                      updateField('attendedStartDate', value ? parseInt(value, 10) : 0);
                    }
                  }}
                  placeholder="Start year"
                />
                <SearchSelect
                  options={YEAR_OPTIONS}
                  value={formData.attendedEndDate ? String(formData.attendedEndDate) : ''}
                  setValue={(value) => {
                    if (typeof value === 'function') {
                      const newValue = value(
                        formData.attendedEndDate ? String(formData.attendedEndDate) : '',
                      );
                      updateField('attendedEndDate', newValue ? parseInt(newValue, 10) : 0);
                    } else {
                      updateField('attendedEndDate', value ? parseInt(value, 10) : 0);
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
