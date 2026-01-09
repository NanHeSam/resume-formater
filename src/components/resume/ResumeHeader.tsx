import { PersonalInfo } from '../../types/resume';
import { AlignmentType } from '../../types/style';
import { useHighlight } from '../../hooks/useHighlight';
import { useResumeStore } from '../../store/resumeStore';

interface ResumeHeaderProps {
  personalInfo: PersonalInfo;
  profileImage: string | null;
  alignment: AlignmentType;
  summaryAlignment?: AlignmentType;
}

export const ResumeHeader = ({ personalInfo, profileImage, alignment, summaryAlignment }: ResumeHeaderProps) => {
  const { name, email, phone, location, summary } = personalInfo;
  const isHighlighted = useHighlight('header');
  const isImageHighlighted = useHighlight('profile-image');
  const { styling } = useResumeStore();
  const isCompact = styling.spacing === 'compact';

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Use summaryAlignment if provided, otherwise fall back to header alignment
  const summaryAlign = summaryAlignment || alignment;

  const justifyClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const getContainerClasses = () => ({
    left: `flex items-start ${isCompact ? 'gap-2' : 'gap-6'}`,
    center: `flex flex-col items-center ${isCompact ? 'gap-1' : 'gap-4'}`,
    right: `flex flex-row-reverse items-start ${isCompact ? 'gap-2' : 'gap-6'}`,
  });

  const containerClasses = getContainerClasses();

  return (
    <div className={`${isCompact ? 'mb-1' : 'mb-6'} ${isHighlighted ? 'highlight-flash' : ''}`}>
      <div className={containerClasses[alignment]}>
        {profileImage && (
          <img
            src={profileImage}
            alt={name}
            className={`${isCompact ? 'w-12 h-12' : 'w-24 h-24'} rounded-full object-cover ${isCompact ? 'border' : 'border-4'} ${isImageHighlighted ? 'highlight-flash' : ''}`}
            style={{ borderColor: 'var(--resume-color-primary)' }}
          />
        )}

        <div className={`flex-1 ${alignmentClasses[alignment]}`}>
          <h1
            className={`${isCompact ? 'text-xl' : 'text-4xl'} font-bold ${isCompact ? 'mb-0' : 'mb-2'}`}
            style={{
              fontFamily: 'var(--resume-font-heading)',
              color: 'var(--resume-color-primary)',
            }}
          >
            {name || 'Your Name'}
          </h1>

          <div className={`flex flex-wrap ${isCompact ? 'gap-1.5 text-xs' : 'gap-3 text-sm'} ${isCompact ? 'mb-0' : 'mb-2'} ${justifyClasses[alignment]}`} style={{ color: 'var(--resume-color-secondary)' }}>
            {email && (
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            )}
            {phone && <span>{phone}</span>}
            {location && <span>{location}</span>}
          </div>

          {summary && (
            <p
              className={`${isCompact ? 'text-xs mt-0.5 leading-tight' : 'text-base mt-3 leading-relaxed'} ${alignmentClasses[summaryAlign]}`}
              style={{
                fontFamily: 'var(--resume-font-body)',
                color: 'var(--resume-color-text)',
              }}
            >
              {summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
