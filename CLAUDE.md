# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
# Development
npm run dev          # Start Next.js dev server on localhost:3000
make dev            # Alternative using Makefile

# Building
npm run build       # Build production bundle
make build          # Alternative using Makefile

# Testing
npm test            # Run test suite
make test           # Alternative using Makefile

# Linting & Formatting
npm run lint        # Run ESLint
npm run format      # Format code with Prettier

# Setup
make setup          # Initial project setup (clone, install deps, scaffold .env)

# Deployment
make deploy         # Deploy to Vercel

# Pinecone/RAG
make upsert         # Upsert documents to Pinecone for RAG

# Customization
make customize      # Interactive config for UI/identity/prompts
```

### Package Manager

This project uses **pnpm** (version 9.12.0) as specified in package.json. If you need to install dependencies:

```bash
pnpm install
```

## Architecture Overview

This is a **Next.js 14 App Router** application implementing a multi-provider AI chatbot with RAG (Retrieval-Augmented Generation) capabilities.

### Core Architecture Pattern

The system follows a **three-tier request flow**:

```
User Input → Intention Detection → Response Generation → Streaming Output
```

### Key Architectural Components

#### 1. API Layer (`app/api/chat/route.ts`)

Single POST endpoint that orchestrates the entire chat flow:
- Receives chat object with message history
- Calls `IntentionModule.detectIntention()` to classify user intent
- Routes to appropriate response handler in `ResponseModule`
- Returns a ReadableStream with Server-Sent Events (SSE)

**Critical**: The API route initializes all three AI providers (OpenAI, Anthropic, Fireworks) and Pinecone client at module level, not per-request.

#### 2. Intention Detection (`modules/intention.ts`)

Uses OpenAI's structured output with Zod schema to classify messages into:
- `"question"` - Requires RAG pipeline and knowledge retrieval
- `"hostile_message"` - Inappropriate content, needs gentle deflection
- `"random"` - General conversation, no context needed

**Implementation**: Uses `openai.beta.chat.completions.parse()` with `zodResponseFormat()` for guaranteed structured JSON responses.

#### 3. Response Generation (`modules/response.ts`)

Three distinct response methods:

**A. `respondToQuestion()` - RAG Pipeline**
1. Generate hypothetical answer using HyDE technique (`utilities/chat.ts:generateHypotheticalData()`)
2. Embed hypothetical answer with `text-embedding-ada-002`
3. Query Pinecone for top-k similar chunks (default: 7)
4. Aggregate chunks by source and build context with citations
5. Stream response from configured AI provider with inline citation markers `[1]`, `[2]`, etc.

**B. `respondToRandomMessage()` - Direct Generation**
- Uses recent message history (configurable via `HISTORY_CONTEXT_LENGTH`)
- No RAG, just conversational AI with system prompt

**C. `respondToHostileMessage()` - Defensive Response**
- No message history (fresh context)
- Polite decline with identity protection (never reveals technical details or "OpenAI")

#### 4. Streaming System (`actions/streaming.ts`)

**Provider-agnostic streaming** with two implementations:
- `handleOpenAIStream()` - For OpenAI and Fireworks (OpenAI SDK compatible)
- `handleAnthropicStream()` - For Anthropic Claude models

**Stream Message Types**:
```typescript
{ type: "loading", indicator: { status: string, icon: IconType } }
{ type: "message", message: { role, content, citations } }
{ type: "error", indicator: { status: string, icon: "error" } }
{ type: "done", final_message: string }
```

Frontend must parse newline-delimited JSON stream.

### RAG Pipeline Deep Dive

**HyDE (Hypothetical Document Embeddings) Technique**:

Instead of embedding the user's question directly, the system:
1. Generates what an ideal answer *would* look like (`HYDE_MODEL`: gpt-4o-mini)
2. Embeds the hypothetical answer (more semantically rich)
3. Uses that embedding to find similar real documents in Pinecone

**Why HyDE?** Questions and answers have different semantic structures. Embedding a hypothetical answer finds documents that *answer* the question, not just documents that mention similar keywords.

**Pinecone Metadata Structure**:
```typescript
{
  text: string              // Main chunk content
  pre_context: string       // Text before chunk for continuity
  post_context: string      // Text after chunk for continuity
  source_url: string        // Unique source identifier
  source_description: string // Human-readable source name
  order: number             // Position in original document
}
```

**Citation System**: Chunks from the same `source_url` are grouped and numbered sequentially. The system injects `[1]`, `[2]` markers into the context sent to the AI, which the AI naturally includes in responses.

## Configuration System

The entire chatbot behavior is driven by files in `/configuration/`:

### Critical Configuration Files

#### `configuration/identity.ts`
Defines the AI's persona and owner information. Used in **all system prompts**.

**When modifying**: These values are referenced via imports throughout the codebase. Changing them updates the entire system's identity.

#### `configuration/models.ts`
Specifies which AI provider and model to use for each task:
- `INTENTION_MODEL` - For intent classification (default: gpt-4o-mini)
- `RANDOM_RESPONSE_PROVIDER/MODEL` - For casual chat
- `HOSTILE_RESPONSE_PROVIDER/MODEL` - For defensive responses
- `QUESTION_RESPONSE_PROVIDER/MODEL` - For RAG responses (default: gpt-4o)
- `HYDE_MODEL` - For hypothetical answer generation (default: gpt-4o-mini)

**Provider flexibility**: Change `QUESTION_RESPONSE_PROVIDER` to `"anthropic"` or `"fireworks"` to switch AI backends without code changes.

#### `configuration/prompts.ts`
System prompts for each intention type. **Critical for customization**.

**Key functions**:
- `RESPOND_TO_QUESTION_SYSTEM_PROMPT(context)` - Receives RAG context, must instruct AI to cite sources using `[N]` notation
- `HYDE_PROMPT(chat)` - Instructions for generating hypothetical answer
- `RESPOND_TO_HOSTILE_MESSAGE_SYSTEM_PROMPT()` - Defensive posture, identity protection

**When modifying**: Changes here directly affect AI behavior. Test thoroughly as prompts determine response quality.

#### `configuration/pinecone.ts`
- `PINECONE_INDEX_NAME` - Must match exact Pinecone index name
- `QUESTION_RESPONSE_TOP_K` - Number of chunks to retrieve (default: 7)

#### `configuration/chat.ts`
- `HISTORY_CONTEXT_LENGTH` - Number of previous messages to include (default: 8)
- `INITIAL_MESSAGE` - Bot's first message
- `WORD_CUTOFF` - Max conversation length before suggesting reset

#### `configuration/ui.ts`
UI text strings (headers, placeholders, button labels). No logic impact.

## Environment Variables

Required in `.env`:

```bash
OPENAI_API_KEY=sk-...           # Required: Used for embeddings, intent detection, and responses
ANTHROPIC_API_KEY=sk-ant-...    # Optional: Only if using Anthropic as response provider
FIREWORKS_API_KEY=...           # Optional: Only if using Fireworks as response provider
PINECONE_API_KEY=...            # Required: Vector database for RAG
```

**Critical**: Without `OPENAI_API_KEY` and `PINECONE_API_KEY`, the system will throw errors at module initialization in `app/api/chat/route.ts`.

## Type System

All types are defined in `/types/` and exported via `types/index.ts`.

### Key Types

**`Chat`** (`types/chat.ts`):
```typescript
{
  messages: DisplayMessage[]
}
```

**`DisplayMessage`** (`types/chat.ts`):
```typescript
{
  role: "user" | "assistant" | "system"
  content: string
  citations: Citation[]
}
```

**`CoreMessage`** (`types/chat.ts`):
Simplified message format for AI APIs (role + content only, no citations).

**`Intention`** (`types/chat.ts`):
```typescript
{
  type: "question" | "hostile_message" | "random"
}
```

**`Chunk`** (`types/data.ts`):
Represents a Pinecone vector match with metadata.

**`Source`** (`types/data.ts`):
Aggregated chunks from the same document.

**`AIProviders`** (`types/ai.ts`):
```typescript
{
  openai: OpenAI
  anthropic: Anthropic
  fireworks: OpenAI  // Uses OpenAI SDK with different baseURL
}
```

## Frontend Architecture

### Component Structure

**`app/page.tsx`** - Main chat interface container
**`components/chat/`** - Chat-specific components:
- `messages.tsx` - Renders message list with streaming updates
- `input.tsx` - User input handling and submission
- `citation.tsx` - Displays source citations inline
- `loading.tsx` - Shows RAG pipeline progress indicators
- `formatting.tsx` - Markdown, LaTeX, code highlighting

### State Management

**No global state library**. Uses:
- React `useState` for UI state
- Local storage for chat history persistence
- Server-sent events for streaming state

**Message flow**:
1. User submits in `input.tsx`
2. Component calls `/api/chat` with full message history
3. Decodes SSE stream and updates local state
4. Renders via `messages.tsx`

## Common Development Patterns

### Adding a New AI Provider

1. Add client initialization in `app/api/chat/route.ts`:
```typescript
const newProviderClient = new NewProvider({ apiKey: process.env.NEW_PROVIDER_KEY });
const providers: AIProviders = {
  // ... existing
  newProvider: newProviderClient
};
```

2. Update `types/ai.ts` to include new provider type
3. Add streaming handler in `actions/streaming.ts`
4. Add provider option to `configuration/models.ts`

### Modifying RAG Behavior

**To change retrieval strategy**:
- Modify `QUESTION_RESPONSE_TOP_K` in `configuration/pinecone.ts`
- Adjust `generateHypotheticalData()` prompt in `configuration/prompts.ts:HYDE_PROMPT()`

**To change context building**:
- Edit `utilities/chat.ts:getContextFromSources()` to format context differently
- Ensure citation markers `[N]` are preserved

**To add hybrid search** (keyword + semantic):
- Modify `searchForChunksUsingEmbedding()` in `utilities/chat.ts` to include Pinecone metadata filters

### Customizing System Prompts

All prompts are functions in `configuration/prompts.ts` that return strings. They dynamically inject values from `configuration/identity.ts`.

**Pattern**:
```typescript
export function MY_CUSTOM_PROMPT(context: string) {
  return `
${IDENTITY_STATEMENT} ${OWNER_STATEMENT}
Your custom instructions here.
Context: ${context}
  `;
}
```

Always include `IDENTITY_STATEMENT` and `OWNER_STATEMENT` for consistency.

## Testing Strategy

Current setup is minimal (`npm test` just echoes success).

**To add real tests**:
- Use Jest (already in package.json via Next.js)
- Create `__tests__/` directories alongside source files
- Mock AI API calls to avoid costs
- Test utility functions in `utilities/chat.ts` thoroughly (pure functions, easy to test)

## Deployment Considerations

### Vercel Deployment

The app is optimized for Vercel:
- API routes become serverless functions
- Environment variables set in Vercel dashboard
- Automatic builds on git push

**Important**: Set `maxDuration = 60` in `app/api/chat/route.ts` to allow long-running RAG pipelines.

### Edge Runtime Compatibility

**Not currently using Edge Runtime** due to:
- Pinecone SDK requires Node.js runtime
- OpenAI SDK streaming uses Node streams

Stay on Node.js runtime for API routes.

## Common Issues and Solutions

### "PINECONE_INDEX_NAME doesn't match"

- Verify exact index name in Pinecone dashboard
- Update `configuration/pinecone.ts:PINECONE_INDEX_NAME`
- Index names are case-sensitive

### "No chunks found" in RAG pipeline

- Check that documents are uploaded to Pinecone (use `make upsert` or RAG by Ringel tool)
- Verify index has vectors: Query in Pinecone console
- Confirm embedding dimension matches (OpenAI ada-002 = 1536 dimensions)

### Streaming not working

- Browser must support EventSource or fetch with ReadableStream
- Check Content-Type header is `text/event-stream`
- Frontend must parse newline-delimited JSON manually

### AI refuses to cite sources

- Ensure `RESPOND_TO_QUESTION_SYSTEM_PROMPT()` explicitly instructs citation
- Verify context string includes `[N]` markers (check `utilities/chat.ts:buildContextFromOrderedChunks()`)
- Try increasing `QUESTION_RESPONSE_TOP_K` to provide more context

## Code Organization Principles

1. **Configuration over code**: Behavior changes should be config file edits, not code changes
2. **Provider agnostic**: Business logic doesn't know which AI provider is used
3. **Pure utility functions**: All functions in `utilities/` are side-effect free (except AI calls)
4. **Type safety**: Every data shape has a Zod schema and TypeScript type
5. **Streaming by default**: No blocking waits, all responses stream

## Documentation

- **README.md** - User-facing setup and deployment guide
- **ARCHITECTURE.md** - Comprehensive technical architecture with Mermaid diagrams
- **This file (CLAUDE.md)** - Development guide for AI assistants

## Repository Structure

```
app/
  api/chat/route.ts          # Single API endpoint, orchestrates everything
  page.tsx                   # Main chat UI

