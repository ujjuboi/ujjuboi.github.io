# Study Plan: Claude Certified Developer – Foundations

## Phase 1: Agents and Workflows

### Day 1: Workflows vs Agents

- [ ] Workflow versus agent decision criteria — when to use a workflow vs an agent
- [ ] Manager and supervisor hierarchies

### Day 2: Subagents in Agent Systems

- [ ] Role of subagents in an agent system
  - Site: [Exam guide](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/exam-guide.pdf)
  - Site: [Study notes](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/notes.md)

### Day 3: Claude Agent SDK & Custom Loops

- [ ] Claude Agent SDK — building agents with it
- [ ] Custom agent loops and harnesses

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 4: Hosting, Hooks & Tool Loops

- [ ] Self-hosted versus Anthropic-hosted managed agents
- [ ] Hooks for deterministic actions
- [ ] Tool-use loops, memory, and context-window management

### Day 5: Abstraction Frameworks

- [ ] Abstraction frameworks: Strands, LangGraph, PydanticAI

## Phase 2: Applications and Integration

### Day 6: Requirements & API Mechanics

- [ ] Understanding requirements and systems life cycle management
- [ ] Messages, tools, streaming, vision, thinking APIs

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 7: Prompt Caching & Provider Selection

- [ ] Prompt caching and cache checkpointing
- [ ] Third-party vendors, and batch versus realtime selection
  - Site: [Building with the Claude API course](https://anthropic-partners.skilljar.com/claude-with-the-anthropic-api)
  - Site: [Developer prep path](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations)

### Day 8: Software Engineering Foundations

- [ ] Software engineering foundations: REST, JSON, asynchronous programming, version control, code review, refactoring
- [ ] How Claude interprets instructions across Claude Code, Desktop, claude.ai, the API, and SDKs

### Day 9: Content Boundaries & Session Hygiene

- [ ] Content boundaries and schema design
- [ ] Session hygiene and plugin management

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 10: Configuration & Prompt Versioning

- [ ] Configuration management: CLAUDE.md files, settings.json
- [ ] Model version pinning and prompt versioning

## Phase 3: Claude Code

### Day 11: Core Components & Session Management

- [ ] Rules, Skills, Commands, Agents, and Agent Memory
- [ ] Session management

### Day 12: Slash Commands

- [ ] Slash commands
  - Site: [Claude Code in Action course](https://anthropic-partners.skilljar.com/claude-code-in-action)

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 13: Headless & Streaming Modes

- [ ] Headless and streaming modes

### Day 14: Configuration Hierarchy

- [ ] CLAUDE.md hierarchy
- [ ] settings.json configuration

## Phase 4: Eval, Testing, and Debugging

### Day 15: Error Identification & Recovery

- [ ] Error type identification
- [ ] Recovery strategies

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 16: Trace Analysis & Debugging

- [ ] Trace analysis
- [ ] Isolating problems between the integration layer and model output

## Phase 5: Model Selection and Optimization

### Day 17: LLM & Technical Fundamentals

- [ ] Tokens, context windows, sampling, and non-determinism
- [ ] Fast mode, extended and adaptive thinking, effort levels

### Day 18: Prompting & SDK Integration

- [ ] Zero-shot to multi-shot prompting
- [ ] SDKs wrapping REST APIs, and websockets

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 19: Model Selection & Tradeoffs

- [ ] Opus, Sonnet, and Haiku use cases
- [ ] Quality, latency, and cost tradeoffs

### Day 20: Cost & Token Management

- [ ] Breaking behavior changes across releases
- [ ] Usage tracking and cost modeling
- [ ] Prompt caching and cache checkpointing

## Phase 6: Prompt and Context Engineering

### Day 21: Context-Window Management

- [ ] Context-window management: preventing drift and bloat
- [ ] Tool output pruning and compaction

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 22: Context Isolation & Instruction Design

- [ ] Context isolation through subagents
- [ ] Instruction clarity and few-shot examples

### Day 23: Placement & Iterative Refinement

- [ ] System versus user placement and output constraints
- [ ] Iterative refinement and input sanitization

### Day 24: Structured Output

- [ ] Structured output patterns
- [ ] Response validation and defensive parsing

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 25: Skepticism Toward Output

- [ ] Skepticism toward confident output

## Phase 7: Security and Safety

### Day 26: Prompt Injection & Untrusted Inputs

- [ ] Prompt injection mitigation and jailbreak defense
- [ ] Untrusted input handling

### Day 27: Data Leakage & PII Handling

- [ ] Data leakage prevention and PII handling

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 28: Guardrails & Least Privilege

- [ ] Content policy and guardrail layering
- [ ] Least privilege and identity/access management

### Day 29: Hooks, Identity & Secrets

- [ ] Claude hooks for guardrails
- [ ] Identity, secrets, and key management

## Phase 8: Tools and MCPs

### Day 30: Function Calling & Approval Patterns

- [ ] Function calling, tool description writing, and error handling
- [ ] Client-side versus server-side tools, and approval patterns

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 31: MCP Servers & Transports

- [ ] MCP server authoring, deployment, resources, tools, prompts
- [ ] stdio and socket transports
  - Site: [Introduction to Model Context Protocol](https://anthropic-partners.skilljar.com/introduction-to-model-context-protocol)

### Day 32: Agentic Customization

- [ ] Tradeoffs among built-in tools, custom tools, Skills, and MCPs

## Phase 9: Hands-On Projects

### Day 33: Project: Build a Claude API Application

- [ ] Build an application using the messages API with streaming and tool use
- [ ] Integrate a custom tool or MCP server

### Rest Day: Review & Recovery

> Rest — no study tasks. Optional: reread the week's chapters and review notes.

### Day 34: Project: Caching, Guardrails & Eval

- [ ] Apply prompt caching and context engineering
- [ ] Add guardrails for prompt injection and least-privilege permissions
- [ ] Write a small evaluation suite and trace one failure end to end
  - Site: [Practice questions](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/practice-questions.md)

### Day 35: Project: Configure a Claude Code Workspace

- [ ] Configure CLAUDE.md, Skills, Commands, and Agent Memory for a real project
- [ ] Run the timed mock exam and review each wrong answer
  - Site: [Mock exam](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/mock-exam-1.md)

### Day 36: Project: Mock Exam & Cheat Sheet

- [ ] Update the cheat sheet to your personal weak points
  - Site: [Cheat sheet](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/cheat-sheet.md)

## Weekly Schedule Suggestion

- 3 hours theory per week
- 2 hours hands-on coding per week
- 1 hour review/notes per week
- Weekend: 1 project milestone or challenge