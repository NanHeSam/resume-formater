import { Education } from '../../types/resume';
import { formatDate } from '../../lib/utils';
import { useHighlight } from '../../hooks/useHighlight';

interface EducationItemProps {
  education: Education;
}

export const EducationItem = ({ education }: EducationItemProps) => {
  const isHighlighted = useHighlight(`education-${education.id}`);
  const dateRange = education.startDate && education.endDate
    ? `${formatDate(education.startDate)} - ${formatDate(education.endDate)}`
    : education.endDate || '';

  return (
    <div className={`mb-3 ${isHighlighted ? 'highlight-flash' : ''}`}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3
            className="font-semibold text-lg"
            style={{ fontFamily: 'var(--resume-font-heading)', color: 'var(--resume-color-primary)' }}
          >
            {education.school}
          </h3>
          <p className="text-base" style={{ color: 'var(--resume-color-text)' }}>
            {education.degree}{education.field ? ` in ${education.field}` : ''}
          </p>
          {education.location && (
            <p className="text-sm" style={{ color: 'var(--resume-color-secondary)' }}>
              {education.location}
            </p>
          )}
        </div>
        {dateRange && (
          <span className="text-sm whitespace-nowrap ml-4" style={{ color: 'var(--resume-color-secondary)' }}>
            {dateRange}
          </span>
        )}
      </div>

      {education.gpa && (
        <p className="text-sm mt-1" style={{ color: 'var(--resume-color-text)' }}>
          GPA: {education.gpa}
        </p>
      )}
    </div>
  );
};
