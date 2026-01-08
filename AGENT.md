# AI Resume Formatter - Agent Documentation

## Overview

This is an AI-powered resume builder that enables users to create professional resumes through natural language conversation. The system leverages OpenAI's GPT API to interpret user input and dynamically update a live resume preview in real-time.

**Architecture**: Client-side React application with AI-driven state management and real-time visual feedback.

---

## System Architecture

### Core Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand (4 stores: resume, chat, apiKey, highlight)
- **Styling**: Tailwind CSS with dynamic CSS variables
- **AI Integration**: OpenAI GPT-5.2 API with JSON structured output
- **Animations**: Framer Motion for smooth transitions
- **PDF Export**: html2pdf.js for A4-formatted downloads

### Data Flow Architecture

```
User Input → ChatInput Component
    ↓
OpenAI API (structured JSON prompt)
    ↓
Action Parser → applyActions()
    ↓
Zustand Stores (resumeStore + highlightStore)
    ↓
React Re-render → ResumeDocument
    ↓
Visual Feedback (highlight animations)
```

---

## Internal Workings

### 1. State Management System

The application uses Zustand for reactive state management with 4 independent stores:

#### **resumeStore** ([src/store/resumeStore.ts](src/store/resumeStore.ts))
The central data store containing:
- Personal information (name, email, phone, location, summary)
- Experience entries (company, role, dates, achievements)
- Education entries (school, degree, dates, GPA)
- Skills array
- Custom sections (extensible for projects, certifications, etc.)
- Styling configuration (colors, fonts, layout, spacing)
- Section visibility and ordering
- Layout configuration (1 or 2 column layouts)
- Profile image (base64 encoded)
- Optional custom HTML mode

**40+ actions** including:
- Data mutations: `addExperience`, `updateExperience`, `removeExperience`
- Styling: `updateStyle`, `applyTemplate`
- Structure: `updateSectionConfig`, `updateLayoutConfig`, `reorderSections`
- Custom sections: `addCustomSection`, `updateCustomSection`

#### **chatStore** ([src/store/chatStore.ts](src/store/chatStore.ts))
Manages conversation state:
- Message history (user and assistant messages)
- Loading state during API calls
- Message timestamps and optional images

#### **apiKeyStore** ([src/store/apiKeyStore.ts](src/store/apiKeyStore.ts))
Persists OpenAI API key to localStorage with validation:
- Checks for "sk-" prefix
- Encrypted storage (browser localStorage)
- Auto-loads on app start

#### **highlightStore** ([src/store/highlightStore.ts](src/store/highlightStore.ts))
Tracks recently modified elements for visual feedback:
- Records which sections/items were just updated
- Auto-clears highlights after 800ms
- Enables smooth visual transitions

### 2. AI-Driven Action System

The system uses **prompt engineering** to convert natural language into structured actions.

#### System Prompt ([src/lib/prompts.ts](src/lib/prompts.ts))

The 100+ line prompt instructs GPT to:
1. Extract resume data from conversational input
2. Interpret styling commands ("make it blue", "use serif fonts")
3. Structure responses as JSON with message + actions
4. Handle section management (reorder, show/hide, create custom)
5. Optimize for one-page layouts when requested
6. Support advanced custom HTML mode

#### Action Types (25 total)

Defined in [src/types/chat.ts](src/types/chat.ts):

**Data Operations**:
- `update_personal_info`: Update name, email, phone, location, summary
- `add_experience`: Add job entry
- `update_experience`: Modify existing job
- `remove_experience`: Delete job
- `add_education`: Add education entry
- `update_education`: Modify education
- `remove_education`: Delete education
- `update_skills`: Set skills array
- `add_skill`: Add single skill
- `remove_skill`: Remove single skill

**Styling Operations**:
- `update_style`: Change colors, fonts, spacing, alignment

**Media Operations**:
- `set_profile_image`: Set profile picture

**Custom Section Operations**:
- `add_custom_section`: Create new section (Projects, Certifications, etc.)
- `update_custom_section`: Modify section properties
- `remove_custom_section`: Delete section
- `add_custom_section_item`: Add item to section
- `update_custom_section_item`: Modify item
- `remove_custom_section_item`: Delete item

**Structure Operations**:
- `update_section_config`: Control visibility, order, type
- `update_layout_config`: Set 1 or 2 column layout
- `reorder_sections`: Change section order
- `set_custom_html`: Enable advanced HTML mode

#### Example API Response

