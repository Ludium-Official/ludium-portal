import { useCreatePortfolioV2Mutation } from '@/apollo/mutation/create-portfolio-v2.generated';
import { useDeletePortfolioV2Mutation } from '@/apollo/mutation/delete-portfolio-v2.generated';
import { useUpdatePortfolioV2Mutation } from '@/apollo/mutation/update-portfolio-v2.generated';
import { useMyPortfoliosV2Query } from '@/apollo/queries/my-portfolios-v2.generated';
import LudiumBadgeLogo from '@/assets/icons/profile/ludium-badge.svg';
import Container from '@/components/layout/container';
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
import notify from '@/lib/notify';
import type { Portfolio, ProjectContent, ProjectFormData } from '@/types/portfolio';
import { Loader2, Pen, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PortfolioDetailModal } from './_components/portfolio-detail-modal';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';

const getEmptyFormData = (): ProjectFormData => ({
  title: '',
  isLudiumProject: false,
  role: '',
  description: '',
  contents: [],
  existingImages: [],
});

const PortfolioPage: React.FC = () => {
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(getEmptyFormData());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data,
    loading: isLoading,
    refetch,
  } = useMyPortfoliosV2Query({
    fetchPolicy: 'network-only',
  });

  const [createPortfolio, { loading: isCreating }] = useCreatePortfolioV2Mutation();
  const [updatePortfolio, { loading: isUpdating }] = useUpdatePortfolioV2Mutation();
  const [deletePortfolio, { loading: isDeleting }] = useDeletePortfolioV2Mutation();

  const portfolios = data?.myPortfoliosV2 || [];

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingId(null);
      setFormData(getEmptyFormData());
    }
    setIsOpen(open);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(getEmptyFormData());
    setIsOpen(true);
  };

  const handleEdit = (portfolio: Portfolio) => {
    if (!portfolio) return;

    setIsDetailOpen(false);
    setEditingId(portfolio.id || null);
    setFormData({
      id: portfolio.id || undefined,
      title: portfolio.title || '',
      isLudiumProject: portfolio.isLudiumProject || false,
      role: portfolio.role || '',
      description: portfolio.description || '',
      contents: [],
      existingImages: portfolio.images || [],
    });
    setIsOpen(true);
  };

  const handleViewDetail = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPortfolio(null);
  };

  const handleSave = async () => {
    try {
      const newImageFiles = formData.contents.filter((c) => c.file).map((c) => c.file as File);

      if (editingId) {
        await updatePortfolio({
          variables: {
            input: {
              id: editingId,
              title: formData.title,
              description: formData.description || undefined,
              role: formData.role || undefined,
              isLudiumProject: formData.isLudiumProject,
              existingImageUrls: formData.existingImages,
              newImages: newImageFiles.length > 0 ? newImageFiles : undefined,
            },
          },
        });
        notify('Portfolio updated successfully', 'success');
      } else {
        await createPortfolio({
          variables: {
            input: {
              title: formData.title,
              description: formData.description || undefined,
              role: formData.role || undefined,
              isLudiumProject: formData.isLudiumProject,
              images: newImageFiles.length > 0 ? newImageFiles : undefined,
            },
          },
        });
        notify('Portfolio created successfully', 'success');
      }

      await refetch();
      setIsOpen(false);
      setEditingId(null);
      setFormData(getEmptyFormData());
    } catch (error) {
      console.error('Failed to save portfolio:', error);
      notify('Failed to save portfolio', 'error');
    }
  };

  const handleCancel = () => {
    setFormData(getEmptyFormData());
    setEditingId(null);
    setIsOpen(false);
  };

  const updateField = (
    field: keyof ProjectFormData,
    value: string | boolean | ProjectContent[] | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddContent = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)) {
      notify('Please upload a valid image file', 'error');
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
      contents: [...prev.contents, newContent],
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveContent = (contentId: string) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents.filter((c) => c.id !== contentId),
    }));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img !== imageUrl),
    }));
  };

  const getProjectTitle = () => {
    if (editingId) {
      const index = portfolios.findIndex((p) => p?.id === editingId);
      return `Project ${index + 1}`;
    }
    return `Project ${portfolios.length + 1}`;
  };

  const handleDelete = async (id: string) => {
    if (!id) return;

    try {
      await deletePortfolio({
        variables: { id },
      });
      notify('Portfolio deleted successfully', 'success');
      await refetch();
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
      notify('Failed to delete portfolio', 'error');
    }
  };

  const isSaveDisabled = !formData.title.trim() || isCreating || isUpdating || isDeleting;
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    return () => {
      formData.contents.forEach((content) => {
        if (content.url.startsWith('blob:')) {
          URL.revokeObjectURL(content.url);
        }
      });
    };
  }, [formData.contents]);

  if (isLoading) {
    return (
      <Container className="my-10 space-y-5 max-w-[820px]">
        <div className="mb-2 text-xl font-bold">Portfolio</div>
        <div className="text-gray-500">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="my-10 space-y-5 max-w-[820px]">
      <div className={cn('mb-2 text-xl font-bold', isMobile && 'text-sm')}>Portfolio</div>
      <div className={cn('mb-6 text-gray-500 text-sm', isMobile && 'text-xs')}>
        Show your work and highlight your best projects.
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <div className="space-y-4">
          {portfolios.map((portfolio, index) => {
            if (!portfolio) return null;

            return (
              <div
                key={portfolio.id || index}
                className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => handleViewDetail(portfolio)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{portfolio.title}</p>
                    {portfolio.isLudiumProject && <img src={LudiumBadgeLogo} alt="Ludium Badge" />}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(portfolio);
                    }}
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                </div>

                {portfolio.role && <p className="text-sm text-slate-600 mb-2">{portfolio.role}</p>}

                {portfolio.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {portfolio.description}
                  </p>
                )}

                {(portfolio.images?.length ?? 0) > 0 && (
                  <div className="flex items-center justify-center bg-slate-50 p-4 rounded-lg mb-4">
                    <img
                      src={portfolio.images?.[0] || ''}
                      alt={portfolio.title || 'Portfolio image'}
                      className="w-auto h-[343px] object-contain rounded-lg"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-xs text-gray-400 underline disabled:opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      portfolio.id && handleDelete(portfolio.id);
                    }}
                    disabled={isDeleting}
                  >
                    delete
                  </button>
                </div>
              </div>
            );
          })}

          <div
            className={cn(
              'bg-white border border-gray-200 rounded-lg px-10 py-5',
              isMobile && 'px-5',
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center border border-gray-200 rounded-lg py-12',
                isMobile && 'py-15',
              )}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAddNew}>
                  <Plus className="h-4 w-4" /> Add Project
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </div>

        {isMobile ? (
          isOpen && (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
              <header className="relative flex items-center justify-center px-4 py-4 h-17 border-b border-gray-100">
                <button onClick={handleCancel} className="absolute top-4 left-4">
                  <X className="w-6 h-9" />
                </button>
                <span className="text-sm font-medium">{getProjectTitle()}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-4 top-4"
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </Button>
              </header>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-10">
                  <div className={cn(isMobile && 'mb-4')}>
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
                      id="completedOnLudiumMobile"
                      checked={formData.isLudiumProject}
                      onCheckedChange={(checked) =>
                        updateField('isLudiumProject', checked === true)
                      }
                    />
                    <label
                      htmlFor="completedOnLudiumMobile"
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      This project was completed on Ludium
                    </label>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Role</p>
                    <Input
                      placeholder="Enter your role"
                      value={formData.role}
                      onChange={(e) => updateField('role', e.target.value)}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
                    <Textarea
                      placeholder="Enter a brief project description"
                      value={formData.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 1000) {
                          updateField('description', e.target.value);
                        }
                      }}
                      className={cn('min-h-[150px] resize-none', isMobile && 'min-h-[300px]')}
                    />
                    <p className="text-sm text-gray-400 text-right mt-1">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  {formData.existingImages.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-900">Existing Images</p>
                      {formData.existingImages.map((imageUrl, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <img
                            src={imageUrl}
                            alt="Project content"
                            className="w-full h-auto object-contain"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                            onClick={() => handleRemoveExistingImage(imageUrl)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.contents.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-900">New Images</p>
                      {formData.contents.map((content) => (
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

                  <div
                    className={cn(
                      'border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50',
                      isMobile && 'py-15 mb-10',
                    )}
                  >
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
              </div>
            </div>
          )
        ) : (
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
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
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
                  checked={formData.isLudiumProject}
                  onCheckedChange={(checked) => updateField('isLudiumProject', checked === true)}
                />
                <label
                  htmlFor="completedOnLudium"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  This project was completed on Ludium
                </label>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Role</p>
                <Input
                  placeholder="Enter your role"
                  value={formData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
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
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {formData.existingImages.length > 0 && (
                <div className={cn('space-y-4', isMobile && 'mb-10')}>
                  <p className="text-sm font-medium text-gray-900">Existing Images</p>
                  {formData.existingImages.map((imageUrl, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={imageUrl}
                        alt="Project content"
                        className="w-full h-auto object-contain"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {formData.contents.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-900">New Images</p>
                  {formData.contents.map((content) => (
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
        )}
      </Dialog>

      <PortfolioDetailModal
        portfolio={selectedPortfolio}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onEdit={handleEdit}
      />
    </Container>
  );
};

export default PortfolioPage;
