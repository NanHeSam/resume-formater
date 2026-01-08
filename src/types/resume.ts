export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  details?: string[];
  date?: string;
}

export type SectionType = 'header' | 'experience' | 'education' | 'skills' | 'custom';

export interface SectionConfig {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
  customSectionId?: string; // Reference to CustomSection if type is 'custom'
}

export interface LayoutConfig {
  columns: 1 | 2;
  leftSections?: string[]; // Section IDs for left column (if 2-column)
  rightSections?: string[]; // Section IDs for right column (if 2-column)
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  profileImage: string | null;
  customSections: CustomSection[];
  sectionConfigs: SectionConfig[];
  layoutConfig: LayoutConfig;
}
