# Study Plan: Claude Certified Developer – Foundations

## Phase 1: Agents and Workflows

### Day 1: Sun, Sep 20 — Workflows vs Agents

- [ ] Workflow versus agent decision criteria — when to use a workflow vs an agent
- [ ] Manager and supervisor hierarchies

### Day 2: Mon, Sep 21 — Subagents in Agent Systems

- [ ] Role of subagents in an agent system
  - Site: [Exam guide](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/exam-guide.pdf)
  - Site: [Study notes](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/notes.md)

### Day 3: Tue, Sep 22 — Claude Agent SDK & Custom Loops

- [ ] Claude Agent SDK — building agents with it
- [ ] Custom agent loops and harnesses

### Rest Day: Wed, Sep 23 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 4: Thu, Sep 24 — Hosting, Hooks & Tool Loops

- [ ] Self-hosted versus Anthropic-hosted managed agents
- [ ] Hooks for deterministic actions
- [ ] Tool-use loops, memory, and context-window management

### Day 5: Fri, Sep 25 — Abstraction Frameworks

- [ ] Abstraction frameworks: Strands, LangGraph, PydanticAI

## Phase 2: Applications and Integration

### Day 6: Sat, Sep 26 — Requirements & API Mechanics

- [ ] Understanding requirements and systems life cycle management
- [ ] Messages, tools, streaming, vision, thinking APIs

### Rest Day: Sun, Sep 27 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 7: Mon, Sep 28 — Prompt Caching & Provider Selection

