import { Education } from '../../types/resume';
import { formatDate } from '../../lib/utils';
import { useHighlight } from '../../hooks/useHighlight';
import { useResumeStore } from '../../store/resumeStore';

interface EducationItemProps {
  education: Education;
}

export const EducationItem = ({ education }: EducationItemProps) => {
  const isHighlighted = useHighlight(`education-${education.id}`);
  const { styling } = useResumeStore();
  const isCompact = styling.spacing === 'compact';

  const dateRange = education.startDate && education.endDate
    ? `${formatDate(education.startDate)} - ${formatDate(education.endDate)}`
    : education.endDate || '';

  return (
    <div className={`${isCompact ? 'mb-1' : 'mb-3'} ${isHighlighted ? 'highlight-flash' : ''}`}>
      <div className={`flex justify-between items-start ${isCompact ? 'mb-0' : 'mb-1'}`}>
        <div>
          <h3
            className={`font-semibold ${isCompact ? 'text-base' : 'text-lg'}`}
            style={{ fontFamily: 'var(--resume-font-heading)', color: 'var(--resume-color-primary)' }}
          >
            {education.school}
          </h3>
          <p className={isCompact ? 'text-sm' : 'text-base'} style={{ color: 'var(--resume-color-text)' }}>
            {education.degree}{education.field ? ` in ${education.field}` : ''}
          </p>
          {education.location && (
            <p className={isCompact ? 'text-xs' : 'text-sm'} style={{ color: 'var(--resume-color-secondary)' }}>
              {education.location}
            </p>
          )}
        </div>
        {dateRange && (
          <span className={`${isCompact ? 'text-xs' : 'text-sm'} whitespace-nowrap ml-4`} style={{ color: 'var(--resume-color-secondary)' }}>
            {dateRange}
          </span>
        )}
      </div>

      {education.gpa && (
        <p className={`${isCompact ? 'text-xs' : 'text-sm'} ${isCompact ? 'mt-0' : 'mt-1'}`} style={{ color: 'var(--resume-color-text)' }}>
          GPA: {education.gpa}
        </p>
      )}
    </div>
  );
};
