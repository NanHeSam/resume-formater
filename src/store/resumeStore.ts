import { create } from 'zustand';
import { PersonalInfo, Experience, Education, CustomSection, CustomSectionItem, SectionConfig, LayoutConfig } from '../types/resume';
import { StylingConfig, DEFAULT_STYLING } from '../types/style';
import { ResumeTemplate } from '../types/template';

interface ResumeStore {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  profileImage: string | null;
  styling: StylingConfig;
  customSections: CustomSection[];
  sectionConfigs: SectionConfig[];
  layoutConfig: LayoutConfig;
  customHtmlMode: boolean;
  customHtml: string | null;

  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  setProfileImage: (imageDataURL: string | null) => void;
  updateStyling: (style: Partial<StylingConfig>) => void;
  addCustomSection: (section: CustomSection) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string, item: CustomSectionItem) => void;
  updateSectionConfig: (id: string, config: Partial<SectionConfig>) => void;
  updateLayoutConfig: (config: Partial<LayoutConfig>) => void;
  reorderSections: (sectionIds: string[]) => void;
  applyTemplate: (template: ResumeTemplate) => void;
  setCustomHtmlMode: (enabled: boolean) => void;
  setCustomHtml: (html: string | null) => void;
  reset: () => void;
}

const initialState = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  profileImage: null,
  styling: DEFAULT_STYLING,
  customSections: [],
  sectionConfigs: [
    { id: 'header', type: 'header' as const, visible: true, order: 0 },
    { id: 'experience', type: 'experience' as const, visible: true, order: 1 },
    { id: 'education', type: 'education' as const, visible: true, order: 2 },
    { id: 'skills', type: 'skills' as const, visible: true, order: 3 },
  ],
  layoutConfig: {
    columns: 1 as const,
  },
  customHtmlMode: false,
  customHtml: null,
};

export const useResumeStore = create<ResumeStore>((set) => ({
  ...initialState,

  updatePersonalInfo: (info) =>
    set((state) => ({
      personalInfo: { ...state.personalInfo, ...info },
    })),

  addExperience: (exp) =>
    set((state) => ({
      experience: [...state.experience, exp],
    })),

  updateExperience: (id, exp) =>
    set((state) => ({
      experience: state.experience.map((e) =>
        e.id === id ? { ...e, ...exp } : e
      ),
    })),

  removeExperience: (id) =>
    set((state) => ({
      experience: state.experience.filter((e) => e.id !== id),
    })),

  addEducation: (edu) =>
    set((state) => ({
      education: [...state.education, edu],
    })),

  updateEducation: (id, edu) =>
    set((state) => ({
      education: state.education.map((e) =>
        e.id === id ? { ...e, ...edu } : e
      ),
    })),

  removeEducation: (id) =>
    set((state) => ({
      education: state.education.filter((e) => e.id !== id),
    })),

  updateSkills: (skills) => set({ skills }),

  addSkill: (skill) =>
    set((state) => ({
      skills: [...state.skills, skill],
    })),

  removeSkill: (skill) =>
    set((state) => ({
      skills: state.skills.filter((s) => s !== skill),
    })),

  setProfileImage: (imageDataURL) => set({ profileImage: imageDataURL }),

  updateStyling: (style) =>
    set((state) => ({
      styling: { ...state.styling, ...style },
    })),

  addCustomSection: (section) =>
    set((state) => {
      const newSectionConfig: SectionConfig = {
        id: section.id,
        type: 'custom',
        visible: true,
        order: state.sectionConfigs.length,
        customSectionId: section.id,
      };
      return {
        customSections: [...state.customSections, section],
        sectionConfigs: [...state.sectionConfigs, newSectionConfig],
      };
    }),

  updateCustomSection: (id, section) =>
    set((state) => ({
      customSections: state.customSections.map((s) =>
        s.id === id ? { ...s, ...section } : s
      ),
    })),

  removeCustomSection: (id) =>
    set((state) => ({
      customSections: state.customSections.filter((s) => s.id !== id),
      sectionConfigs: state.sectionConfigs.filter((c) => c.customSectionId !== id),
    })),

  addCustomSectionItem: (sectionId, item) =>
    set((state) => ({
      customSections: state.customSections.map((section) =>
        section.id === sectionId
          ? { ...section, items: [...section.items, item] }
          : section
      ),
    })),

  updateSectionConfig: (id, config) =>
    set((state) => ({
      sectionConfigs: state.sectionConfigs.map((c) =>
        c.id === id ? { ...c, ...config } : c
      ),
    })),

  updateLayoutConfig: (config) =>
    set((state) => ({
      layoutConfig: { ...state.layoutConfig, ...config },
    })),

  reorderSections: (sectionIds) =>
    set((state) => ({
      sectionConfigs: sectionIds.map((id, index) => {
        const config = state.sectionConfigs.find((c) => c.id === id);
        return config ? { ...config, order: index } : config!;
      }).filter(Boolean),
    })),

  applyTemplate: (template) =>
    set((state) => {
      // Reorder sections based on template, keeping only sections that exist
      const reorderedConfigs = template.sectionOrder
        .map((sectionId) => state.sectionConfigs.find((c) => c.id === sectionId))
        .filter(Boolean)
        .map((config, index) => ({ ...config!, order: index }));

      // Add any custom sections that weren't in the template order
      const customConfigs = state.sectionConfigs
        .filter(
          (c) =>
            c.type === 'custom' &&
            !template.sectionOrder.includes(c.id)
        )
        .map((config, index) => ({
          ...config,
          order: reorderedConfigs.length + index,
        }));

      return {
        styling: template.styling,
        layoutConfig: template.layoutConfig,
        sectionConfigs: [...reorderedConfigs, ...customConfigs],
      };
    }),

  setCustomHtmlMode: (enabled) =>
    set({ customHtmlMode: enabled, customHtml: enabled ? null : null }),

  setCustomHtml: (html) =>
    set({ customHtml: html }),

  reset: () => set(initialState),
}));