modules/
  intention.ts               # Intent classification
  response.ts                # Response generation (3 methods)

actions/
  streaming.ts               # Provider-agnostic streaming

utilities/
  chat.ts                    # RAG pipeline implementation (HyDE, embeddings, context building)

configuration/
  identity.ts                # AI persona and owner info
  models.ts                  # Provider/model selection
  prompts.ts                 # System prompts (most customization happens here)
  pinecone.ts                # Vector DB config
  chat.ts                    # Conversation settings
  ui.ts                      # UI text strings

types/
  ai.ts, chat.ts, data.ts    # Type definitions and Zod schemas

components/chat/
  messages.tsx, input.tsx, citation.tsx, loading.tsx, formatting.tsx
```

## Working with This Codebase

### When Adding Features

1. **Start with types**: Define Zod schema in `/types/`, export TypeScript type
2. **Add configuration**: If behavior is customizable, add to `/configuration/`
3. **Implement in utilities**: Pure logic goes in `/utilities/`
4. **Wire in modules**: Business logic in `/modules/` uses utilities
5. **Update API route**: `app/api/chat/route.ts` orchestrates module calls
6. **Update frontend**: Components in `/components/chat/` consume API

### When Debugging

1. **Check environment variables**: Most issues are missing API keys
2. **Enable console logs**: Streaming functions log extensively
3. **Test utilities in isolation**: `utilities/chat.ts` functions are pure, easy to test
4. **Verify Pinecone**: Use Pinecone console to check index contents
5. **Check configuration**: Ensure `PINECONE_INDEX_NAME`, model names match actual resources

### When Refactoring

- **Never break configuration contract**: Components depend on config file structure
- **Keep streaming protocol stable**: Frontend expects specific JSON stream format
- **Preserve type definitions**: Breaking type changes cascade through entire codebase
- **Test RAG pipeline thoroughly**: HyDE technique is subtle, easy to break

## Footer Credit

Per LICENSE, the footer credit to the original creator must remain intact. This is in `components/chat/footer.tsx`.