```json
{
  "message": "I've added your experience at Google and updated the header color to blue.",
  "actions": [
    {
      "type": "add_experience",
      "payload": {
        "id": "exp-abc123",
        "company": "Google",
        "role": "Software Engineer",
        "location": "Mountain View, CA",
        "startDate": "2020",
        "endDate": "2023",
        "current": false,
        "achievements": [
          "Led development of search feature",
          "Improved performance by 40%"
        ]
      }
    },
    {
      "type": "update_style",
      "payload": {
        "colors": {
          "primary": "#1a73e8"
        }
      }
    }
  ]
}
```

### 3. Component Architecture

#### Split-Screen Layout ([src/components/SplitScreen.tsx](src/components/SplitScreen.tsx))

```
┌─────────────────┬─────────────────┐
│  ChatInterface  │  ResumePreview  │
│                 │                 │
│  - ChatMessage  │  - ResumeDoc    │
│  - ChatInput    │  - Export Btn   │
│                 │  - Templates    │
└─────────────────┴─────────────────┘
```

Responsive: Stacks vertically on mobile (50/50 height split)

#### ChatInput Component ([src/components/chat/ChatInput.tsx](src/components/chat/ChatInput.tsx))

**Responsibilities**:
1. Capture user text input (textarea with auto-resize)
2. Handle image uploads (drag-drop, file select, paste from clipboard)
3. Validate images (max 5MB, JPEG/PNG/WebP only)
4. Send requests to OpenAI API with full message history
5. Parse JSON responses and extract actions
6. Apply actions via `applyActions()` function
7. Trigger highlight animations for visual feedback
8. Prevent duplicate entries (experience/education)

**Key Features**:
- Image preview before sending
- Loading state with disabled input
- Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- Error handling with user-friendly alerts

#### ResumeDocument Component ([src/components/resume/ResumeDocument.tsx](src/components/resume/ResumeDocument.tsx))

**The rendering engine** that:
1. Subscribes to resumeStore for all resume data
2. Applies dynamic styling via CSS variables
3. Renders sections based on visibility and order configuration
4. Handles 1-column and 2-column layouts
5. Uses Framer Motion for smooth enter/exit animations
6. Supports custom HTML mode for advanced layouts
7. Shows A4 page indicators (297mm height markers)

**Styling System**:
```typescript
// Dynamic CSS variables injected
--primary-color: #2563eb
--secondary-color: #64748b
--text-color: #1e293b
--background-color: #ffffff
--heading-font: 'Inter', sans-serif
--body-font: 'Inter', sans-serif
```

### 4. Visual Feedback System

#### Highlight Hook ([src/hooks/useHighlight.ts](src/hooks/useHighlight.ts))

Provides visual feedback when elements are updated:

1. **Add Highlight**: When action is applied, store element ID in highlightStore
2. **CSS Animation**: Component gets `highlight-flash` class
3. **Auto-Clear**: After 800ms, highlight is removed
4. **Smooth Transition**: CSS keyframe animation for flash effect

Example usage:
```typescript
const isHighlighted = useHighlight('experience', experienceId);
<div className={isHighlighted ? 'highlight-flash' : ''}>
  {/* content */}
</div>
```

#### FLIP Animations

Framer Motion handles layout animations for:
- Section reordering (smooth position changes)
- Adding/removing sections (fade + scale)
- Layout switching (1 to 2 columns)

### 5. Template System

Six pre-built templates ([src/lib/templates.ts](src/lib/templates.ts)):

1. **Classic**: Traditional layout, serif fonts, blue accent
2. **Modern Professional**: Sans-serif, purple accent, 2-column
3. **Minimal**: Clean, gray accent, maximum whitespace
4. **Creative**: Vibrant colors, modern fonts, bold headers
5. **Tech Sidebar**: 2-column with skills sidebar, green accent
6. **Executive**: Serif fonts, gold accent, professional spacing

Each template includes:
- Complete style configuration
- Section ordering
- Layout configuration
- Color scheme
- Font pairing

### 6. PDF Export System

**Export Button** ([src/components/ExportButton.tsx](src/components/ExportButton.tsx)):
- Uses html2pdf.js library
- Captures `#resume-document` element
- Exports to A4 format (210mm × 297mm)
- Filename: `{firstName}_{lastName}_Resume.pdf`
- High-quality settings optimized for printing

---

## Advantages

### 1. **Natural Language Interface**
Users don't need to understand resume structure or formatting. They simply describe their experience, and the AI extracts and formats it correctly.

### 2. **Real-Time Visual Feedback**
- Split-screen design shows immediate changes
- Highlight animations show what changed
- No "preview" button needed - always live

### 3. **Privacy-First Architecture**
- Zero backend - all data stays in the browser
- No database, no data collection
- API key stored locally
- User has complete control over their data

### 4. **Intelligent Duplicate Prevention**
The system detects and prevents duplicate entries:
```typescript
// Checks company + role + dates before adding
const isDuplicate = experiences.some(exp =>
  exp.company === company &&
  exp.role === role &&
  exp.startDate === startDate
);
```

