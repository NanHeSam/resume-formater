import { CustomSection } from '../../types/resume';

interface CustomSectionRendererProps {
  section: CustomSection;
}

export const CustomSectionRenderer = ({ section }: CustomSectionRendererProps) => {
  return (
    <div className="space-y-3">
      {section.items.map((item) => (
        <div key={item.id} className="mb-3">
          <div className="flex justify-between items-baseline">
            {item.title && (
              <h3
                className="text-lg font-semibold"
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
                className="text-sm"
                style={{ color: 'var(--resume-color-secondary)' }}
              >
                {item.date}
              </span>
            )}
          </div>

          {item.subtitle && (
            <p
              className="text-sm mb-1"
              style={{ color: 'var(--resume-color-secondary)' }}
            >
              {item.subtitle}
            </p>
          )}

          {item.description && (
            <p
              className="text-base mb-2"
              style={{
                fontFamily: 'var(--resume-font-body)',
                color: 'var(--resume-color-text)',
              }}
            >
              {item.description}
            </p>
          )}

          {item.details && item.details.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {item.details.map((detail, index) => (
                <li
                  key={index}
                  className="text-sm"
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
