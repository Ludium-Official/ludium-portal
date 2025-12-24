import type { PortfolioV2 } from '@/types/types.generated';

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

export type Portfolio = Pick<
  PortfolioV2,
  'id' | 'title' | 'description' | 'role' | 'isLudiumProject' | 'images' | 'createdAt' | 'updatedAt'
>;
