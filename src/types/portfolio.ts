export interface ProjectContent {
  id: string;
  type: 'image';
  url: string;
  file?: File;
}

export interface ProjectFormData {
  id?: string;
  title: string;
  isLudiumProject: boolean;
  role: string;
  description: string;
  contents: ProjectContent[];
  existingImages: string[];
}
