# AI Resume Formatter

An open-source, lightweight resume builder powered by AI. Build beautiful resumes through natural conversation.

## TLDR - What You Need to Know

### What It Does
Talk to an AI assistant to build your resume. Just describe your work experience, education, and skills in plain English, and watch your resume update in real-time. No forms to fill out, no complex menus to navigate.

### Why It's Great
- **Easy to use**: No resume expertise needed - just have a conversation
- **Instant results**: See your resume update as you chat
- **Private**: Everything stays in your browser - no account required, no data collected
- **Free to use**: Just bring your own OpenAI API key (costs pennies per resume)
- **Smart**: The AI understands context, remembers what you said, and can analyze images

### Two Modes: Best of Both Worlds
**Structured Mode (Default):** The AI uses ~40 predefined actions like "add experience", "change color", "reorder sections". Perfect for building and maintaining your resume with precise, reliable edits.

**Freeflow Mode (Custom HTML):** Want complete creative freedom? Ask for timeline layouts, infographic styles, or any custom design you can imagine. The AI generates custom HTML and automatically switches modes - giving you unlimited creative control.

**The Trade-off:** You can't click and edit directly. Everything happens through conversation. If you want to change "Software Engineer" to "Senior Software Engineer", you tell the AI - you can't just click and type. This works great for building from scratch, but may feel different if you're used to traditional editors.

### Bottom Line
Perfect for: First-time resume builders, people who hate formatting, anyone starting fresh, creative professionals wanting unique designs.

Not ideal for: People who prefer traditional click-to-edit interfaces or need to make lots of small manual tweaks.

---

## Features

- 🤖 **AI-Powered**: Use natural language to build and customize your resume
- 🎨 **Dynamic Styling**: Change colors, fonts, and layouts with simple commands
- 📄 **PDF Export**: Download your resume as a high-quality PDF
- 🖼️ **Image Support**: Upload profile pictures and extract styling from sample resumes
- 🔒 **Privacy First**: Everything runs in your browser, no data stored on servers
- 🚀 **No Backend**: Client-only application, deploy anywhere

## Quick Start

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd resume-formater
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Get your OpenAI API key:
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Enter it in the app when prompted

## Usage

1. Enter your OpenAI API key when first loading the app
2. Start chatting! Tell the AI about your work experience, education, and skills
3. Customize the style with commands like:
   - "Make the header blue"
   - "Change to a modern layout"
   - "Use serif fonts for headings"
4. Get creative with custom layouts:
   - "Create a timeline-style resume"
   - "Make an infographic resume"
   - "Design a creative layout with sidebar"
5. Upload a profile picture when asked
6. Export your resume as a PDF when done

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI**: OpenAI API (GPT-4)
- **PDF Export**: html2pdf.js

## Deployment

Build for production:
```bash
npm run build
```

Deploy the `dist` folder to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
