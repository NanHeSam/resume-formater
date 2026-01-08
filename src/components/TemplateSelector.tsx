import { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { RESUME_TEMPLATES } from '../lib/templates';
import { TemplateCategory } from '../types/template';

export const TemplateSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const applyTemplate = useResumeStore((state) => state.applyTemplate);

  const categories: Array<TemplateCategory | 'all'> = ['all', 'modern', 'traditional', 'creative', 'minimal'];

  const filteredTemplates = selectedCategory === 'all'
    ? RESUME_TEMPLATES
    : RESUME_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleTemplateSelect = (templateId: string) => {
    const template = RESUME_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      applyTemplate(template);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm shadow-sm"
      >
        Change Template
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="bg-gray-100 h-64 flex items-center justify-center relative overflow-hidden">
                    {/* Template preview mockup */}
                    <div
                      className="w-full h-full p-8 bg-white scale-75"
                      style={{
                        backgroundColor: template.styling.colors.background,
                        fontFamily: template.styling.fonts.body === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
                      }}
                    >
                      <div
                        className={`${template.layoutConfig.columns === 2 ? 'grid grid-cols-[40%_60%] gap-4' : ''}`}
                      >
                        <div>
                          <div
                            className={`text-xl font-bold mb-1 ${template.styling.headerAlignment === 'center' ? 'text-center' : ''}`}
                            style={{ color: template.styling.colors.primary }}
                          >
                            Your Name
                          </div>
                          <div
                            className={`text-xs mb-2 ${template.styling.headerAlignment === 'center' ? 'text-center' : ''}`}
                            style={{ color: template.styling.colors.secondary }}
                          >
                            email@example.com
                          </div>
                          <div className="mt-4">
                            <div
                              className="text-sm font-bold border-b mb-1"
                              style={{
                                color: template.styling.colors.primary,
                                borderColor: template.styling.colors.primary,
                              }}
                            >
                              {template.layoutConfig.columns === 2 ? 'Skills' : 'Experience'}
                            </div>
                            <div className="h-12 bg-gray-200 rounded mt-1"></div>
                          </div>
                        </div>
                        {template.layoutConfig.columns === 2 && (
                          <div>
                            <div
                              className="text-sm font-bold border-b mb-1"
                              style={{
                                color: template.styling.colors.primary,
                                borderColor: template.styling.colors.primary,
                              }}
                            >
                              Experience
                            </div>
                            <div className="h-20 bg-gray-200 rounded mt-1"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
