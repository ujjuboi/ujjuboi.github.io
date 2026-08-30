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

#### Ingestion architecture
- Conducted architectural design study comparing DDX and Service Center data ingestion approaches, identifying that DDX's `S3 + MongoDB GridFS` architecture enabled faster and more scalable processing
- Enhanced data ingestion capabilities by developing configurable API integration for trusted data sources with custom mapping functionality to align client data points with internal schema attributes
- Implemented LDIF data ingestion for users, computers, and groups, with architectural redesign to handle group memberships more efficiently by creating a dedicated group membership collection with object references between groups, users, and applications
  - Designed and implemented schema attributes to establish relationships between SailPoint, Okta, and PingFederate data points (applications, accounts, identities, entitlements, workstations) and directory users, groups, and computers
- Led architectural decision-making process to balance system performance with compliance requirements, determining that while S3 uploads would provide better scalability, the additional AWS compliance overhead made optimizing existing MongoDB operations a more practical solution
  - Identified data upload bottleneck between the EC2 instance server on which the app image was deployed and the MongoDB server instance; moved the DB server to the same location to reduce network latency during import

#### Performance optimization
- Improved bulk import performance from **100K → 400K records per batch**, enabling processing of large-scale datasets with a **500% increase in throughput**
- Optimized MongoDB data ingestion from 10 to **1,500 records/sec** through comprehensive performance profiling, new indexing strategies, batch size optimization, and bulk write operations instead of findOneAndUpdate, enabling ingestion of **18 million group membership records** in just 3-4 hours (**90% reduction in processing time**)

#### Platform & governance features
- Migrated DDX's data classification, definition and usecases feature into app factory to identify orphan groups, inactive service accounts making it cross platform instead of DDX's specific directory data, creating correlation between inactive service accounts in business application, groups and entitlements
- Extended the existing feature to track and alert on data ingestion errors, creating a quality gate check feature to create custom business rulesets that the data is ran upon and is staged before writing it to the db
- Created business application specific workflows to resolve shared groups, identify potential owners of orphan groups, generate description for entitlements based on metadata

### Deloitte USI -- Gurugram

**Software Engineer 1 - DI App Factory**
Dec 2025 - June 2026

#### Microservices & platform
- Developed, tested, and documented features for a large-scale enterprise onboarding and governance platform.
- Designed migration roadmap from modular monolith to microservices architecture by defining bounded contexts and service communication patterns.

#### GitHub agentic workflows
- Built AI-powered GitHub Agentic Workflows using `GitHub Actions`, markdown-defined workflows, `gh CLI`, and GitHub Copilot / Claude / Codex engines for autonomous pull request automation with secure guardrails.
- Implemented Grumpy Code Reviewer using tools.github and LLM agents to review PRs, detect maintainability issues, and improve code review turnaround time.
- Added intelligent lint-check workflows using bash tools, repository context tools, and PR triggers to validate coding standards and prevent unnecessary code changes.
- Created automated jobs to generate PR descriptions from linked issues using GitHub issues + pull_requests toolsets, contextual summarization agents, and safe outputs.
- Configured PR-triggered CI/CD pipelines so all review, documentation, testing, and quality workflows executed automatically on pull request creation.

#### Documentation & QA automation
- Built Continuous AI workflows to automatically update Confluence documentation using web-fetch / web-search tools, external integrations, and scheduled GitHub Actions pipelines.
- Developed AI-assisted Playwright regression test generation workflows using playwright tools, issue context, PR metadata, and browser automation for release validation.
  - Built both high-code and low-code AI agents using LangChain, integrating prompt chains, tool-calling flows, retrieval pipelines, and enterprise automation use cases.

### Deloitte USI -- Gurugram

**Associate Software Developer - DI App Factory**
July 2025 - Dec 2025

#### Full-stack delivery
- Adapted to a new technology stack (Next.js, ExpressJS, MongoDB, Redis) and software development lifecycle, contributing to bug fixes, feature implementation, and peer code reviews.
- Delivered on high-priority client requirements by enhancing user experience (UX) through optimized data handling with MongoDB aggregation pipelines, identified and resolved critical performance related bugs in API calls.

### Deloitte USI -- Gurugram

**Associate Software Developer - DDPX**
Nov 2023 - July 2025

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

### Deloitte USI -- Gurugram

**Risk & Financial Advisory Analyst - DDPX**
June 2022 - Nov 2023

#### Risk analysis & AI prototyping
- Developed an AI agent using machine learning (Spacy 3, NLTK) to identify potential owners of IAM principals based on description and info attributes.
- Deloitte AI Academy Certified – 8-week bootcamp covering Hadoop, PySpark, Tableau, GCP Vertex AI, NumPy, and Pandas.

## Projects

- **Sensor Data Communication** (Open Source) -- Real-time dashboard with 0.3ms downtime to display remote sensor data using MQTT, WebSockets - Pub/Sub, and Django.

## Education

- BTech. Computer Science & Engineering, University of Petroleum & Energy Studies (7.66/10) May 2018 - Dec 2022

## Skills

- **Frontend/Backend:** Next.js, ExpressJS, React Flow, ChartJS, Django
- **Languages/Tools:** Java, Python, JavaScript, TypeScript, Git, Bash
- **Databases:** MongoDB, Redis, MySQL
- **Cloud/AI:** AWS, GCP, Docker, Kubernetes, LangChain, Spacy 3, NLTK, Hadoop, PySpark, Tableau, GCP Vertex AI, Numpy, Pandas
- **Infrastructure:** GitHub Actions, CI/CD, Microservices, Modular Monolith, Figma MCP