- [ ] Prompt caching and cache checkpointing
- [ ] Third-party vendors, and batch versus realtime selection
  - Site: [Building with the Claude API course](https://anthropic-partners.skilljar.com/claude-with-the-anthropic-api)
  - Site: [Developer prep path](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations)

### Day 8: Tue, Sep 29 — Software Engineering Foundations

- [ ] Software engineering foundations: REST, JSON, asynchronous programming, version control, code review, refactoring
- [ ] How Claude interprets instructions across Claude Code, Desktop, claude.ai, the API, and SDKs

### Day 9: Wed, Sep 30 — Content Boundaries & Session Hygiene

- [ ] Content boundaries and schema design
- [ ] Session hygiene and plugin management

### Rest Day: Thu, Oct 1 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 10: Fri, Oct 2 — Configuration & Prompt Versioning

- [ ] Configuration management: CLAUDE.md files, settings.json
- [ ] Model version pinning and prompt versioning

## Phase 3: Claude Code

### Day 11: Sat, Oct 3 — Core Components & Session Management

- [ ] Rules, Skills, Commands, Agents, and Agent Memory
- [ ] Session management

### Day 12: Sun, Oct 4 — Slash Commands

- [ ] Slash commands
  - Site: [Claude Code in Action course](https://anthropic-partners.skilljar.com/claude-code-in-action)

### Rest Day: Mon, Oct 5 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 13: Tue, Oct 6 — Headless & Streaming Modes

- [ ] Headless and streaming modes

### Day 14: Wed, Oct 7 — Configuration Hierarchy

- [ ] CLAUDE.md hierarchy
- [ ] settings.json configuration

## Phase 4: Eval, Testing, and Debugging

### Day 15: Thu, Oct 8 — Error Identification & Recovery

- [ ] Error type identification
- [ ] Recovery strategies

### Rest Day: Fri, Oct 9 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 16: Sat, Oct 10 — Trace Analysis & Debugging

- [ ] Trace analysis
- [ ] Isolating problems between the integration layer and model output

## Phase 5: Model Selection and Optimization

### Day 17: Sun, Oct 11 — LLM & Technical Fundamentals

- [ ] Tokens, context windows, sampling, and non-determinism
- [ ] Fast mode, extended and adaptive thinking, effort levels

### Day 18: Mon, Oct 12 — Prompting & SDK Integration

- [ ] Zero-shot to multi-shot prompting
- [ ] SDKs wrapping REST APIs, and websockets

### Rest Day: Tue, Oct 13 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 19: Wed, Oct 14 — Model Selection & Tradeoffs

- [ ] Opus, Sonnet, and Haiku use cases
- [ ] Quality, latency, and cost tradeoffs

### Day 20: Thu, Oct 15 — Cost & Token Management

- [ ] Breaking behavior changes across releases
- [ ] Usage tracking and cost modeling
- [ ] Prompt caching and cache checkpointing

## Phase 6: Prompt and Context Engineering

### Day 21: Fri, Oct 16 — Context-Window Management

- [ ] Context-window management: preventing drift and bloat
- [ ] Tool output pruning and compaction

### Rest Day: Sat, Oct 17 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 22: Sun, Oct 18 — Context Isolation & Instruction Design

- [ ] Context isolation through subagents
- [ ] Instruction clarity and few-shot examples

### Day 23: Mon, Oct 19 — Placement & Iterative Refinement

- [ ] System versus user placement and output constraints
- [ ] Iterative refinement and input sanitization

### Day 24: Tue, Oct 20 — Structured Output

- [ ] Structured output patterns
- [ ] Response validation and defensive parsing

### Rest Day: Wed, Oct 21 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 25: Thu, Oct 22 — Skepticism Toward Output

- [ ] Skepticism toward confident output

## Phase 7: Security and Safety

### Day 26: Fri, Oct 23 — Prompt Injection & Untrusted Inputs

- [ ] Prompt injection mitigation and jailbreak defense
- [ ] Untrusted input handling

### Day 27: Sat, Oct 24 — Data Leakage & PII Handling

- [ ] Data leakage prevention and PII handling

### Rest Day: Sun, Oct 25 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 28: Mon, Oct 26 — Guardrails & Least Privilege

- [ ] Content policy and guardrail layering
- [ ] Least privilege and identity/access management

### Day 29: Tue, Oct 27 — Hooks, Identity & Secrets

- [ ] Claude hooks for guardrails
- [ ] Identity, secrets, and key management

## Phase 8: Tools and MCPs

### Day 30: Wed, Oct 28 — Function Calling & Approval Patterns

- [ ] Function calling, tool description writing, and error handling
- [ ] Client-side versus server-side tools, and approval patterns

### Rest Day: Thu, Oct 29 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 31: Fri, Oct 30 — MCP Servers & Transports

- [ ] MCP server authoring, deployment, resources, tools, prompts
- [ ] stdio and socket transports
  - Site: [Introduction to Model Context Protocol](https://anthropic-partners.skilljar.com/introduction-to-model-context-protocol)

### Day 32: Sat, Oct 31 — Agentic Customization

- [ ] Tradeoffs among built-in tools, custom tools, Skills, and MCPs

## Phase 9: Hands-On Projects

### Day 33: Sun, Nov 1 — Project: Build a Claude API Application

- [ ] Build an application using the messages API with streaming and tool use
- [ ] Integrate a custom tool or MCP server

### Rest Day: Mon, Nov 2 — Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 34: Tue, Nov 3 — Project: Caching, Guardrails & Eval

- [ ] Apply prompt caching and context engineering
- [ ] Add guardrails for prompt injection and least-privilege permissions
- [ ] Write a small evaluation suite and trace one failure end to end
  - Site: [Practice questions](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/practice-questions.md)

### Day 35: Wed, Nov 4 — Project: Configure a Claude Code Workspace

- [ ] Configure CLAUDE.md, Skills, Commands, and Agent Memory for a real project
- [ ] Run the timed mock exam and review each wrong answer
  - Site: [Mock exam](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/mock-exam-1.md)

### Day 36: Thu, Nov 5 — Project: Mock Exam & Cheat Sheet

- [ ] Update the cheat sheet to your personal weak points
  - Site: [Cheat sheet](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/cheat-sheet.md)

## Weekly Schedule Suggestion

- 3 hours theory per week
- 2 hours hands-on coding per week
- 1 hour review/notes per week
- Weekend: 1 project milestone or challenge