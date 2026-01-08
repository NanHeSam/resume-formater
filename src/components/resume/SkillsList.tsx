import { useHighlight } from '../../hooks/useHighlight';

interface SkillsListProps {
  skills: string[];
}

export const SkillsList = ({ skills }: SkillsListProps) => {
  const isHighlighted = useHighlight('skills');

  if (skills.length === 0) return null;

  return (
    <div className={isHighlighted ? 'highlight-flash' : ''}>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm font-medium"
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
