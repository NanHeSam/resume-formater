import { useState, useEffect } from 'react';
import { useApiKeyStore } from './store/apiKeyStore';
import { ApiKeyInput } from './components/ApiKeyInput';
import { SplitScreen } from './components/SplitScreen';

function App() {
  const { apiKey } = useApiKeyStore();
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setShowApiKeyInput(true);
    }
  }, [apiKey]);

  const handleApiKeyComplete = () => {
    setShowApiKeyInput(false);
  };

  return (
    <div className="app">
      {showApiKeyInput && <ApiKeyInput onComplete={handleApiKeyComplete} />}
      <SplitScreen />
    </div>
  );
}

export default App;
