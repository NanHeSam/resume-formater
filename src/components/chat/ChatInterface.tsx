import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export const ChatInterface = () => {
  const { messages, isLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">AI Resume Builder</h1>
        <p className="text-sm text-gray-600">Tell me about yourself and I'll build your resume!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="text-center mt-8">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Welcome to AI Resume Builder!
            </h2>
            <p className="text-gray-600 mb-6">
              I'll help you create a professional resume through conversation.
            </p>

            <div className="max-w-md mx-auto text-left space-y-3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-2">Try saying:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• "My name is John Doe, email john@example.com"</li>
                  <li>• "I worked at Google as a Software Engineer from 2020-2023"</li>
                  <li>• "I have a CS degree from MIT"</li>
                  <li>• "My skills are React, Python, and TypeScript"</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-2">Customize styling:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• "Make the header blue"</li>
                  <li>• "Change to a modern layout"</li>
                  <li>• "Use serif fonts"</li>
                  <li>• "Make it more compact"</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200">
                <h3 className="font-semibold text-purple-700 mb-2">Get creative:</h3>
                <ul className="space-y-1 text-sm text-purple-600">
                  <li>• "Create a timeline-style resume"</li>
                  <li>• "Make an infographic resume"</li>
                  <li>• "Design a creative layout with sidebar"</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
};
