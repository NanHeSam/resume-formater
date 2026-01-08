import { useState } from 'react';
import { useApiKeyStore } from '../store/apiKeyStore';

interface ApiKeyInputProps {
  onComplete: () => void;
}

export const ApiKeyInput = ({ onComplete }: ApiKeyInputProps) => {
  const [input, setInput] = useState('');
  const { setApiKey } = useApiKeyStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKey = input.trim();
    if (!trimmedKey) {
      alert('Please enter a valid API key');
      return;
    }

    if (!trimmedKey.startsWith('sk-')) {
      alert('Invalid API key format. OpenAI API keys start with "sk-"');
      return;
    }

    setApiKey(trimmedKey);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to AI Resume Builder
          </h2>
          <p className="text-gray-600">
            To get started, please enter your OpenAI API key
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Don't have an API key?</strong>
              <br />
              Get one from{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              🔒 Your API key is stored locally in your browser and never sent to any server except OpenAI.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};
