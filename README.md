<div align="center">

# ☕ MochA

### AI-Powered Mock Interview Simulator

*Bridge the gap between coding in isolation and performing under real interview pressure.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3-F55036?style=flat-square)](https://groq.com/)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-TTS-000000?style=flat-square)](https://elevenlabs.io/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)](https://www.sqlite.org/)

</div>

---

## What is MochA?

Most CS students can solve an algorithm on a whiteboard — but they freeze during the "think aloud" phase of a real interview or struggle to explain their systems-level choices under scrutiny. MochA is a **dual-context interview flight simulator** that bridges this gap.

It simultaneously monitors your live code editor and conducts a voice-powered interview, creating the closest thing to a real FAANG interview without ever leaving your browser.

---

## Features

###  Technical Interview Mode
- A real LeetCode question is selected based on your chosen difficulty (Easy / Medium / Hard)
- The AI interviewer watches your **live code evolve** in the Monaco editor — not just the final submission
- Strict 20-minute countdown timer with start/stop confirmation
- AI evaluates and grades you across **6 scoring categories** when time expires

###  Behavioural Interview Mode
- A Senior Engineering Manager persona conducts a structured 35-minute session
- Covers values & culture, strengths & weaknesses, and STAR-method deep-dives
- Warm but professional — will probe vague answers with targeted follow-ups

###  Voice-Powered Interaction
- **ElevenLabs TTS** — the interviewer speaks responses aloud with a natural voice
- **Groq Whisper** — speak your answers directly into the mic, transcribed in real time
- Text input always available as a fallback

###  Performance Analytics
- Every completed session is scored and saved to your profile
- **Skill Tree radar chart** visualises your average across all 6 dimensions
- Pass/fail history and overall pass rate tracked over time

###  Authentication
- Email/password sign-up with bcrypt hashing
- Google OAuth via NextAuth
- Custom JWT session cookie with 7-day expiry

---

## Scoring Rubric

MochA grades technical interviews across six categories, each scored 0–10. **All six must be ≥ 5 to pass.**

| Category | What's Evaluated |
|---|---|
| **Confirming the Question** | Did you restate the problem, create your own example, and probe for edge cases and input size? |
| **Algorithm Design** | Did you arrive at the optimal solution? How quickly? Did you explain your reasoning clearly? |
| **Complexity Analysis** | Can you derive and explain the Big-O complexity step by step — not just state it? |
| **Coding** | Did you write comments first, explain each line as you wrote it, and finish before time ran out? |
| **Testing** | Did you trace through your code on paper with a concrete example, writing variable states line by line? |
| **Behavioural** | Did you communicate professionally, ask sensible questions, and engage with the interviewer naturally? |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui |
| LLM Inference | Groq Cloud — LLaMA 3.1 8B Instant |
| Speech-to-Text | Groq Whisper Large v3 Turbo |
| Text-to-Speech | ElevenLabs Turbo v2.5 |
| Code Editor | Monaco Editor (custom creme/espresso themes) |
| Database | SQLite via `sqlite` + `sqlite3` |
| Auth | NextAuth v4 (Google OAuth) + custom JWT sessions |
| Validation | Zod |
| Animation | Framer Motion |

---

## Getting Started

### Prerequisites

- Node.js 18+
- `pnpm` (recommended) or `npm`
- A Groq API key — [console.groq.com](https://console.groq.com)
- An ElevenLabs API key — [elevenlabs.io](https://elevenlabs.io)
- Google OAuth credentials (optional, for Google sign-in)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/mocha.git
cd mocha
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```dotenv
# Groq — LLM inference + Whisper transcription
GROQ_API_KEY=your_groq_api_key

# ElevenLabs — Text-to-Speech
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000

# Session encryption key — generate with: openssl rand -base64 32
SESSION_SECRET=your_session_secret
```

### 3. Database Setup

Run the migration script once to create the user and session tables:

```bash
node src/lib/database/migrate.mjs
```

This is safe to re-run — all statements use `CREATE TABLE IF NOT EXISTS`.

### 4. Start the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── actions/              # Server actions (auth, TTS, transcription, scoring)
│   ├── elevenlabs.ts     # ElevenLabs TTS generation
│   ├── interview.ts      # Start/complete interview session actions
│   ├── login.ts          # Email login action
│   ├── parseScores.ts    # AI score extraction from grading summary
│   ├── register.ts       # Account registration action
│   └── transcribe.ts     # Groq Whisper transcription
│
├── app/
│   ├── api/
│   │   ├── auth/         # NextAuth Google OAuth handler
│   │   ├── chat/         # LLM streaming endpoint (Groq)
│   │   └── interview/    # Session start/complete REST endpoints
│   ├── auth/             # Login & signup pages
│   ├── interview/
│   │   ├── behaviour/    # Behavioural interview page
│   │   └── code/         # Technical interview page (editor + chat)
│   └── profile/[id]/     # User statistics and skill tree page
│
├── components/
│   ├── chatbot/          # Chat UI (messages, input, sidebar)
│   ├── contexts/         # React Context providers
│   │   ├── app/          # Root app provider
│   │   ├── code/         # Code editor state
│   │   ├── interview/    # Session lifecycle management
│   │   ├── llm/          # LLM chat state + streaming
│   │   ├── session/      # Auth session state
│   │   ├── tts/          # Text-to-speech playback
│   │   └── vtt/          # Voice-to-text recording
│   ├── editor/           # Monaco code editor with custom themes
│   ├── profile/          # Skill tree radar chart (SVG + Framer Motion)
│   ├── timer/            # Interview countdown timer
│   └── ui/               # shadcn/ui components
│
├── lib/
│   ├── data/             # AI prompts, LeetCode questions, behavioural questions
│   ├── database/         # SQLite DAO layer (init, migrate, query, userquery)
│   ├── session/          # JWT cookie encryption/decryption
│   ├── types/            # Zod schemas and TypeScript types
│   └── utils/            # FileUtils, UuidUtils, confetti
│
└── types/
    └── next-auth.d.ts    # NextAuth session type augmentation
```

---

## How It Works

### Interview Lifecycle

```
User clicks Start
  └── startInterviewAction()        → inserts interview_sessions row → returns sessionId
  └── send("start the interview")   → AI greets and presents the LeetCode question

      ... interview in progress ...
      AI watches live code via LIVE EDITOR STATE in system prompt
      User speaks (Whisper) or types answers
      AI responds with streamed text + ElevenLabs TTS audio

User clicks Stop (or timer expires)
  └── markInterviewEnding()         → flags next AI response as the grading summary
  └── send("please grade me")       → AI streams full scorecard
  └── LLMProvider.onFinish fires
        └── onInterviewComplete(text)
              └── parseInterviewScores(text)    → Groq extracts 6 scores as JSON
              └── completeInterviewAction()     → updates interview_sessions + inserts topic_attempts

User visits /profile/[id]
  └── getUserProgress()             → reads both tables → renders skill tree + stats
```

### Context Architecture

MochA uses a layered React Context tree to keep concerns separated and allow components to communicate without prop drilling:

```
AppProvider
 └── SessionProvider       (auth session)
      └── CodeProvider      (editor state shared with LLM)
           └── InterviewProvider   (session ID lifecycle)
                └── TextToSpeechProvider  (ElevenLabs audio)
                     └── LLMBridge        (wires TTS + scoring into LLM)
                          └── VoiceToTextBridge  (wires mic transcription into LLM)
```

### Live Code Synchronisation

Every message sent to the LLM includes the current editor contents injected into the system prompt as an `=== LIVE EDITOR STATE ===` block. This means the AI doesn't just evaluate your final answer — it watches your logic evolve in real time, exactly as a human interviewer would glance at your screen.

---

## Roadmap

- **Ranked Tier System** — climb from Junior → Senior → Staff based on consistency
- **Domain Specialisations** — systems design, ML infrastructure, fintech tracks  
- **Dynamic Interruptions** — AI interrupts mid-explanation to test composure  
- **Sentiment Analysis** — feedback on tone, pace, and confidence during behavioural segments  
- **Streak System** — daily practice tracking with milestones  
- **Live System Failure Simulations** — random environment constraints added mid-interview  

---

## Contributing

Pull requests are welcome. For major changes please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

MIT © MochA Team

---

<div align="center">
  <sub>Built at UniHack 2026 ☕</sub>
</div>
