import { useState, useRef, FormEvent, KeyboardEvent, ClipboardEvent } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useResumeStore } from '../../store/resumeStore';
import { useHighlightStore } from '../../store/highlightStore';
import { createOpenAIClient } from '../../lib/openai';
import { RESUME_SYSTEM_PROMPT } from '../../lib/prompts';
import { imageToDataURL, validateImage, generateId } from '../../lib/utils';
import { ChatAction } from '../../types/chat';

export const ChatInput = () => {
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addMessage, setLoading, isLoading, messages } = useChatStore();
  const resumeStore = useResumeStore();

  const getCurrentResumeHtml = (maxChars = 20000): string | null => {
    const el = document.getElementById('resume-document');
    if (!el) return null;
    const html = el.innerHTML || '';
    if (html.length <= maxChars) return html;
    return `${html.slice(0, maxChars)}\n<!-- TRUNCATED: ${html.length - maxChars} chars omitted -->`;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setImageFile(file);
    const dataURL = await imageToDataURL(file);
    setImagePreview(dataURL);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;

        const validation = validateImage(file);
        if (!validation.valid) {
          alert(validation.error);
          return;
        }

        setImageFile(file);
        const dataURL = await imageToDataURL(file);
        setImagePreview(dataURL);
        break;
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const applyActions = (actions: ChatAction[]) => {
    const highlightStore = useHighlightStore.getState();

    actions.forEach((action) => {
      switch (action.type) {
        case 'update_personal_info':
          resumeStore.updatePersonalInfo(action.payload);
          highlightStore.addHighlight({ type: 'header' });
          break;

        case 'add_experience':
          // Ensure ID exists
          const expWithId = {
            ...action.payload,
            id: action.payload.id || generateId(),
            achievements: action.payload.achievements || [],
          };
          // Check for duplicates before adding
          const isDuplicateExp = resumeStore.experience.some(
            (exp) =>
              exp.company === expWithId.company &&
              exp.role === expWithId.role &&
              exp.startDate === expWithId.startDate &&
              exp.endDate === expWithId.endDate
          );
          if (!isDuplicateExp) {
            resumeStore.addExperience(expWithId);
            highlightStore.addHighlight({ type: 'experience', id: expWithId.id });
          }
          break;

        case 'add_education':
          const eduWithId = {
            ...action.payload,
            id: action.payload.id || generateId(),
          };
          // Check for duplicates before adding
          const isDuplicateEdu = resumeStore.education.some(
            (edu) =>
              edu.school === eduWithId.school &&
              edu.degree === eduWithId.degree &&
              edu.field === eduWithId.field &&
              edu.startDate === eduWithId.startDate &&
              edu.endDate === eduWithId.endDate
          );
          if (!isDuplicateEdu) {
            resumeStore.addEducation(eduWithId);
            highlightStore.addHighlight({ type: 'education', id: eduWithId.id });
          }
          break;

        case 'update_skills':
          if (Array.isArray(action.payload)) {
            resumeStore.updateSkills(action.payload);
            highlightStore.addHighlight({ type: 'skills' });
          }
          break;

        case 'update_style':
          resumeStore.updateStyling(action.payload);
          highlightStore.addHighlight({ type: 'styling' });
          break;

        case 'set_profile_image':
          resumeStore.setProfileImage(action.payload);
          highlightStore.addHighlight({ type: 'profile-image' });
          break;

        case 'add_custom_section':
          resumeStore.addCustomSection(action.payload);
          highlightStore.addHighlight({
            type: 'custom',
            sectionId: action.payload.id
          });
          break;

        case 'add_custom_section_item':
          if (action.payload.sectionId && action.payload.item) {
            resumeStore.addCustomSectionItem(action.payload.sectionId, action.payload.item);
            highlightStore.addHighlight({
              type: 'custom',
              sectionId: action.payload.sectionId,
              itemId: action.payload.item.id
            });
          }
          break;

        case 'update_section_config':
          if (action.payload.id && action.payload.config) {
            resumeStore.updateSectionConfig(action.payload.id, action.payload.config);
          }
          // No highlight for structural changes
          break;

        case 'update_layout_config':
          resumeStore.updateLayoutConfig(action.payload);
          // No highlight for layout changes (handled by CSS transition)
          break;

        case 'reorder_sections':
          if (Array.isArray(action.payload)) {
            resumeStore.reorderSections(action.payload);
          }
          // No highlight for reorder (handled by FLIP animation)
          break;

        case 'set_custom_html':
          if (typeof action.payload === 'string') {
            resumeStore.setCustomHtmlMode(true);
            resumeStore.setCustomHtml(action.payload);
          }
          break;

        default:
          console.warn('Unknown action type:', action.type);
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput && !imageFile) return;

    // Clear input immediately
    setInput('');

    try {
      setLoading(true);

      const userMessage = trimmedInput || 'I uploaded an image';

      // Add user message with image to chat history
      addMessage({
        role: 'user',
        content: userMessage,
        timestamp: Date.now(),
        imageUrl: imagePreview || undefined
      });

      const client = createOpenAIClient();

      // Convert messages to OpenAI format, including images
      const chatMessages = messages
        .filter((m) => m.role !== 'system')
        .map((m) => {
          if (m.imageUrl) {
            return {
              role: m.role as 'user' | 'assistant',
              content: [
                { type: 'text' as const, text: m.content },
                { type: 'image_url' as const, image_url: { url: m.imageUrl } }
              ]
            };
          }
          return {
            role: m.role as 'user' | 'assistant',
            content: m.content,
          };
        });

      // Add current message
      const currentMessage = imagePreview
        ? {
            role: 'user' as const,
            content: [
              { type: 'text' as const, text: userMessage },
              { type: 'image_url' as const, image_url: { url: imagePreview } }
            ]
          }
        : {
            role: 'user' as const,
            content: userMessage
          };

      const resumeData = {
        personalInfo: resumeStore.personalInfo,
        experience: resumeStore.experience,
        education: resumeStore.education,
        skills: resumeStore.skills,
        customSections: resumeStore.customSections,
      };

      const currentRenderedHtml = getCurrentResumeHtml();

      const developerMessages: Array<{ role: 'developer'; content: string }> = [
        { role: 'developer', content: RESUME_SYSTEM_PROMPT },
        { role: 'developer', content: `Current Structured Resume Data: ${JSON.stringify(resumeData)}` },
      ];

      if (resumeStore.customHtmlMode && resumeStore.customHtml) {
        developerMessages.push({
          role: 'developer',
          content: `Current Custom HTML (in use): ${resumeStore.customHtml}`
        });
      }

      if (currentRenderedHtml) {
        developerMessages.push({
          role: 'developer',
          content: `Current Rendered Resume HTML (from #resume-document innerHTML): ${currentRenderedHtml}`
        });
      }

      // @ts-ignore - GPT-5.2 reasoning_effort parameter not yet in SDK types
      const response = await client.chat.completions.create({
        model: 'gpt-5.2',
        messages: [
          ...developerMessages,
          ...chatMessages,
          currentMessage,
        ],
        response_format: { type: 'json_object' },
        reasoning_effort: 'low',
      });

      // Log token usage and estimated cost
      if (response.usage) {
        const { prompt_tokens, completion_tokens, total_tokens } = response.usage;
        // Estimated pricing for gpt-5.2 (using placeholder high-end prices)
        // $10 per 1M prompt tokens, $30 per 1M completion tokens
        const promptCost = (prompt_tokens / 1_000_000) * 10;
        const completionCost = (completion_tokens / 1_000_000) * 30;
        const totalCost = promptCost + completionCost;

        console.log(
          `%cOpenAI Usage:%c ${total_tokens} tokens (%c${prompt_tokens} prompt%c, %c${completion_tokens} completion%c) | %cEstimated Cost: $${totalCost.toFixed(4)}`,
          'color: #3b82f6; font-weight: bold',
          'color: inherit',
          'color: #6366f1',
          'color: inherit',
          'color: #ec4899',
          'color: inherit',
          'color: #10b981; font-weight: bold'
        );
      }

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const data = JSON.parse(content);

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: data.message || 'I\'ve updated your resume!',
        timestamp: Date.now(),
      });

      // Apply actions to resume store
      if (data.actions && Array.isArray(data.actions)) {
        applyActions(data.actions);
      }

      // Clear image after successful send
      if (imagePreview) {
        clearImage();
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: error.message || 'Sorry, there was an error processing your request. Please try again.',
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img src={imagePreview} alt="Upload preview" className="h-20 rounded border" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload image"
        >
          📎
        </button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={isLoading ? "Processing..." : "Tell me about your experience, or ask me to change the style..."}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          rows={1}
          style={{ minHeight: '42px', maxHeight: '200px', overflowY: 'auto' }}
        />

        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !imageFile)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </form>
  );
};
