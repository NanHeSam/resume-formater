import OpenAI from 'openai';
import { useApiKeyStore } from '../store/apiKeyStore';

export const createOpenAIClient = () => {
  const apiKey = useApiKeyStore.getState().apiKey;

  if (!apiKey) {
    throw new Error('No API key configured. Please enter your OpenAI API key.');
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for browser usage
  });
};
