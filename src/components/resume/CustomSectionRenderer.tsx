import { CustomSection } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';

interface CustomSectionRendererProps {
  section: CustomSection;
}

export const CustomSectionRenderer = ({ section }: CustomSectionRendererProps) => {
  const { styling } = useResumeStore();
  const isCompact = styling.spacing === 'compact';

  return (
    <div className={isCompact ? 'space-y-0.5' : 'space-y-3'}>
      {section.items.map((item) => (
        <div key={item.id} className={isCompact ? 'mb-1' : 'mb-3'}>
          <div className="flex justify-between items-baseline">
            {item.title && (
              <h3
                className={`font-semibold ${isCompact ? 'text-base' : 'text-lg'}`}
                style={{
                  fontFamily: 'var(--resume-font-heading)',
                  color: 'var(--resume-color-text)',
                }}
              >
                {item.title}
              </h3>
            )}
            {item.date && (
              <span
                className={isCompact ? 'text-xs' : 'text-sm'}
                style={{ color: 'var(--resume-color-secondary)' }}
              >
                {item.date}
              </span>
            )}
          </div>

          {item.subtitle && (
            <p
              className={`${isCompact ? 'text-xs mb-0.5' : 'text-sm mb-1'}`}
              style={{ color: 'var(--resume-color-secondary)' }}
            >
              {item.subtitle}
            </p>
          )}

          {item.description && (
            <p
              className={`${isCompact ? 'text-sm mb-1' : 'text-base mb-2'}`}
              style={{
                fontFamily: 'var(--resume-font-body)',
                color: 'var(--resume-color-text)',
              }}
            >
              {item.description}
            </p>
          )}

          {item.details && item.details.length > 0 && (
            <ul className={`list-disc list-inside ${isCompact ? 'space-y-0' : 'space-y-1'}`}>
              {item.details.map((detail, index) => (
                <li
                  key={index}
                  className={isCompact ? 'text-xs leading-tight' : 'text-sm'}
                  style={{
                    fontFamily: 'var(--resume-font-body)',
                    color: 'var(--resume-color-text)',
                  }}
                >
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
