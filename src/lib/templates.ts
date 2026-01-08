import { TemplateWithCategory, TemplateCategory } from '../types/template';

export const RESUME_TEMPLATES: TemplateWithCategory[] = [
  {
    id: 'classic-single',
    name: 'Classic',
    description: 'Traditional single-column layout with clean typography',
    category: 'traditional',
    styling: {
      colors: {
        primary: '#2c3e50',
        secondary: '#7f8c8d',
        text: '#2c3e50',
        background: '#ffffff',
      },
      fonts: {
        heading: 'serif',
        body: 'serif',
      },
      layout: 'traditional',
      spacing: 'normal',
      headerAlignment: 'left',
    },
    layoutConfig: {
      columns: 1,
    },
    sectionOrder: ['header', 'experience', 'education', 'skills'],
  },
  {
    id: 'modern-two-column',
    name: 'Modern Professional',
    description: 'Two-column layout with bold colors and sans-serif fonts',
    category: 'modern',
    styling: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        text: '#1e293b',
        background: '#ffffff',
      },
      fonts: {
        heading: 'sans-serif',
        body: 'sans-serif',
      },
      layout: 'modern',
      spacing: 'compact',
      headerAlignment: 'left',
    },
    layoutConfig: {
      columns: 2,
      leftSections: ['header', 'skills'],
      rightSections: ['experience', 'education'],
    },
    sectionOrder: ['header', 'skills', 'experience', 'education'],
  },
  {
    id: 'minimal-centered',
    name: 'Minimal',
    description: 'Minimalist design with centered header and generous spacing',
    category: 'minimal',
    styling: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        text: '#333333',
        background: '#ffffff',
      },
      fonts: {
        heading: 'sans-serif',
        body: 'sans-serif',
      },
      layout: 'minimal',
      spacing: 'relaxed',
      headerAlignment: 'center',
    },
    layoutConfig: {
      columns: 1,
    },
    sectionOrder: ['header', 'experience', 'skills', 'education'],
  },
  {
    id: 'creative-accent',
    name: 'Creative',
    description: 'Eye-catching design with vibrant accent colors',
    category: 'creative',
    styling: {
      colors: {
        primary: '#8b5cf6',
        secondary: '#6b7280',
        text: '#111827',
        background: '#ffffff',
      },
      fonts: {
        heading: 'sans-serif',
        body: 'sans-serif',
      },
      layout: 'modern',
      spacing: 'normal',
      headerAlignment: 'left',
    },
    layoutConfig: {
      columns: 1,
    },
    sectionOrder: ['header', 'skills', 'experience', 'education'],
  },
  {
    id: 'tech-sidebar',
    name: 'Tech Sidebar',
    description: 'Developer-focused with skills sidebar and monospace accents',
    category: 'modern',
    styling: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#64748b',
        text: '#0f172a',
        background: '#ffffff',
      },
      fonts: {
        heading: 'sans-serif',
        body: 'sans-serif',
      },
      layout: 'modern',
      spacing: 'compact',
      headerAlignment: 'left',
    },
    layoutConfig: {
      columns: 2,
      leftSections: ['header', 'skills'],
      rightSections: ['experience', 'education'],
    },
    sectionOrder: ['header', 'skills', 'experience', 'education'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional serif design for senior positions',
    category: 'traditional',
    styling: {
      colors: {
        primary: '#1e40af',
        secondary: '#64748b',
        text: '#1e293b',
        background: '#ffffff',
      },
      fonts: {
        heading: 'serif',
        body: 'serif',
      },
      layout: 'traditional',
      spacing: 'relaxed',
      headerAlignment: 'center',
    },
    layoutConfig: {
      columns: 1,
    },
    sectionOrder: ['header', 'experience', 'education', 'skills'],
  },
];

export const getTemplateById = (id: string) => {
  return RESUME_TEMPLATES.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: TemplateCategory) => {
  return RESUME_TEMPLATES.filter((template) => template.category === category);
};
