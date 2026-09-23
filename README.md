# EchoGPT Redesign

A frontend redesign of the EchoGPT ecosystem, built for the AppifyDevs Frontend Engineering Internship assignment.
One Next.js app contains all three deliverables:

| Route        | Deliverable                                   | What to try                                                                  |
| ------------ | --------------------------------------------- | ---------------------------------------------------------------------------- |
| `/`          | **Landing page** (Task 2)                     | Model explorer, product preview tabs, pricing toggle, FAQ, dark mode         |
| `/chat`      | **Redesigned web app** (Task 1)               | Send a prompt, turn on **Compare**, press `Ctrl/⌘ + K`, pin/rename/delete chats |
| `/extension` | **Chrome extension concept** (Task 3)         | Click a quick action, type `/`, **highlight text in the article**, open Settings |

**Live demo:** https://echogpt-redesign1.vercel.app/
**Repository:** https://github.com/adibaruet/echogpt-redesign

---

## Tech stack

- **Next.js 16** (App Router, static prerendering) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** with a CSS-variable design token system
- **Framer Motion** for animations (automatically reduced when the OS "reduce motion" setting is on)
- **lucide-react** icons, `clsx` + `tailwind-merge` for class composition
- Self-hosted **Plus Jakarta Sans** via Fontsource (no layout shift, no third-party font request)

No UI kit is used: every component (buttons, dialog, listbox model picker, command palette, toast, accordion, markdown renderer) is written from scratch.

## Getting started

```bash
# Node 20.9+ required
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

### Deploy to Vercel

1. Push this repo to GitHub.
2. On vercel.com: **Add New → Project → Import** the repo. Framework is detected as Next.js; no environment variables are needed.
3. Click **Deploy**. Every route is statically prerendered, so it runs on the free tier.

---

## 1. Analysis of the current interface

I reviewed the live web app (chat home and sign-in screens) and the Chrome Web Store listing before designing. Main issues found:

| # | Issue in the current web app | Impact | How the redesign addresses it |
|---|---|---|---|
| 1 | The "Unlock Pro Features" card is fixed over the sidebar and **covers navigation items** (the item under "AI Job Analysis" is cut off). | Users can't reach part of the nav; upsell feels aggressive. | Compact, **dismissible** upgrade card below a scrollable nav, so nothing is ever covered. |
| 2 | Suggestion cards **truncate their text** with "…". | Users can't read what the card will do. | Shorter copy written to fit, plus icons; clicking a card **fills the composer** so users can edit before sending. |
| 3 | Sidebar is all tools (Image Studio, Store, Tasks…) and **no chat history**; history is a separate page. | The most common action, returning to a chat, takes extra clicks. | History is the sidebar's main content: **searchable, grouped by date, pinnable, renamable**. Tools move to a collapsible **Explore** section. |
| 4 | Unlabelled icon buttons (connectors, rocket, bottom icon bar). | Users have to guess; not accessible to screen readers. | Every icon button has a visible tooltip and an `aria-label` (enforced by the `IconButton` API). |
| 5 | Model selector is small and shows no information about models. | Users don't know why they'd pick one model over another. | Picker shows each model's **strengths, provider and Pro status**; model can be switched mid-chat. |
| 6 | Header is a large empty strip with only an avatar. | Wasted space at the top of every screen. | Header holds the model picker, **Compare** toggle, share and theme controls. |
| 7 | Light grey text on white in several places (subtitle, card descriptions). | Low contrast hurts readability. | Token palette tuned for **WCAG AA** contrast in both themes. |
| 8 | Wide letter-spacing in the "E c h o G P T" wordmark. | Reads as separate letters, looks unpolished. | New wordmark and logo mark with normal tracking. |
| 9 | Theme switch is an unlabelled sun icon in a bottom bar. | Hard to discover. | Theme toggle in the header, a labelled segmented control in Settings, and **System** mode. |

## 2. What was built

### Web app (`/chat`)
- **Streaming responses** with a typing indicator, blinking cursor and a **Stop** button (uses `AbortController`).
- **Compare mode**: one prompt goes to two models in parallel; results render side by side, with "Prefer this" to continue with the winner.
- **Command palette** (`Ctrl/⌘ + K`): new chat, switch model, change theme, jump to any chat. Fully keyboard-driven.
- **Chat history**: persisted to `localStorage`, grouped (Pinned / Today / Yesterday / Previous 7 days / Older), searchable (titles and message text), rename inline, pin, delete with **Undo**.
- **Composer**: auto-growing textarea, `Enter` to send / `Shift + Enter` new line, file attachments (chips), **voice input** via the Web Speech API (hidden where unsupported), character counter near the limit.
- **Message actions**: copy, thumbs up/down, regenerate; code blocks with a copy button.
- **Settings dialog**: theme, default model, keyboard shortcuts, clear history (with undo).
- **Deep links**: `/chat?model=claude`, `/chat?compare=1` (used by the landing page CTAs).
- **Responsive**: collapsible sidebar on desktop (`Ctrl/⌘ + B`), slide-in drawer on mobile, compare view stacks on small screens.

### Landing page (`/`)
Hero with an animated product mock, Features, interactive **AI Models explorer** (tabs with speed/reasoning meters), **Product preview** (tabs for web app and extension), **Why EchoGPT** (reasons + comparison table), **Pricing** with monthly/yearly toggle, Testimonials, **FAQ accordion**, CTA band and footer. Product visuals are built in HTML/CSS rather than images, so they are sharp at any size, follow the theme and add almost no weight.

### Chrome extension concept (`/extension`)
An interactive browser mock with the redesigned **side panel**:
- **Tabs**: Chat · History · Settings; new chat and "open in web app" always in the header.
- **Quick actions** on an empty chat (Summarize page, Key takeaways, Explain simply, Translate, Draft a reply).
- **Slash commands**: type `/` for a keyboard-navigable command menu.
- **Selection toolbar**: highlight text in the article to Explain, Translate, Rewrite or Ask. The quote is shown above the question.
- **Page-context chip** ("Using: blog.example.com") that makes it obvious what is shared, and turns off with one click.
- **History** with search, site and model per chat.
- **Settings** grouped into Assistant, Privacy, Appearance, Shortcuts and Account.
- A redesigned **toolbar popup** as a quick launcher, plus a problem → design breakdown.
- `Ctrl/⌘ + Shift + E` toggles the panel, matching the real extension shortcut.

## 3. Architecture

```
src/
├── app/                    # Routes (thin: compose components, set metadata)
│   ├── page.tsx            # Landing
│   ├── chat/page.tsx       # Web app
│   ├── extension/page.tsx  # Extension concept
│   ├── layout.tsx          # Fonts, theme script, skip link, providers
│   └── globals.css         # Design tokens (light + dark), base styles
├── components/
│   ├── ui/                 # Reusable primitives: Button, IconButton, Dialog, Toast, Badge, Kbd,
│   │                       # Logo, ModelAvatar, ThemeToggle, Reveal
│   ├── chat/               # ChatApp (orchestrator), Sidebar, Composer, Message, Markdown,
│   │                       # ModelPicker, CommandPalette, EmptyState
│   ├── extension/          # BrowserDemo, SidePanel, ExtensionPopup
│   ├── landing/            # One file per section + HTML product mocks
│   └── site/               # Shared header and footer
├── hooks/                  # useHotkey, useDismiss, useSpeech
└── lib/
    ├── ai/client.ts        # ← single integration point for the real API
    ├── ai/mock.ts          # Offline, prompt-aware streaming mock
    ├── chat/               # Types, reducer store with persistence, seed data
    ├── models.ts           # Model catalogue
    ├── content.ts          # All marketing copy / data, separate from markup
    └── theme.ts            # Theme persistence + no-flash init script
