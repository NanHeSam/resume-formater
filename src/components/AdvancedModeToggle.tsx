import { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';

export const AdvancedModeToggle = () => {
  const { customHtmlMode, setCustomHtmlMode } = useResumeStore();
  const [showWarning, setShowWarning] = useState(false);

  const handleToggle = () => {
    if (!customHtmlMode) {
      setShowWarning(true);
    } else {
      setCustomHtmlMode(false);
      setCustomHtmlMode(false);
    }
  };

  const confirmEnable = () => {
    setCustomHtmlMode(true);
    setShowWarning(false);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          customHtmlMode
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
        }`}
        title={customHtmlMode ? 'Custom HTML Mode Active' : 'Enable Custom HTML Mode'}
      >
        {customHtmlMode ? '⚠️ HTML Mode' : '🔧 Advanced'}
      </button>

      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">⚠️</div>
              <div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Enable Custom HTML Mode?
                </h2>
                <p className="text-gray-700 mb-4">
                  This is an <strong>experimental</strong> and <strong>potentially dangerous</strong> feature.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-4">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Security Risks:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                <li>AI will generate raw HTML that's inserted into the page</li>
                <li>Malicious or broken HTML could crash your browser</li>
                <li>XSS vulnerabilities if used with untrusted data</li>
                <li>Your resume data will NOT be editable in this mode</li>
                <li>Export to PDF may not work correctly</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
              <h3 className="font-bold text-blue-900 mb-2">✨ What You Can Do:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                <li>Ask AI to create completely custom layouts</li>
                <li>Request specific HTML structures</li>
                <li>Design unconventional resume formats</li>
                <li>Have full creative control over the design</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
              <h3 className="font-bold text-yellow-900 mb-2">💡 Example Commands:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                <li>"Create a resume with a timeline design"</li>
                <li>"Make a creative infographic-style resume"</li>
                <li>"Design a resume with a sidebar and main content area"</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowWarning(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnable}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                I Understand the Risks - Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
