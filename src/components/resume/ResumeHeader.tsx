import { PersonalInfo } from '../../types/resume';
import { AlignmentType } from '../../types/style';
import { useHighlight } from '../../hooks/useHighlight';

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

  const containerClasses = {
    left: 'flex items-start gap-6',
    center: 'flex flex-col items-center gap-4',
    right: 'flex flex-row-reverse items-start gap-6',
  };

  return (
    <div className={`mb-6 ${isHighlighted ? 'highlight-flash' : ''}`}>
      <div className={containerClasses[alignment]}>
        {profileImage && (
          <img
            src={profileImage}
            alt={name}
            className={`w-24 h-24 rounded-full object-cover border-4 ${isImageHighlighted ? 'highlight-flash' : ''}`}
            style={{ borderColor: 'var(--resume-color-primary)' }}
          />
        )}

        <div className={`flex-1 ${alignmentClasses[alignment]}`}>
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: 'var(--resume-font-heading)',
              color: 'var(--resume-color-primary)',
            }}
          >
            {name || 'Your Name'}
          </h1>

          <div className={`flex flex-wrap gap-3 text-sm mb-2 ${justifyClasses[alignment]}`} style={{ color: 'var(--resume-color-secondary)' }}>
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
              className={`text-base mt-3 leading-relaxed ${alignmentClasses[summaryAlign]}`}
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
