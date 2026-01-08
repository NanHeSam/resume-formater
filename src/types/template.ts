import { StylingConfig } from './style';
import { LayoutConfig } from './resume';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  previewImage?: string;
  styling: StylingConfig;
  layoutConfig: LayoutConfig;
  sectionOrder: string[]; // Section IDs in order
}

export type TemplateCategory = 'modern' | 'traditional' | 'creative' | 'minimal';

export interface TemplateWithCategory extends ResumeTemplate {
  category: TemplateCategory;
}
