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
import { Textarea } from '@/components/ui/textarea';
import { Pen, Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import LudiumBadgeLogo from '@/assets/icons/profile/ludium-badge.svg';

interface ProjectContent {
  id: string;
  type: 'image';
  url: string;
  file?: File;
}

interface Project {
  id?: string;
  title: string;
  isCompletedOnLudium?: boolean;
  role?: string;
  description?: string;
  contents?: ProjectContent[];
}

const emptyProject: Project = {
  title: '',
  isCompletedOnLudium: false,
  role: '',
  description: '',
  contents: [],
};

const PortfolioPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Project>(emptyProject);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingIndex(null);
      setFormData(emptyProject);
    }
    setIsOpen(open);
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setFormData(emptyProject);
    setIsOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(projects[index]);
    setIsOpen(true);
  };

  const handleSave = () => {
    // TODO: Implement API call to save project
    if (editingIndex !== null) {
      setProjects((prev) => prev.map((proj, i) => (i === editingIndex ? formData : proj)));
    } else {
      setProjects((prev) => [...prev, formData]);
    }
    setIsOpen(false);
    setEditingIndex(null);
    setFormData(emptyProject);
  };

  const handleCancel = () => {
    setFormData(emptyProject);
    setEditingIndex(null);
    setIsOpen(false);
  };

  const updateField = (field: keyof Project, value: string | boolean | ProjectContent[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddContent = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)) {
      return;
    }

    const newContent: ProjectContent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'image',
      url: URL.createObjectURL(file),
      file,
    };

    setFormData((prev) => ({
      ...prev,
      contents: [...(prev.contents || []), newContent],
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveContent = (contentId: string) => {
    setFormData((prev) => ({
      ...prev,
      contents: (prev.contents || []).filter((c) => c.id !== contentId),
    }));
  };

  const getProjectTitle = () => {
    if (editingIndex !== null) {
      return `Project ${editingIndex + 1}`;
    }
    return `Project ${projects.length + 1}`;
  };

  const handleDelete = (index: number) => {
    // TODO: Implement API call to delete
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const isSaveDisabled = !formData.title.trim();

  return (
    <div className="mx-auto my-10 space-y-5 max-w-[820px]">
      <div className="mb-2 text-xl font-bold">Portfolio</div>
      <div className="mb-6 text-gray-500 text-sm">
        Show your work and highlight your best projects.
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={`${index}-${project.title}`}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800">{project.title}</p>
                  {project.isCompletedOnLudium && <img src={LudiumBadgeLogo} alt="Ludium Badge" />}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-10"
                  onClick={() => handleEdit(index)}
                >
                  <Pen className="h-4 w-4" />
                </Button>
              </div>

              {project.role && <p className="text-sm text-slate-600 mb-2">{project.role}</p>}

              {project.description && (
                <p className="text-sm text-slate-500 mb-4">{project.description}</p>
              )}

              {(project.contents?.length ?? 0) > 0 && (
                <div className="space-y-3 mb-4">
                  {project.contents?.map((content) => (
                    <img
                      key={content.id}
                      src={content.url}
                      alt={project.title}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-end">
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

          {/* Add Project Card - Always visible */}
          <div className="bg-white border border-gray-200 rounded-lg px-10 py-5">
            <div className="flex items-center justify-center border border-gray-200 rounded-lg py-12">
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAddNew}>
                  <Plus className="h-4 w-4" /> Add Project
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </div>

        <DialogContent className="sm:max-w-[782px] max-h-[90vh] overflow-y-auto px-10 py-4">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-semibold text-slate-800">
              {getProjectTitle()}
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
                disabled={isSaveDisabled}
              >
                Save
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 my-4">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </p>
              <Input
                placeholder="Enter a title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="completedOnLudium"
                checked={formData.isCompletedOnLudium}
                onCheckedChange={(checked) => updateField('isCompletedOnLudium', checked === true)}
              />
              <label
                htmlFor="completedOnLudium"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                This project was completed on Ludium
              </label>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Role <span className="text-red-500">*</span>
              </p>
              <Input
                placeholder="Enter your role"
                value={formData.role}
                onChange={(e) => updateField('role', e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </p>
              <Textarea
                placeholder="Enter a brief project description"
                value={formData.description}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    updateField('description', e.target.value);
                  }
                }}
                className="min-h-[150px] resize-none"
              />
              <p className="text-sm text-gray-400 text-right mt-1">
                {(formData.description || '').length}/1000 characters
              </p>
            </div>

            {(formData.contents?.length ?? 0) > 0 && (
              <div className="space-y-4">
                {formData.contents?.map((content) => (
                  <div
                    key={content.id}
                    className="relative border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img
                      src={content.url}
                      alt="Project content"
                      className="w-full h-auto object-contain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                      onClick={() => handleRemoveContent(content.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center bg-slate-50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleAddContent}
              >
                <Plus className="h-4 w-4" />
                Add Contents
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioPage;