```

Key decisions:
- **Server components by default.** Only interactive pieces are client components; all pages are statically prerendered.
- **One reducer for chat state** (`lib/chat/store.ts`) with typed actions, debounced persistence and recovery of interrupted streams.
- **Backend-ready.** `streamChat()` in `lib/ai/client.ts` is the only function the UI calls. Swapping the mock for a `fetch` to EchoGPT's streaming endpoint requires no UI changes.
- **Content separated from components** (`lib/content.ts`, `lib/models.ts`) so copy and pricing can change without touching JSX.
- **Design tokens as CSS variables** mapped into Tailwind (`bg-surface`, `text-muted`, `border-line`…), so dark mode is a variable swap, not duplicated classes.

## 4. Accessibility (WCAG 2.2 considerations)

- Skip-to-content link, semantic landmarks and one `h1` per page.
- Every icon-only button has an accessible name; the `IconButton` component requires a `label`.
- Custom widgets follow ARIA patterns: **listbox** model picker (arrow keys, Home/End, Escape), **tabs**, **switches**, **accordion** (`aria-expanded`/`aria-controls`), **combobox** command palette with `aria-activedescendant`.
- Modal dialog traps focus, closes on Escape and restores focus to the trigger.
- Visible `:focus-visible` ring everywhere; streaming replies use `aria-live="polite"`.
- Motion respects `prefers-reduced-motion` (Framer Motion `MotionConfig` + CSS fallback).
- Colour contrast checked for text tokens in both themes.

## 5. Performance

- All routes are **static** (`○` in the build output); no client data fetching on load.
- Fonts are self-hosted and subset; no external font or image requests.
- Product screenshots are HTML/CSS mocks: zero image bytes, crisp on any display.
- Theme is applied by a tiny inline script before first paint (no flash of wrong theme).
- Heavy components are memoised (`ChatMessage`, `Markdown`); localStorage writes are debounced.

## 6. Assumptions

- **No backend access** was provided, so AI responses come from an offline mock that streams realistic, prompt-aware markdown. Authentication is out of scope; the app runs as a "Demo User".
- The **model list** is illustrative and uses model *families* (GPT, Claude, Gemini…) with no version numbers, since the real catalogue comes from EchoGPT's API. Models are shown with monograms, not third-party logos.
- **Pricing figures, testimonials and model scores are placeholders** for the design and are labelled as such where shown. They should be replaced with real data before launch.
- Image Studio, Video Studio, Connectors, Store, AI Tasks and AI Job Analysis are kept in the navigation for continuity but are not reimplemented; clicking them shows a toast.
- The extension is presented as an **interactive concept inside the website** rather than a packaged Manifest V3 build, since the task asks to reimagine the interface. The `SidePanel` component is self-contained and could be mounted in a real side panel page.

## 7. Possible next steps

- Connect `streamChat()` to the real streaming API and add auth.
- Package `SidePanel` as a Manifest V3 extension (Side Panel API + content script for the selection toolbar).
- Add unit tests for the chat reducer and markdown parser, plus Playwright end-to-end tests.
- Syntax highlighting in code blocks (lazy-loaded) and message editing.