### 5. **Flexible Extensibility**
- Custom sections support unlimited use cases (Projects, Publications, Awards, Certifications)
- Custom HTML mode for power users
- Template system easily extensible
- Action system can grow with new action types

### 6. **Professional Output Quality**
- A4-optimized for printing (210mm × 297mm)
- Professional typography and spacing
- Print-friendly styling
- High-quality PDF export

### 7. **Responsive & Mobile-Friendly**
- Works on tablets and phones
- Split-screen adapts to vertical layout
- Touch-friendly controls
- Image upload via camera on mobile

### 8. **Smart Context Understanding**
AI maintains conversation context:
- "Add another role at the same company" - knows which company
- "Make the header blue" - understands it's about styling
- "Move skills to the top" - understands section reordering

### 9. **One-Page Optimization**
Special prompt instructions help compress resumes:
- Automatic spacing reduction
- Smart section prioritization
- Layout optimization suggestions

### 10. **Vision AI Integration**
Can analyze images for context:
- Upload business cards
- Screenshot of LinkedIn profile
- Existing resume images

---

## Constraints & Limitations

### 1. **OpenAI API Dependency**
**Critical**: The entire application depends on OpenAI API availability.

**Risks**:
- API downtime breaks the app
- Rate limits affect user experience
- Cost scales with usage
- API changes require prompt updates

**Mitigation Strategies**:
- Could add fallback AI providers (Anthropic, Google)
- Could implement local caching of responses
- Could add manual editing mode as fallback

### 2. **No Data Persistence**
**Issue**: Data only exists in browser memory and localStorage.

**Problems**:
- Clearing browser data loses everything
- No cross-device sync
- No version history
- No backup system

**Workarounds**:
- Users must export PDF frequently
- Could add JSON export/import feature
- Could integrate cloud storage (Google Drive, Dropbox)

### 3. **Client-Side Only = No Collaboration**
**Limitation**: Single-user, single-device only.

**Cannot Support**:
- Multiple people editing same resume
- Sharing draft links
- Comments or suggestions from others
- Resume versioning

**Future Options**:
- Add Firebase or Supabase backend
- Implement WebRTC for P2P collaboration
- Cloud sync via OAuth + storage API

### 4. **API Key Security**
**Security Concern**: User's OpenAI API key stored in localStorage.

**Risks**:
- localStorage is not encrypted
- XSS vulnerabilities could expose keys
- Browser extensions can read localStorage

**Best Practices**:
- Should use environment variables + proxy server
- Should implement key rotation
- Should add rate limiting

### 5. **Token Limits & Costs**
**Issue**: Long conversations consume many tokens.

**Problems**:
- Large resumes with extensive history = high cost
- Context window limits (128k tokens)
- Response time increases with context size

**Solutions**:
- Implement conversation summarization
- Allow users to reset conversation
- Add token usage tracking/display
- Implement smart context pruning

### 6. **AI Hallucination Risk**
**Problem**: GPT might invent information or misinterpret input.

**Examples**:
- User says "Google" → AI adds "Mountain View, CA" (assumption)
- Dates might be reformatted incorrectly
- Skills might be inferred rather than stated

**Safeguards**:
- Always show what changed (visual feedback)
- Allow manual editing of all fields (not yet implemented)
- Clear undo/redo system (not yet implemented)

### 7. **Limited Manual Editing**
**Current Gap**: No direct editing interface for resume data.

**Missing Features**:
- Cannot click into resume to edit text directly
- Must use natural language to make changes
- No drag-drop for reordering
- No rich text editing for descriptions

**Future Enhancement**:
- Add inline editing mode
- Context menu for quick edits
- Drag handles for reordering

### 8. **PDF Export Quality Depends on Browser**
**Limitation**: html2pdf.js uses browser print engine.

**Issues**:
- Different rendering across browsers
- Page breaks might split content awkwardly
- Complex layouts might not export perfectly
- Custom HTML mode might break in PDF

**Alternatives**:
- Server-side PDF generation (Puppeteer, LaTeX)
- Professional PDF libraries (PDFKit)

### 9. **No Offline Mode**
**Requirement**: Internet connection required for AI features.

**Limitations**:
- Cannot use without network
- High data usage for images
- Latency affects UX

**Potential Solutions**:
- Service workers for offline shell
- IndexedDB for data persistence
- Queue actions when offline, sync later

### 10. **Scalability Constraints**

**Browser Memory Limits**:
- Large images stored as base64 increase memory usage
- Long conversation history grows unbounded
- Many custom sections could impact performance

**Performance Bottlenecks**:
- Re-rendering entire resume on every change
- No virtualization for long lists
- Animations might stutter with complex layouts

