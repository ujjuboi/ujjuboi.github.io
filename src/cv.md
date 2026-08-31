# CV -- Ujjwal Verma

**Location:** Delhi, 110076
**Email:** ujjwalv99@protonmail.com
**LinkedIn:** linkedin.com/in/ujjwal-verma99
**GitHub:** github.com/ujjuboi

## Professional Summary

Full-stack developer with 4+ years of experience in building enterprise-scale applications and AI-powered workflows. Specialized in Next.js, Express.js, SpringBoot, and AI integration for identity data analytics. Successfully transitioned from risk analysis to full-stack development with expertise in microservices, cloud platforms (AWS), and AI-driven automation solutions.

## Work Experience

### Deloitte USI -- Gurugram

**Software Engineer 2 - DI App Factory**
June 2026 - Present

![banner](../../Images/Graphics/MongoDB.svg)

#### Ingestion architecture
- Designed configurable API ingestion pipeline for trusted data sources with custom schema mapping, supporting LDIF data for users, computers, and groups
- Redesigned group membership handling into a dedicated collection with cross-entity references, linking SailPoint, Okta, and PingFederate data to directory objects
- Identified and resolved data upload bottleneck by relocating the MongoDB instance to reduce network latency

#### Performance optimization
- Improved bulk import throughput from **100K → 400K records/batch** through indexing, batch tuning, and replacing `findOneAndUpdate` with bulk writes — achieving **1,500 records/sec** and ingesting **18M records in 3-4 hours**

> [Read more: Scaling Identity Data Ingestion at Enterprise Scale](../Blog/Blog.html#post-0)

#### Platform & governance
- Migrated cross-platform data classification features to identify orphan groups and inactive service accounts across business applications
- Built quality gate check feature with custom business rulesets for staging data before write
- Created workflows to resolve shared groups, identify orphan owners, and auto-generate entitlement descriptions

### Deloitte USI -- Gurugram

**Software Engineer 1 - DI App Factory**
Dec 2025 - June 2026

![banner](../../Images/Graphics/GithubActions.svg)

#### Microservices & platform
- Developed, tested, and documented features for a large-scale enterprise onboarding and governance platform.
- Designed migration roadmap from modular monolith to microservices architecture by defining bounded contexts and service communication patterns.

#### GitHub agentic workflows
- Built AI-powered GitHub Agentic Workflows using `GitHub Actions` and LLM engines (Copilot / Claude / Codex) for autonomous PR automation with secure guardrails.
- Built Grumpy Code Reviewer and lint-check workflows to review PRs and enforce coding standards.
- Created automated jobs to generate PR descriptions from linked issues using contextual summarization agents.
- Configured PR-triggered CI/CD pipelines so review, documentation, testing, and quality workflows ran automatically on PR creation.

#### Documentation & QA automation
- Built Continuous AI workflows to auto-update Confluence documentation via web-fetch/web-search tools and scheduled GitHub Actions pipelines.
- Developed AI-assisted Playwright regression test generation workflows using issue context, PR metadata, and browser automation for release validation.

> [Read more: Teaching Machines to Read Legal Documents](../Blog/Blog.html#post-1)

### Deloitte USI -- Gurugram

**Associate Software Developer - DI App Factory**
July 2025 - Dec 2025

#### Full-stack delivery
- Adapted to a new technology stack (Next.js, ExpressJS, MongoDB, Redis) and software development lifecycle, contributing to bug fixes, feature implementation, and peer code reviews.
- Delivered on high-priority client requirements by enhancing user experience (UX) through optimized data handling with MongoDB aggregation pipelines, identified and resolved critical performance related bugs in API calls.

### Deloitte USI -- Gurugram

**Associate Software Developer - DDPX**
Nov 2023 - July 2025

![banner](../../Images/Graphics/ActiveDirectory.svg)

#### Full-stack development
- Worked as a full stack developer on a large-scale identity data analytics tool (DDPX), involving design, development, testing, and documentation.
- Built visual graph-based analytics with React Flow and ChartJS to find security vulnerabilities in identity data.
- Optimized dynamic data presentation in Next.js using dynamic routing, API payload tuning, and Bootstrap Table pagination; reduced data load time by 50%.

#### Identity & access integrations
- Designed and implemented role based access control (RBAC) in Java for monolithic application, creating a whitelist of APIs and blocking all by default using multi-tenant handler in SpringBoot.
- Set up SAML external Identity Provider like Okta, OAuth, AWS Cognito and Microsoft Azure Graph to make the tool more accessible.
- Researched offerings like Wiz and SkyArk to build a PoC integrating AWS IAM data using AWS SDK for Java, extending tool capabilities.
  - Developed diverse analytics use cases by correlating identity sources such as Active Directory, Microsoft Entra ID, and AWS IAM through MongoDB queries.

#### Analytics & ownership intelligence
- Created algorithms for ownership attribution in privileged entities with **95% accuracy**, blending deterministic methods and Llama-powered probabilistic approaches.
- Directed client engagements involving analysis of **100,000+ records** across multiple domains, uncovering vulnerabilities and flagging **80% of the data**.

> [Read more: Directory Data Analytics and Identity Correlation at Scale](../Blog/Blog.html#post-6)

### Deloitte USI -- Gurugram

**Risk & Financial Advisory Analyst - DDPX**
June 2022 - Nov 2023

#### Risk analysis & AI prototyping
- Developed an AI agent using machine learning (Spacy 3, NLTK) to identify potential owners of IAM principals based on description and info attributes.
- Deloitte AI Academy Certified – 8-week bootcamp covering Hadoop, PySpark, Tableau, GCP Vertex AI, NumPy, and Pandas.

## Projects

- **Sensor Data Communication** (Open Source) -- Real-time monitoring system achieving **0.3ms downtime** for remote sensor data streaming. Built on an MQTT Pub/Sub broker with WebSockets bridging the Django backend (Django Channels) to the dashboard. Handles high-throughput message queuing via a Redis priority queue that delivers critical alerts immediately while batching routine telemetry.

![banner](../../Images/Graphics/SensorData.svg)

> [Read more: Real-time Sensor Dashboards w/ MQTT & WebSockets](../Blog/Blog.html#post-5)

## Education

- BTech. Computer Science & Engineering, University of Petroleum & Energy Studies (7.66/10) May 2018 - Dec 2022

## Skills

- **Frontend/Backend:** Next.js, ExpressJS, React Flow, ChartJS, Django
- **Languages/Tools:** Java, Python, JavaScript, TypeScript, Git, Bash
- **Databases:** MongoDB, Redis, MySQL
- **Cloud/AI:** AWS, GCP, Docker, Kubernetes, LangChain, Spacy 3, NLTK, Hadoop, PySpark, Tableau, GCP Vertex AI, Numpy, Pandas
- **Infrastructure:** GitHub Actions, CI/CD, Microservices, Modular Monolith, Figma MCP