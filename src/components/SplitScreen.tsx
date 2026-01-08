import { ChatInterface } from './chat/ChatInterface';
import { ResumePreview } from './resume/ResumePreview';
import { ExportButton } from './ExportButton';
import { TemplateSelector } from './TemplateSelector';
import { AdvancedModeToggle } from './AdvancedModeToggle';

export const SplitScreen = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Chat Side */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r">
        <ChatInterface />
      </div>

      {/* Resume Preview Side */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col">
        <div className="bg-white border-b px-6 py-4 shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
          <div className="flex gap-3">
            <AdvancedModeToggle />
            <TemplateSelector />
            <ExportButton />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
};
