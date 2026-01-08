import { useResumeStore } from '../../store/resumeStore';
import { ResumeDocument } from './ResumeDocument';

export const ResumePreview = () => {
  const { personalInfo, experience, education, skills } = useResumeStore();

  const hasContent =
    personalInfo.name ||
    experience.length > 0 ||
    education.length > 0 ||
    skills.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your Resume Preview
          </h2>
          <p className="text-gray-500">
            Start chatting to build your resume!
            <br />
            Tell me about your experience, education, and skills.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-8">
      <ResumeDocument />
    </div>
  );
};
