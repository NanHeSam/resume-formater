import { useResumeStore } from '../../store/resumeStore';
import { ResumeHeader } from './ResumeHeader';
import { ExperienceItem } from './ExperienceItem';
import { EducationItem } from './EducationItem';
import { SkillsList } from './SkillsList';
import { CustomSectionRenderer } from './CustomSectionRenderer';
import { getSpacingValue, getFontFamily } from '../../lib/utils';
import { SectionConfig } from '../../types/resume';
import { useHighlight } from '../../hooks/useHighlight';
import { AnimatePresence, motion } from 'framer-motion';

export const ResumeDocument = () => {
  const {
    personalInfo,
    experience,
    education,
    skills,
    profileImage,
    styling,
    customSections,
    sectionConfigs,
    layoutConfig,
    customHtmlMode,
    customHtml
  } = useResumeStore();

  const isStylingHighlighted = useHighlight('styling');

  const getLayoutClasses = () => {
    const isCompact = styling.spacing === 'compact';
    return {
      traditional: isCompact ? 'max-w-5xl mx-auto px-12 py-4' : 'max-w-3xl mx-auto p-8',
      modern: isCompact ? 'max-w-6xl mx-auto px-12 py-4 bg-gradient-to-br from-white to-gray-50' : 'max-w-4xl mx-auto p-10 bg-gradient-to-br from-white to-gray-50',
      minimal: isCompact ? 'max-w-5xl mx-auto px-12 py-4' : 'max-w-2xl mx-auto p-4',
    };
  };

  const layoutClasses = getLayoutClasses();

  const spacingClasses = {
    compact: 'space-y-0.5',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  };

  const sectionMarginClasses = {
    compact: 'mb-1',
    normal: 'mb-6',
    relaxed: 'mb-8',
  };

  const resumeStyle = {
    '--resume-color-primary': styling.colors.primary,
    '--resume-color-secondary': styling.colors.secondary,
    '--resume-color-text': styling.colors.text,
    '--resume-color-background': styling.colors.background,
    '--resume-font-heading': getFontFamily(styling.fonts.heading),
    '--resume-font-body': getFontFamily(styling.fonts.body),
    '--resume-spacing': getSpacingValue(styling.spacing),
  } as React.CSSProperties;

  const sectionTitleClasses = {
    compact: 'text-base font-bold mb-0.5 pb-0.5 border-b',
    normal: 'text-2xl font-bold mb-3 pb-2 border-b-2',
    relaxed: 'text-2xl font-bold mb-4 pb-2 border-b-2',
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className={sectionTitleClasses[styling.spacing]}
      style={{
        fontFamily: 'var(--resume-font-heading)',
        color: 'var(--resume-color-primary)',
        borderColor: 'var(--resume-color-primary)',
      }}
    >
      {children}
    </h2>
  );

  const renderSection = (config: SectionConfig) => {
    if (!config.visible) return null;

    const sectionContent = (() => {
      switch (config.type) {
        case 'header':
          return (
            <ResumeHeader personalInfo={personalInfo} profileImage={profileImage} alignment={styling.headerAlignment} summaryAlignment={styling.summaryAlignment} />
          );

        case 'experience':
          if (experience.length === 0) return null;
          return (
            <section className={sectionMarginClasses[styling.spacing]}>
              <SectionTitle>Experience</SectionTitle>
              <div className={spacingClasses[styling.spacing]}>
                {experience.map((exp) => (
                  <ExperienceItem key={exp.id} experience={exp} />
                ))}
              </div>
            </section>
          );

        case 'education':
          if (education.length === 0) return null;
          return (
            <section className={sectionMarginClasses[styling.spacing]}>
              <SectionTitle>Education</SectionTitle>
              <div className={spacingClasses[styling.spacing]}>
                {education.map((edu) => (
                  <EducationItem key={edu.id} education={edu} />
                ))}
              </div>
            </section>
          );

        case 'skills':
          if (skills.length === 0) return null;
          return (
            <section className={sectionMarginClasses[styling.spacing]}>
              <SectionTitle>Skills</SectionTitle>
              <SkillsList skills={skills} />
            </section>
          );

        case 'custom':
          if (!config.customSectionId) return null;
          const customSection = customSections.find((s) => s.id === config.customSectionId);
          if (!customSection) return null;
          return (
            <section className={sectionMarginClasses[styling.spacing]}>
              <SectionTitle>{customSection.title}</SectionTitle>
              <CustomSectionRenderer section={customSection} />
            </section>
          );

        default:
          return null;
      }
    })();

    if (!sectionContent) return null;

    return (
      <motion.div
        key={config.id}
        initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
        animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
        exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
        transition={{
          duration: 0.4,
          ease: 'easeInOut',
          opacity: { duration: 0.3 }
        }}
      >
        {sectionContent}
      </motion.div>
    );
  };

  // Sort sections by order and render them
  const sortedSections = [...sectionConfigs].sort((a, b) => a.order - b.order);

  // Custom HTML mode
  if (customHtmlMode && customHtml) {
    return (
      <div className="relative">
        {/* Page break indicators */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 297mm, #e5e7eb 297mm, #e5e7eb calc(297mm + 2px))',
            backgroundPosition: 'top',
          }}
        />

        <div
          id="resume-document"
          className="max-w-4xl mx-auto p-8 min-h-[297mm] bg-white shadow-lg relative"
          dangerouslySetInnerHTML={{ __html: customHtml }}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Page break indicators */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 297mm, #e5e7eb 297mm, #e5e7eb calc(297mm + 2px))',
          backgroundPosition: 'top',
        }}
      />

      <div
        id="resume-document"
        className={`${layoutClasses[styling.layout]} ${spacingClasses[styling.spacing]} min-h-[297mm] bg-white shadow-lg relative ${isStylingHighlighted ? 'highlight-flash' : ''}`}
        style={{
          ...resumeStyle,
          backgroundColor: styling.colors.background,
        }}
      >
        {layoutConfig.columns === 1 ? (
          // Single column layout
          <div className={spacingClasses[styling.spacing]}>
            <AnimatePresence mode="sync">
              {sortedSections.map(renderSection)}
            </AnimatePresence>
          </div>
        ) : (
          // Two column layout
          <div className="grid grid-cols-[40%_60%] gap-6 resume-columns">
            <div className={`${spacingClasses[styling.spacing]} pr-4`}>
              <AnimatePresence mode="sync">
                {layoutConfig.leftSections?.map((sectionId) => {
                  const config = sectionConfigs.find((c) => c.id === sectionId);
                  return config ? renderSection(config) : null;
                })}
              </AnimatePresence>
            </div>
            <div className={spacingClasses[styling.spacing]}>
              <AnimatePresence mode="sync">
                {layoutConfig.rightSections?.map((sectionId) => {
                  const config = sectionConfigs.find((c) => c.id === sectionId);
                  return config ? renderSection(config) : null;
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