**Optimization Strategies**:
- Implement React.memo for components
- Add virtualization for long experience lists
- Compress images before storage
- Paginate conversation history

### 11. **Template Constraints**
**Current**: Only 6 templates, limited customization.

**Limitations**:
- Cannot mix template features
- Styling locked to predefined options
- No template preview before applying

**Enhancements Needed**:
- Template marketplace or community templates
- Granular style controls (per-section styling)
- Template inheritance/composition

### 12. **Accessibility Gaps**
**Potential Issues**:
- Screen reader support not fully tested
- Keyboard navigation might be incomplete
- Color contrast not validated
- ARIA labels might be missing

**Required Work**:
- Accessibility audit
- Keyboard shortcut documentation
- ARIA implementation
- Focus management improvements

### 13. **Error Recovery**
**Current State**: Limited error handling.

**Problems**:
- API errors show generic alerts
- No retry mechanism
- No rollback on failed actions
- No validation for corrupted state

**Should Add**:
- Undo/redo system
- Action history with rollback
- State validation and repair
- Detailed error messages with recovery options

---

## Working with This Codebase

### For AI Agents

When making changes to this codebase:

1. **Always read before editing**: Use Read tool on files before modification
2. **Understand action flow**: Changes should flow through action system, not direct store mutations
3. **Test visual feedback**: Ensure highlightStore is updated when adding new actions
4. **Maintain prompt quality**: Changes to action types require prompt updates in [src/lib/prompts.ts](src/lib/prompts.ts)
5. **Preserve TypeScript types**: All new actions must be typed in [src/types/chat.ts](src/types/chat.ts)
6. **Consider mobile**: Test responsive behavior (lg: breakpoints)
7. **Watch bundle size**: Vite is fast, but large dependencies affect load time

### Key Files to Understand

**Core Logic**:
- [src/components/chat/ChatInput.tsx](src/components/chat/ChatInput.tsx) - AI integration & action processing
- [src/store/resumeStore.ts](src/store/resumeStore.ts) - Central state management
- [src/lib/prompts.ts](src/lib/prompts.ts) - AI prompt engineering

**Rendering**:
- [src/components/resume/ResumeDocument.tsx](src/components/resume/ResumeDocument.tsx) - Main rendering engine
- [src/components/SplitScreen.tsx](src/components/SplitScreen.tsx) - Layout structure

**Configuration**:
- [src/lib/templates.ts](src/lib/templates.ts) - Template definitions
- [src/types/](src/types/) - All TypeScript interfaces

### Testing Considerations

**Currently No Tests** - this is a major constraint.

**Should Add**:
- Unit tests for store actions
- Integration tests for action application
- E2E tests for user flows
- Snapshot tests for resume rendering
- API mocking for ChatInput tests

### Performance Optimization Opportunities

1. **Lazy load templates**: Don't load all 6 templates upfront
2. **Debounce API calls**: Wait for user to stop typing
3. **Compress images**: Reduce base64 size before storing
4. **Memo components**: Prevent unnecessary re-renders
5. **Code splitting**: Separate PDF export bundle
6. **Conversation pruning**: Limit message history sent to API

---

## Future Enhancement Possibilities

### High Priority
1. **Manual editing mode**: Click-to-edit resume fields
2. **Undo/redo system**: Action history with rollback
3. **JSON export/import**: Backup and restore resume data
4. **Token usage tracking**: Show cost to user
5. **Error recovery**: Better error messages and retry logic

### Medium Priority
6. **More templates**: Expand to 20+ professional templates
7. **Cloud sync**: Optional backend for multi-device access
8. **Collaboration**: Share and get feedback on resumes
9. **Version history**: Track changes over time
10. **A/B testing**: Compare different resume versions

### Low Priority / Nice-to-Have
11. **ATS optimization**: Check resume against job descriptions
12. **LinkedIn import**: Auto-populate from LinkedIn profile
13. **Cover letter generation**: AI-powered cover letters
14. **Multi-language support**: i18n for global users
15. **Resume analytics**: Track which sections are most effective

---

## Conclusion

This is a well-architected, modern resume builder that leverages AI to provide an exceptional user experience. The split-screen real-time feedback, natural language interface, and privacy-first approach are significant advantages.

The main constraints are around data persistence, API dependency, and limited manual editing. Adding a backend for persistence and implementing direct editing would address the most critical limitations.

The codebase is clean, well-organized, and uses modern React patterns. The action-based architecture makes it highly extensible, and the prompt engineering approach is sophisticated and effective.

**For developers/agents working on this**: Focus on understanding the action flow system, as it's the backbone of the entire application. Changes should integrate with the existing action types and maintain the reactive data flow from AI → actions → stores → UI.
