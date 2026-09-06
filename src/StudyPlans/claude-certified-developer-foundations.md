# Study Plan: Claude Certified Developer – Foundations

## Phase 1: Agents and Workflows

### Week 1: Agent Architecture
- [ ] Workflow versus agent decision criteria — when to use a workflow vs an agent
- [ ] Manager and supervisor hierarchies
- [ ] Role of subagents in an agent system
  - Site: [Exam guide](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/exam-guide.pdf)
  - Site: [Study notes](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/notes.md)

### Week 2: Agent Construction, Patterns & Frameworks
- [ ] Claude Agent SDK — building agents with it
- [ ] Custom agent loops and harnesses
- [ ] Self-hosted versus Anthropic-hosted managed agents
- [ ] Hooks for deterministic actions
- [ ] Tool-use loops, memory, and context-window management
- [ ] Abstraction frameworks: Strands, LangGraph, PydanticAI

## Phase 2: Applications and Integration

### Week 3: Requirements & Claude API Mechanics
- [ ] Understanding requirements and systems life cycle management
- [ ] Messages, tools, streaming, vision, thinking APIs
- [ ] Prompt caching and cache checkpointing
- [ ] Third-party vendors, and batch versus realtime selection
  - Site: [Building with the Claude API course](https://anthropic-partners.skilljar.com/claude-with-the-anthropic-api)
  - Site: [Developer prep path](https://anthropic-partners.skilljar.com/path/claude-certified-developer-foundations)

### Week 4: Foundations, Application Design & Configuration
- [ ] Software engineering foundations: REST, JSON, asynchronous programming, version control, code review, refactoring
- [ ] How Claude interprets instructions across Claude Code, Desktop, claude.ai, the API, and SDKs
- [ ] Content boundaries and schema design
- [ ] Session hygiene and plugin management
- [ ] Configuration management: CLAUDE.md files, settings.json
- [ ] Model version pinning and prompt versioning

## Phase 3: Claude Code

### Week 5: Core Components & Session Management
- [ ] Rules, Skills, Commands, Agents, and Agent Memory
- [ ] Session management
- [ ] Slash commands
  - Site: [Claude Code in Action course](https://anthropic-partners.skilljar.com/claude-code-in-action)

### Week 6: Claude Code Workflows
- [ ] Headless and streaming modes
- [ ] CLAUDE.md hierarchy
- [ ] settings.json configuration

## Phase 4: Eval, Testing, and Debugging

### Week 7: Error Identification & Recovery
- [ ] Error type identification
- [ ] Recovery strategies

### Week 8: Trace Analysis & Debugging
- [ ] Trace analysis
- [ ] Isolating problems between the integration layer and model output

## Phase 5: Model Selection and Optimization

### Week 9: LLM & Technical Fundamentals
- [ ] Tokens, context windows, sampling, and non-determinism
- [ ] Fast mode, extended and adaptive thinking, effort levels
- [ ] Zero-shot to multi-shot prompting
- [ ] SDKs wrapping REST APIs, and websockets

### Week 10: Model Selection, Cost & Token Management
- [ ] Opus, Sonnet, and Haiku use cases
- [ ] Quality, latency, and cost tradeoffs
- [ ] Breaking behavior changes across releases
- [ ] Usage tracking and cost modeling
- [ ] Prompt caching and cache checkpointing

## Phase 6: Prompt and Context Engineering

### Week 11: Context & Prompt Engineering
- [ ] Context-window management: preventing drift and bloat
- [ ] Tool output pruning and compaction
- [ ] Context isolation through subagents
- [ ] Instruction clarity and few-shot examples
- [ ] System versus user placement and output constraints
- [ ] Iterative refinement and input sanitization

### Week 12: Output Handling
- [ ] Structured output patterns
- [ ] Response validation and defensive parsing
- [ ] Skepticism toward confident output

## Phase 7: Security and Safety

### Week 13: AI Application Security
- [ ] Prompt injection mitigation and jailbreak defense
- [ ] Untrusted input handling
- [ ] Data leakage prevention and PII handling

### Week 14: Guardrails & Safe Deployment
- [ ] Content policy and guardrail layering
- [ ] Least privilege and identity/access management
- [ ] Claude hooks for guardrails
- [ ] Identity, secrets, and key management

## Phase 8: Tools and MCPs

### Week 15: Tool Implementation & MCP Server Development
- [ ] Function calling, tool description writing, and error handling
- [ ] Client-side versus server-side tools, and approval patterns
- [ ] MCP server authoring, deployment, resources, tools, prompts
- [ ] stdio and socket transports
  - Site: [Introduction to Model Context Protocol](https://anthropic-partners.skilljar.com/introduction-to-model-context-protocol)

### Week 16: Agentic Customization
- [ ] Tradeoffs among built-in tools, custom tools, Skills, and MCPs

## Phase 9: Hands-On Projects

### Project 1: Build a Claude API Application
- [ ] Build an application using the messages API with streaming and tool use
- [ ] Integrate a custom tool or MCP server
- [ ] Apply prompt caching and context engineering
- [ ] Add guardrails for prompt injection and least-privilege permissions
- [ ] Write a small evaluation suite and trace one failure end to end
  - Site: [Practice questions](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/practice-questions.md)

### Project 2: Set Up a Claude Code Workspace
- [ ] Configure CLAUDE.md, Skills, Commands, and Agent Memory for a real project
- [ ] Run the timed mock exam and review each wrong answer
  - Site: [Mock exam](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/mock-exam-1.md)
- [ ] Update the cheat sheet to your personal weak points
  - Site: [Cheat sheet](https://github.com/Amey-Thakur/CLAUDE-CERTIFICATIONS/blob/main/developer-foundations/cheat-sheet.md)

## Weekly Schedule Suggestion
- 3 hours theory per week
- 2 hours hands-on coding per week
- 1 hour review/notes per week
- Weekend: 1 project milestone or challenge