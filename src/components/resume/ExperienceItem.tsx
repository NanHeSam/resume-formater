import { Experience } from '../../types/resume';
import { formatDate } from '../../lib/utils';
import { useHighlight } from '../../hooks/useHighlight';

interface ExperienceItemProps {
  experience: Experience;
}

export const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  const isHighlighted = useHighlight(`experience-${experience.id}`);
  const dateRange = experience.current
    ? `${formatDate(experience.startDate)} - Present`
    : `${formatDate(experience.startDate)} - ${formatDate(experience.endDate)}`;

  return (
    <div className={`mb-4 ${isHighlighted ? 'highlight-flash' : ''}`}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3
            className="font-semibold text-lg"
            style={{ fontFamily: 'var(--resume-font-heading)', color: 'var(--resume-color-primary)' }}
          >
            {experience.role}
          </h3>
          <p className="text-base font-medium" style={{ color: 'var(--resume-color-text)' }}>
            {experience.company}
            {experience.location && ` • ${experience.location}`}
          </p>
        </div>
        <span className="text-sm whitespace-nowrap ml-4" style={{ color: 'var(--resume-color-secondary)' }}>
          {dateRange}
        </span>
      </div>

      {experience.achievements.length > 0 && (
        <ul className="list-disc list-inside mt-2 space-y-1">
          {experience.achievements.map((achievement, index) => (
            <li
              key={index}
              className="text-sm leading-relaxed"
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
