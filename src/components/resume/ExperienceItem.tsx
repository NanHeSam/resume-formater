import { Experience } from '../../types/resume';
import { formatDate } from '../../lib/utils';
import { useHighlight } from '../../hooks/useHighlight';
import { useResumeStore } from '../../store/resumeStore';

interface ExperienceItemProps {
  experience: Experience;
}

export const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  const isHighlighted = useHighlight(`experience-${experience.id}`);
  const { styling } = useResumeStore();
  const isCompact = styling.spacing === 'compact';

  const dateRange = experience.current
    ? `${formatDate(experience.startDate)} - Present`
    : `${formatDate(experience.startDate)} - ${formatDate(experience.endDate)}`;

  return (
    <div className={`${isCompact ? 'mb-1' : 'mb-4'} ${isHighlighted ? 'highlight-flash' : ''}`}>
      <div className={`flex justify-between items-start ${isCompact ? 'mb-0' : 'mb-1'}`}>
        <div>
          <h3
            className={`font-semibold ${isCompact ? 'text-base' : 'text-lg'}`}
            style={{ fontFamily: 'var(--resume-font-heading)', color: 'var(--resume-color-primary)' }}
          >
            {experience.role}
          </h3>
          <p className={`${isCompact ? 'text-sm' : 'text-base'} font-medium`} style={{ color: 'var(--resume-color-text)' }}>
            {experience.company}
            {experience.location && ` • ${experience.location}`}
          </p>
        </div>
        <span className={`${isCompact ? 'text-xs' : 'text-sm'} whitespace-nowrap ml-4`} style={{ color: 'var(--resume-color-secondary)' }}>
          {dateRange}
        </span>
      </div>

      {experience.achievements.length > 0 && (
        <ul className={`list-disc list-inside ${isCompact ? 'mt-0 space-y-0' : 'mt-2 space-y-1'}`}>
          {experience.achievements.map((achievement, index) => (
            <li
              key={index}
              className={`${isCompact ? 'text-xs leading-tight' : 'text-sm leading-relaxed'}`}
              style={{ fontFamily: 'var(--resume-font-body)', color: 'var(--resume-color-text)' }}
            >
              {achievement}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
