import { useHighlight } from '../../hooks/useHighlight';
import { useResumeStore } from '../../store/resumeStore';

interface SkillsListProps {
  skills: string[];
}

export const SkillsList = ({ skills }: SkillsListProps) => {
  const isHighlighted = useHighlight('skills');
  const { styling } = useResumeStore();
  const isCompact = styling.spacing === 'compact';

  if (skills.length === 0) return null;

  // In compact mode, use comma-separated text instead of badges
  if (isCompact) {
    return (
      <div className={isHighlighted ? 'highlight-flash' : ''}>
        <p
          className="text-xs leading-snug"
          style={{
            fontFamily: 'var(--resume-font-body)',
            color: 'var(--resume-color-text)',
          }}
        >
          {skills.join(' • ')}
        </p>
      </div>
    );
  }

  return (
    <div className={isHighlighted ? 'highlight-flash' : ''}>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 text-sm rounded-full font-medium"
            style={{
              backgroundColor: 'var(--resume-color-primary)',
              color: 'var(--resume-color-background)',
              fontFamily: 'var(--resume-font-body)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};
